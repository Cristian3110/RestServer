// this Router comming from express
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');
const {
	crearProducto,
	obtenerProductos,
	obtenerProducto,
	actualizarProducto,
	borrarProducto,
} = require('../controllers/productos');

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/dbValidators');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerProductos);

// Obtener un Producto por Id - público
router.get(
	'/:id',
	[
		check('id', 'No es un Id de Mongo').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	obtenerProducto
);

// Crear un nuevo Producto - privado con un token válido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('categoria', 'No es un Id de Mongo valido').isMongoId(),
		check('categoria').custom(existeCategoriaPorId),
		validarCampos,
	],
	crearProducto
);

// Actualizar privado - cualquiera con token válido
router.put(
	'/:id',
	[
		validarJWT,
		check('categoria', 'NO es un Id de Mongo').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	actualizarProducto
);

router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un Id de Mongo').isMongoId(),
		validarCampos,
		check('id').custom(existeProductoPorId),
	],
	borrarProducto
);

module.exports = router;
