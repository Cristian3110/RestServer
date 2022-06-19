/**
 * Modelo de usuario
 */

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	correo: {
		type: String,
		required: [true, 'El correo es obligatorio'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'la contraseña es obligatoria'],
	},
	img: {
		type: String,
	},
	rol: {
		type: String,
		required: true,
		enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
	},
	estado: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
});

// Método para sobreescribir mongoose
UsuarioSchema.methods.toJSON = function () {
	const { __v, password, _id, ...usuario } = this.toObject();
	// Cambiando visualmente el _id de mongoose por el uid personalizado
	usuario.uid = _id;
	return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
