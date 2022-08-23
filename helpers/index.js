/**
 * Realizando el index de los helpers
 */

const dbValidators = require('./dbValidators');
const googleVerify = require('./google-verify');
const generateJWT = require('./generate-jwt');
const subirArchivo = require('./subir-archivo');

// exparciendo todo su contenido, teniendo todas las propiedades, sus funciones, constantes ect (...)
module.exports = {
	...dbValidators,
	...googleVerify,
	...generateJWT,
	...subirArchivo,
};
