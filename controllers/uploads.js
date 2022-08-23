const path = require('path');
const fs = require('fs');

// importando el paquete de cloudinary
const cloudinary = require('cloudinary').v2;
// extrayendo de la variable de entorno
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, json } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res = response) => {
	// esperando req del archivo que viene
	// if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
	// 	return res.status(400).json({ Msg: 'No hay archivos que subir' });
	// }

	try {
		// const pathArchivo = await subirArchivo(req.files, ['txt', 'md'], 'textos');
		const pathArchivo = await subirArchivo(req.files, undefined, 'imgs');
		res.json({
			// path: pathArchivo,
			nombre: pathArchivo,
		});
	} catch (msg) {
		res.status(400).json({ msg });
	}
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	// sampleFile = req.files.archivo;
	//Desestructurando lo anterior ( archivo)
};

//Actualizar imagen
const actualizarImg = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	// Validando las colecciones

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id: ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({ msg: 'Se me olvidó validar esto' });
	}

	// if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
	// 	return res.status(400).json({ Msg: 'No hay archivos que subir' });
	// }

	//Limpiar imágenes previas

	if (modelo.img) {
		// hay que borrar la imagen del servidor
		const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

		if (fs.existsSync(pathImagen)) {
			fs.unlinkSync(pathImagen);
		}
	}

	const pathArchivo = await subirArchivo(req.files, undefined, coleccion);
	modelo.img = pathArchivo;

	await modelo.save();

	res.json(modelo);
};

//Actualizar imagen con Cloudinary
const actualizarImgCloudinary = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	// Validando las colecciones

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id: ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({ msg: 'Se me olvidó validar esto' });
	}

	if (modelo.img) {
		const nombreArr = modelo.img.split('/');
		console.log(nombreArr);
		const nombre = nombreArr[nombreArr.length - 1];
		console.log(nombre);
		const [public_id] = nombre.split('.');
		console.log(public_id);
		cloudinary.uploader.destroy(public_id);
	}

	//? Para verificar de donde viene la imagen el path
	// console.log(req.files.archivo);

	const { tempFilePath } = req.files.archivo;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
	modelo.img = secure_url;

	// const pathArchivo = await subirArchivo(req.files, undefined, coleccion);
	// modelo.img = pathArchivo;

	//save DB
	await modelo.save();

	res.json(modelo);
	// res.json(resp);
};

const mostrarImg = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	// Validando las colecciones

	switch (coleccion) {
		case 'usuarios':
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id: ${id}`,
				});
			}
			break;

		case 'productos':
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id: ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({ msg: 'Se me olvidó validar esto' });
	}

	if (modelo.img) {
		//construyendo el path donde se va a guardar
		const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

		if (fs.existsSync(pathImagen)) {
			return res.sendFile(pathImagen);
		}
		//construyendo para que nos devuelva el path desde cloudinary

		return res.send(modelo.img);
	}
	// Aqui mandamos una img por defecto si el producto o usuario no tiene img

	const imgNoFound = path.join(__dirname, '../assets/', 'no-image.jpg');
	return res.sendFile(imgNoFound);
};

module.exports = {
	cargarArchivo,
	actualizarImg,
	mostrarImg,
	actualizarImgCloudinary,
};
