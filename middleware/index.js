//Optimizando las importanciones de los middleware

const validaCampos = require('../middleware/validar-campos');
const validaJWT = require('../middleware/validar-jwt');
const validaRoles = require('../middleware/validar-roles');

module.exports = {
	...validaCampos,
	...validaJWT,
	...validaRoles,
};
