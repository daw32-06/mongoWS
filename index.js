var mongoose = require('mongoose');

// DBdepartamento es el nombre de la base de datos
mongoose.connect('mongodb://localhost/DBdepartamento');


var schema = new mongoose.Schema({
	codDepartamento: Number,
	descDepartamento: String
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
	console.log("Conectado...");

	// var nombre objeto = mongoose.model('COLECCION', schema) <-- La coleccion la pluraliza (le añade una s)
	var Departamento = mongoose.model('Departamento', schema);

	var dep = new Departamento({codDepartamento:'005', descDepartamento:'Becarios'});
	console.log(dep);

	dep.save(function (err) {
  	if (err) return handleError(err);
		  console.log("guardado");
		  console.log(err);
	});


	Departamento.find({}, function(err, departamentos){
		if (err) throw err;
		console.log("Hay "+departamentos.length+" departamentos");

		for(i=0;i<departamentos.length;i++)
		{
			console.log(departamentos[i]);
		}

	});


});
