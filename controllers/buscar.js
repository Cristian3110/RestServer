const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
	// separando la busqueda de término
	const esMongoId = isValidObjectId(termino); // true or false

	if (esMongoId) {
		const usuario = await Usuario.findById(termino);
		return res.json({
			results: usuario ? [usuario] : [],
		});
	}

	//expresión regular para busqueda (insensible a las mayusculas)
	const regex = new RegExp(termino, 'i');

	// aplicando la propiedad de mongo para buscar 2 condiciones para la expresión regular o termino
	const usuarios = await Usuario.find({
		//condiciones
		$or: [{ nombre: regex }, { correo: regex }],
		$and: [{ estado: true }],
	});

	res.json({
		results: usuarios,
	});
};

const buscarCategorias = async (termino = '', res = response) => {
	const esMongoId = isValidObjectId(termino);
	//buscando por id la categoria
	if (esMongoId) {
		const categoria = await Categoria.findById(termino);
		return res.status(200).json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const categorias = await Categoria.find({ nombre: regex, estado: true });

	res.json({
		results: categorias,
	});
};

const buscarProductos = async (termino = '', res = response) => {
	const esMongoId = isValidObjectId(termino);
	//buscando por id la categoria
	if (esMongoId) {
		const producto = await Producto.findById(termino)
			.populate('categoria', 'nombre')
			.populate('usuario', 'nombre');
		return res.status(200).json({
			results: producto ? [producto] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const productos = await Producto.find({ nombre: regex, estado: true }).populate(
		'categoria',
		'nombre'
	);

	res.json({
		results: productos,
	});
};

const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case 'usuarios':
			buscarUsuarios(termino, res);
			break;
		case 'categorias':
			buscarCategorias(termino, res);
			break;
		case 'productos':
			buscarProductos(termino, res);
			break;
		default:
			res.status(500).json({
				msg: 'Se le olvidó hacer ésta búsqueda',
			});
	}

	// res.json({
	// 	coleccion,
	// 	termino,
	// 	msg: 'Buscar....',
	// });
};

module.exports = {
	buscar,
};
