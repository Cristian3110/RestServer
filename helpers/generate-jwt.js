/***********************************
 * Función que genera nuestro JWT
 ********************************/

const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
	// Necesitamos convertirlo en una promesa porque el JWT trabaja con Callback
	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(
			payload,
			process.env.SECRETORPRIVATEKEY,
			{
				expiresIn: '4h',
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject('No se pudo generar el token');
				} else {
					resolve(token);
				}
			}
		);
	});
};

module.exports = {
	generarJWT,
};
