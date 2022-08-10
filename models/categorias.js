/**
 * Modelo de categorias
 */

const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
		unique: true,
	},
	estado: {
		type: Boolean,
		default: true,
		required: true,
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
		required: [true, 'Debe existir una referecia a un usuario'],
	},
});

CategoriaSchema.methods.toJSON = function () {
	const { __v, estado, ...data } = this.toObject();
	// Cambiando visualmente el _id de mongoose por el uid personalizado
	return data;
};

module.exports = model('Categoria', CategoriaSchema);
