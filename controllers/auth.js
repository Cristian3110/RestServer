const { response } = require('express');
const bcrytjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generate-jwt.js');

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

module.exports = { login };
