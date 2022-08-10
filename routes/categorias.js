// this Router comming from express
const { Router } = require('express');
const { check } = require('express-validator');
const {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	borraCategoria,
} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/dbValidators');

const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por Id - público
router.get(
	'/:id',
	[
		check('id', 'No es un Id de Mongo').isMongoId(),
		validarCampos,
		check('id').custom(existeCategoriaPorId),
	],
	obtenerCategoria
);

// Crear una nueva categoria - privado con un token válido
router.post(
	'/',
	[validarJWT, check('nombre', 'El nombre es obligatorio').not().isEmpty(), validarCampos],
	crearCategoria
);

// Actualizar privado - cualquiera con token válido
router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('id').custom(existeCategoriaPorId),
		validarCampos,
	],
	actualizarCategoria
);

router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un Id de Mongo').isMongoId(),
		validarCampos,
		check('id').custom(existeCategoriaPorId),
	],
	borraCategoria
);

module.exports = router;
