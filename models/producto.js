/**
 * Modelo de Productos
 */

const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
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
	precio: {
		type: Number,
		default: 0,
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: 'Categoria',
		required: [true, 'La categoria debe existir'],
	},
	descripcion: { type: String },
	disponible: { type: Boolean, default: true },
	img: { type: String },
});

ProductoSchema.methods.toJSON = function () {
	const { __v, estado, descripcion, disponible, ...data } = this.toObject();
	// Cambiando visualmente el _id de mongoose por el uid personalizado
	return data;
};

module.exports = model('Producto', ProductoSchema);
