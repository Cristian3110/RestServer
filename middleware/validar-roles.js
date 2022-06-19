/**
 * Validando rol de accion de los usuarios
 */

const { response } = require('express');

// Configuración solo para usuarios Administradores

const esAdminRole = (req, res = response, next) => {
	if (!req.usuario) {
		return res.status(500).json({
			msg: 'Se quiere verificar el role sin validar el token primero',
		});
	}

	const { rol, nombre } = req.usuario;

	if (rol !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${nombre} no es administrador - No puede hacer esto`,
		});
	}

	next();
};

// configuración para roles específicos.(distintos)

const tieneRole = (...roles) => {
	return (req, res = response, next) => {
		// console.log(roles);

		if (!req.usuario) {
			return res.status(500).json({
				msg: 'Se quiere verificar el rol sin validar el token primmero',
			});
		}

		if (!roles.includes(req.usuario.rol)) {
			return res.status(401).json({
				msg: `El servicio requiere uno de estos roles ${roles}`,
			});
		}
		next();
	};
};

module.exports = { esAdminRole, tieneRole };
