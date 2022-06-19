/**
 * Controladores
 */

const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
	// Solicitud de usuarios por
	const { limite = 5, desde = 0 } = req.query;
	// Para traer solo usuarios con estados en true
	const query = { estado: true };

	//? Como referencia
	// const usuarios = await Usuario.find(query).limit(Number(limite)).skip(Number(desde));
	// const total = await Usuario.countDocuments(query);

	//?Destructuración de arreglos, no de objetos
	//Utilizando Promise.all para que se ejecuten las 2 promesa en simultaneo y minimizar los seg
	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).limit(Number(limite)).skip(Number(desde)),
	]);

	//obteniendo todos los params query desde la ruta
	// const query = req.query;
	//obteniendo de manera desestructurada
	// const { q, nombre, apikey, page = 1, limit } = req.query;
	//* Nota: En caso de no envíar el parametro de la página, colocamos uno por defecto q es la 1
	res.json({
		msg: 'Get API - Controlador',
		// query, <-- Así vendrían todos
		// q,
		// nombre,
		// apikey,
		// page,
		// limit,
		total,
		usuarios,
		//resp,
	});
};

const usuariosPost = async (req, res = response) => {
	//? Este código lo convertimos a un middlewares para optimizar código
	// const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	return res.status(400).json(errors);
	// }

	// const body = req.body;
	//* Podemos desestructurar de la siguiente manera para especificar o validar lo q se manda
	const { nombre, correo, password, rol } = req.body;
	// const body = req.body;
	// const usuario = new Usuario(body);
	//? desestructurando solo los campos obligatorios
	const usuario = new Usuario({ nombre, correo, password, rol });

	//?Verificar si el correo existe
	// const existeEmail = await Usuario.findOne({ correo: correo });
	// if (existeEmail) {
	// 	return res.status(400).json({
	// 		msg: 'Ese correo ya se encuentra registrado',
	// 	});
	// }

	//Encriptar la contraseña
	const salt = bcrypt.genSaltSync();
	usuario.password = bcrypt.hashSync(password, salt);

	// con esto hacemos la grabacion en DB
	await usuario.save();

	//?Para mandar un status de código desde back
	res.status(202).json({
		// msg: 'Post API - From controlador',
		// body: body,
		// nombre,
		// apellido,
		usuario,
	});
};
const usuariosPut = async (req, res = response) => {
	// params id
	// const id = req.params.id;
	//También si tuvieramos más elementos, se pueden desestructurar
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;

	// TODO: Validar contra base de Datos

	if (password) {
		const salt = bcrypt.genSaltSync();
		resto.password = bcrypt.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json({
		// msg: 'Put API - From Controlador',
		usuario,
	});
};

const usuariosPatch = (req, res) => {
	res.status(500).json({
		msg: 'Patch API - From controlador',
	});
};

const usuariosDelete = async (req, res) => {
	const { id } = req.params;

	const uid = req.uid;

	//!fisicamente borrando un usuario (no recomendado)
	// const usuario = await Usuario.findByIdAndDelete(id);

	// Cambiamos el estado del usuario en la DB como deshabilitado (recomendable)
	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

	//const usuarioAutenticado
	const usuarioAutenticado = req.usuario;

	res.json({
		// msg: 'Delete API - From controlador',
		msg: `Usuario con id: ${id} fue eliminado (deshabilitado)`,
		id,
		usuario,
		uid,
		usuarioAutenticado,
	});
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete,
};
