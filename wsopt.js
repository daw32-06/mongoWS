// Incluimos las librerias
var express = require('express');
var server = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // Esta libreria es para el POST, PUT...

// BodyParser?
server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Creamos el esquema que vamos a usar de departamentos
var schema = new mongoose.Schema({
	codDepartamento: Number,
	descDepartamento: String
});
// var nombre objeto = mongoose.model('COLECCION', schema) <-- La coleccion la pluraliza (le añade una s)
var Departamento = mongoose.model('Departamento', schema);

// Peticion GET a la raiz
server.get('/', function(req, res){
	console.log("GET /");
	// DBdepartamento es el nombre de la base de datos
	mongoose.connect('mongodb://localhost/DBdepartamento');
	var db = mongoose.connection;

	// Iniciamos la conexion
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function(){

		// Creamos el array de departamentos al que iremos añadiendo cada departamento segun los vamos obteniendo de la base de datos
		var arrayDepartamentos = [];

		// Obtenemos todos los departamentos de la base de datos (coleccion departamentos)
		Departamento.find({}, function(err, departamentos){
			if (err) throw err;
			console.log("Mostrando "+departamentos.length+" departamentos");

			// Recorremos todos los departamentos y los vamos añadiendo al array
			for(i=0;i<departamentos.length;i++)
			{
				arrayDepartamentos.push(departamentos[i]);
			}

			// Enviamos al cliente un json del array de todos los departamentos
			res.json(arrayDepartamentos);

			// Cerramos la conexion del cliente
			res.end();

			// Limpiamos el arrayDepartamentos
			arrayDepartamentos=[];

			// Cerramos la conexion con la base de datos (!Importante)
			mongoose.disconnect();
			console.log('Fin de la peticion');
		});
	});
});

// Peticion post
server.post('/nuevo', function(req, res){

	//console.log(req.body.codDepartamento);
	//Codigos:
	// 201 Created, 400 Bad Request, 304 not modified

	console.log("POST /nuevo");
	// DBdepartamento es el nombre de la base de datos
	mongoose.connect('mongodb://localhost/DBdepartamento');
	var db = mongoose.connection;

	// Iniciamos la conexion
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function(){

		// Creamos un objeto departamento basado en el schema
		var dep = new Departamento({
			codDepartamento: req.body.codDepartamento,
			descDepartamento: req.body.descDepartamento
		});
		dep.save(function(err,data){
			if (err)
			{
				//res.status(409).send();
				switch(err.code){
					case 11000:
						console.log('clave duplicada');
					//	res.send("Error");
						res.sendStatus(409);

						break;
					default:

						console.log(err);
				}

			} /*else{
				//console.log('Saved : ', data );
				res.status(201).send();
				res.end();
			}*/


		});
		//res.end();
	});


	mongoose.disconnect();

});
// Arrancamos el servidor
server.listen(3000, function(){
	console.log('Servidor corriendo en el puerto 3000');
});
