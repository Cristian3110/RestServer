/*******************************
 * Metodo de Google
 * ****************************/

const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (idToken = '') => {
	const ticket = await client.verifyIdToken({
		idToken,
		audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});
	const payload = ticket.getPayload();
	const userid = payload['sub'];
	//? Desestructurando el payload, solo lo necesario para nuestro modelo de usuario
	//* Además hacemos el cambio de variables, ya que en nuestro models está de otro modo
	const { name: nombre, picture: img, email: correo } = ticket.getPayload();
	// If request specified a G Suite domain:
	// const domain = payload['hd'];
	// retornando la información recibida de google con el payload
	// return payload;
	// return { name, picture, email };
	return { nombre, img, correo };
	// Desestructurando la info del payload de google
};

module.exports = {
	googleVerify,
};
