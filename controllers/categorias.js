/**
 * controlando nuestra categoria
 */

const { response } = require('express');
const { Categoria } = require('../models');

// Obtener categorías - páginado - total - populate

const obtenerCategorias = async (req, res = response) => {
	const { limite = 10, desde = 0 } = req.query;
	// Para traer solo usuarios con estados en true
	const query = { estado: true };

	//? utilizando el populate
	const [total, categorias] = await Promise.all([
		Categoria.countDocuments(query),
		Categoria.find(query)
			.populate('usuario', 'nombre')
			.limit(Number(limite))
			.skip(Number(desde)),
	]);

	res.json({
		total,
		categorias,
	});
};

// Obtener categoría  - populate{}

const obtenerCategoria = async (req, res = response) => {
	//validando
	const { id } = req.params;

	const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

	res.json({
		categoria,
	});
};

// Crear categoria

const crearCategoria = async (req, resp = response) => {
	const nombre = req.body.nombre.toUpperCase();

	//verificando si hay una categoria en BD igual
	const categoriaDB = await Categoria.findOne({ nombre });

	if (categoriaDB) {
		return resp.status(400).json({
			msg: `La categoria ${categoriaDB.nombre}, ya existe`,
		});
	}

	// Generando la data a guardar
	const data = {
		nombre,
		usuario: req.usuario._id,
	};

	// console.log(data);

	const categoria = new Categoria(data);

	// Guardar DB

	await categoria.save();

	resp.status(201).json({
		categoria,
	});
};

// Actualizar categorías

const actualizarCategoria = async (req, res = response) => {
	const { id } = req.params;

	const { estado, usuario, ...data } = req.body;

	data.nombre = data.nombre.toUpperCase();
	data.usuario = req.usuario._id;

	const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

	res.json(categoria);
};

// Borrar categoria - solo cambiando el estado a Falso

const borraCategoria = async (req, res = response) => {
	const { id } = req.params;
	const categoriaEliminada = await Categoria.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	);

	res.status(200).json(categoriaEliminada);
};

module.exports = {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	borraCategoria,
};
