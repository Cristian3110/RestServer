/**
 *
 */

const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');

const esRolValido = async (rol = '') => {
	const existeRol = await Role.findOne({ rol });

	if (!existeRol) {
		throw Error(`El rol ${rol} no está registrado en la Base de Datos`);
	}
};

const emailExiste = async (correo = '') => {
	//verificando si el correo existe
	const existeEmail = await Usuario.findOne({ correo: correo });
	if (existeEmail) {
		throw Error(`El correo: ${correo}, ya está registrado`);
	}
};

const existeUsuarioPorId = async (id) => {
	const existeUsuario = await Usuario.findById(id);

	if (!existeUsuario) {
		throw new Error(`El id: ${id} no existe`);
	}
};

const existeCategoriaPorId = async (id) => {
	const existeCat = await Categoria.findById(id);

	if (!existeCat) {
		throw new Error(`El id: ${id} no existe en la BD`);
	}
};

const existeProductoPorId = async (id) => {
	const existeProd = await Producto.findById(id);

	if (!existeProd) {
		throw new Error(`El id: ${id} no existe en la BD`);
	}
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
	const incluida = colecciones.includes(coleccion);
	if (!incluida) {
		throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`);
	}
	return true;
};

module.exports = {
	esRolValido,
	emailExiste,
	existeUsuarioPorId,
	existeCategoriaPorId,
	existeProductoPorId,
	coleccionesPermitidas,
};
