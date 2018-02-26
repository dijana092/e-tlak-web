// rute vezane za korisnike i baratanje njima


const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require('passport');
const jwt = require('jsonwebtoken');


// registracija
router.post('/register', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    // provjera postoji li već korisnik sa pojedinim korisničkim imenom u bazi podataka
    db.User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            // korisničko ime nije zauzeto, stvaranje novog računa
            let newUser = new db.User({
                username: username,
                password: password
            });

            // spremanje korisnika u bazu podataka
            db.User.addUser(newUser, (err, user) => {
                if(err){
                    res.json({success: false, msg:'Greška pri registraciji korisnika!'});
                } else {
                    res.json({success: true, msg:'Uspješna registracija!'});
                }
            });

        } else {
            // javljanje da je korisničko ime zauzeto
            res.json({success: false, msg:'Korisničko ime je zauzeto!'});
        }
    });
});


// prijava
router.post('/login', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    // provjera postoji li korisnik sa pojedinim korisničkim imenom u bazi podataka
    db.User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'Korisnik nije pronađen!'});
        }

        // uspoređivanje lozinki
        db.User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, "secret", {
                    expiresIn: 60*60*24*30 // 1 mjesec
                });

                res.json({
                    success: true,
                    token: "JWT " +token,
                    user: {
                        id: user._id,
                        username: user.username
                    }
                });

            } else {
                // javljanje da je lozinka kriva
                return res.json({success: false, msg: 'Pogrešna lozinka!'});
            }
        });
    });
});


// profil
router.get('/me', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;