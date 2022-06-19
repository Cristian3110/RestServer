/******************
 * Validar JWT
 *****************/

const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		// Leer el usuario que corresponde al uid

		const usuario = await Usuario.findById(uid);

		if (!usuario) {
			return res.status(401).json({
				msg: 'Token no valido - usuario no existe en la DB',
			});
		}

		// Verificar si el uid tiene estado TRUE
		//?Nota: El usuario en False no debería lograr autenticarse

		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Token no valido - usuario no está activo en DB',
			});
		}

		req.usuario = usuario;

		// console.log(payload);

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'Token no Valido',
		});
	}
};

module.exports = {
	validarJWT,
};
