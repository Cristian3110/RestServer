// this Router comming from express
const { Router } = require('express');
const { check } = require('express-validator');
const {
	cargarArchivo,
	actualizarImg,
	mostrarImg,
	actualizarImgCloudinary,
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivo } = require('../middleware');

const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put(
	'/:coleccion/:id',
	[
		check('id', 'El id debe ser un id de mongo').isMongoId(),
		check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
		validarArchivo,
		validarCampos,
	],
	actualizarImgCloudinary
	// actualizarImg
);

router.get(
	'/:coleccion/:id',
	[
		check('id', 'El id debe ser un id de mongo').isMongoId(),
		check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
		validarCampos,
	],
	mostrarImg
);

module.exports = router;
