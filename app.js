// vezano za web aplikaciju, postavke i dr.


const express = require("express"); // framework za izradu API-ja/server
const bodyParser = require("body-parser"); // za čitanje podataka iz requesta
const cors = require('cors'); // za pristup iz drugih domena
const passport = require('passport'); // za prijavu i registraciju
const favicon = require('express-favicon'); // za ikonu web stranice

const PORT = process.env.PORT || 3000; // postavljanje port-a na 3000, ukoliko nije na Heroku
const app = express();

// CORS middleware
app.use(cors());

// podešavanje middleware-a za bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// ruta za web aplikaciju
app.use(express.static('public'));

// favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// rute za korisnike
const users = require('./routes/users');
app.use('/api/users', users);

// rute za unose - počinju s '/api/entries'
const entries = require("./routes/entries"); // API rute za unose
app.use("/api/entries", entries);

// paljenje aplikacije
app.listen(PORT, () => {
    console.log("Server radi na portu " + PORT + "!");
});