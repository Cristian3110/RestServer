/*******************************************
 * Definiendo las rutas de nuestro backend
 *****************************************/

// this Router comming from express
const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middleware/validar-campos');
// const { validarJWT } = require('../middleware/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middleware/validar-roles');

// no necesita referencia del index, lo toma automático
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middleware');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/dbValidators');

const {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosPatch,
} = require('../controllers/usuarios');

const router = Router();

//Ruta que viene definida de archivos independientes y controladores
router.get('/', usuariosGet);

router.put(
	'/:id',
	[
		check('id', 'No es un Id valido').isMongoId(),
		check('id').custom(existeUsuarioPorId),
		check('rol').custom(esRolValido),
		validarCampos,
	],
	usuariosPut
);

router.post(
	'/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'El password es obligatorio y mayor a 6 letras').isLength({ min: 6 }),
		check('correo', 'El correo no es valido').isEmail(),
		check('correo').custom(emailExiste),
		// check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		check('rol').custom(esRolValido),
		validarCampos,
	],
	usuariosPost
);

router.patch('/', usuariosPatch);

router.delete(
	'/:id',
	[
		validarJWT,
		// esAdminRole,
		tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
		(check('id', 'No es un Id valido').isMongoId(), check('id').custom(existeUsuarioPorId)),
		validarCampos,
	],
	usuariosDelete
);

module.exports = router;
