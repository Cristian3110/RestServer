/**
 * controlando nuestros productos
 */

const { response } = require('express');
const { Producto } = require('../models');

// Obtener categorías - páginado - total - populate

const obtenerProductos = async (req, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	// Para traer solo usuarios con estados en true
	const query = { estado: true };

	//? utilizando el populate
	const [total, productos] = await Promise.all([
		Producto.countDocuments(query),
		Producto.find(query)
			.populate('usuario', 'nombre')
			.populate('categoria', 'nombre')
			.limit(Number(limite))
			.skip(Number(desde)),
	]);

	res.json({
		total,
		productos,
	});
};

// Obtener Producto  - populate{}

const obtenerProducto = async (req, res = response) => {
	//validando
	const { id } = req.params;

	const producto = await Producto.findById(id)
		.populate('usuario', 'nombre')
		.populate('categoria', 'nombre');

	res.json({
		producto,
	});
};

// Crear producto

const crearProducto = async (req, res = response) => {
	// ** Nota: Se manejó el error E11000 duplicate key error collection con el try and Catch (investigar)
	try {
		const { estado, usuario, ...body } = req.body;

		//verificando si hay un producto en BD igual
		const productoDB = await Producto.findOne({ nombre: body.nombre });
		if (productoDB) {
			return res.status(400).json({
				msg: `El producto ${productoDB.nombre}, ya existe`,
			});
		}

		// Generando la data a guardar
		const data = {
			...body,
			nombre: body.nombre.toUpperCase(),
			usuario: req.usuario._id,
		};

		console.log(data);

		const producto = new Producto(data);

		// Guardar DB

		await producto.save();

		res.status(201).json({
			producto,
		});
	} catch (error) {
		res.status(400).json({
			msg: `El producto ${error.keyValue.nombre} ya está registrado`,
		});
	}
};

// Actualizar producto

const actualizarProducto = async (req, res = response) => {
	const { id } = req.params;

	const { estado, usuario, ...data } = req.body;

	if (data.nombre) {
		data.nombre = data.nombre.toUpperCase();
	}
	data.usuario = req.usuario._id;

	const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

	res.json(producto);
};

// Borrar producto - solo cambiando el estado a Falso

const borrarProducto = async (req, res = response) => {
	const { id } = req.params;
	const productoEliminado = await Producto.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	);

	res.status(200).json(productoEliminado);
};

module.exports = {
	crearProducto,
	obtenerProductos,
	obtenerProducto,
	actualizarProducto,
	borrarProducto,
};
