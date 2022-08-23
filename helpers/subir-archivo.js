/**
 * creando el helpers de subir-imagenes
 */
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (
	files,
	extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'],
	carpeta = ''
) => {
	return new Promise((resolve, reject) => {
		// Lo que se está recibiendo
		const { archivo } = files;
		const nombreCortado = archivo.name.split('.');
		// console.log(nombreCortado);
		//sacando la extension del archivo por la ultima posicion del []
		const extension = nombreCortado[nombreCortado.length - 1];

		// validar la extensión permitidas
		// const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

		if (!extensionesValidas.includes(extension)) {
			return reject(
				`La extensión ${extension}, no es permitida! Sugerencia ${extensionesValidas}`
			);
			// return res.status(400).json({
			// 	msg: `La extensión ${extension} del archivo, no es permitida! Sugerencia ${extensionesValidas}`,
			// });
		}
		// res.json({ extension });

		const nombreTemporal = uuidv4() + '.' + extension;
		const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);
		// Use the mv() method to place the file somewhere on your server
		archivo.mv(uploadPath, (err) => {
			if (err) {
				// return res.status(500).json({ err });
				reject(err);
			}
			// res.status(200).json({ msg: 'File uploaded to' + uploadPath });
			// resolve(uploadPath);
			resolve(nombreTemporal);
		});
		// console.log(req.files);
		// res.json({
		// 	msg: 'Archivo cargado',
		// });
	});
};

module.exports = {
	subirArchivo,
};
