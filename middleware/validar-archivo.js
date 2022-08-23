/**
 * Validar el archivo a subir al server
 */

const { response } = require('express');

const validarArchivo = (req, res = response, next) => {
	if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
		return res.status(400).json({ Msg: 'No hay archivos que subir - validarArchivoSubir' });
	}

	next();
};

module.exports = { validarArchivo };
