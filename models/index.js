// postavke baze podataka


const mongoose = require("mongoose"); // shema za Mongo bazu podataka
mongoose.set("debug", true); // ispis Mongo naredbi u konzolu dok se izvršavaju

// korištenje promise-a (.then i sl.) umjesto funkcija povratnog poziva - modernije i 'čišće'
mongoose.Promise = global.Promise;

// spajanje na udaljenu mLab bazu podataka - korištenje useMongo jer se u suprotnom 'žali'
mongoose
	.connect(
		"mongodb://korisnik:korisnik@ds117178.mlab.com:17178/e-tlak",
		{
			useMongoClient: true
		}
	)
	.then(() => console.log("Mongo spojen!"))
	.catch(err => console.log(err));

// izvoz unosa i korisnika
module.exports.Entry = require("./entry");
module.exports.User = require("./user");