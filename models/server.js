/**************************************************
 * Declarando nuestro servidor a traves de Clases
 ***********************************************/

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

const port = process.env.PORT;

class Server {
	constructor() {
		this.app = express();
		this.port = port;

		this.usuariosPath = '/api/usuarios';
		this.authPath = '/api/auth';

		//Conectar a Base de Datos
		this.conectarDB();

		// Middlewares
		this.middlewares();

		//Rutas de mi aplicacion
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS configuration
		this.app.use(cors());

		//Lectura y parseo del body
		this.app.use(express.json());

		//Directorio público (Recordar que es el primero que toma por defecto ya q tiene el index.html)
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.authPath, require('../routes/auth'));
		this.app.use(this.usuariosPath, require('../routes/user'));
	}

	listen() {
		this.app.listen(port, () => {
			console.log('Servidor corriendo en el puerto:', port);
		});
	}
}

module.exports = Server;
