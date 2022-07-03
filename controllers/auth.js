const { response, request } = require('express');
const bcrytjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generate-jwt.js');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		// verificar si el Email existe
		const usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - correo',
			});
		}

		//Si el usuario está activo
		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - estado: false',
			});
		}

		//Verificacion de contraseña
		const validPassword = bcrytjs.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - password',
			});
		}

		// Generando el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			msg: 'Login OK',
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		response.status(500).json({
			msg: 'Comuniquese con el Administrador',
		});
	}
};

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;

	//? Lo que viene de google lo  vamos a desestrcuturar
	// const googleUser = await googleVerify(id_token);

	// console.log(googleUser);

	try {
		const { nombre, correo, img } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });
		if (!usuario) {
			//TODO: Tengo que crearlo
			const data = {
				nombre,
				correo,
				password: ':P',
				img,
				google: true,
			};
			// creamos el nuevo usuario y guardamos en BD
			usuario = new Usuario(data);
			await usuario.save();
		}
		// SI el usuario en DB
		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Hable con el administrador, usuario bloqueado',
			});
		}
		//Generando token
		const token = await generarJWT(usuario.id);

		res.json({
			msg: 'Todo OK con el googleSingIn',
			// id_token,
			// googleUser,
			usuario,
			token,
		});
	} catch (error) {
		res.status(400).json({
			msg: 'Token de google no es valido',
		});
	}
};

module.exports = { login, googleSignIn };
