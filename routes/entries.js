// rute vezane za unose i baratanje njima, čitanje, dodavanje, brisanje, izmjena i dr.


const express = require("express");
const router = express.Router();
const db = require("../models");
const passport = require('passport');


// čitanje svih unosa
router.get("/", passport.authenticate('jwt', {session:false}), (req, res) => {
    db.Entry
        .find({userId: req.user._id})
        .sort( { date: 1 })
        .then(entries => {
            // prikaz rezultata samo ukoliko ima unosa
            if(entries.length) res.json(entries);
            else res.status(404).send("Nema unosa!");
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// čitanje svih unosa
router.get("/reverse", passport.authenticate('jwt', {session:false}), (req, res) => {
    db.Entry
        .find({userId: req.user._id})
        .sort( { date: -1 })
        .then(entries => {
            // prikaz rezultata samo ukoliko ima unosa
            if(entries.length) res.json(entries);
            else res.status(404).send("Nema unosa!");
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// čitanje zadnjih ':num' unosa, posljednji unos u slučaju kada je 'num=1'
router.get("/limit/:num", passport.authenticate('jwt', {session:false}), (req, res) => {
    let limit = parseInt(req.params.num);
    db.Entry
        .find({userId: req.user._id})
        .sort( { date: -1 })
        .limit(limit)
        .then(entries => {
            // prikaz rezultata samo ukoliko ima unosa
            if(entries.length) res.json(entries);
            else res.status(404).send("Nema unosa!");
        })
        .catch(err => {
            res.status(404).send(err);
        });
});


// dodavanje unosa
router.post("/", passport.authenticate('jwt', {session:false}), (req, res) => {
    let pendingEntry = req.body;
    pendingEntry.userId = req.user._id;
    db.Entry
        .create(pendingEntry)
        .then(newEntry => {
            res.status(201).json(newEntry);
        })
        .catch(err => {
            res.status(404).send(err);
        });
});


// čitanje određenog unosa
router.get("/:id", passport.authenticate('jwt', {session:false}), (req, res) => {
    let userId = req.user._id;
    db.Entry
        .findById(req.params.id)
        .then(entry => {
            if(userId.toString() === entry.userId.toString()) res.json(entry);
            else res.sendStatus(403)
        })
        .catch(err => {
            res.status(404).send(err);
        });
});


// izmjena jednog unosa
router.put("/:id", passport.authenticate('jwt', {session:false}), (req, res) => {
    let userId = req.user._id;
    // prvo pronalaženje unosa, zatim provjera odgovara li ID korisnika
    db.Entry
        .findById(req.params.id)
        .then(entry => {
            if(userId.toString() !== entry.userId.toString()) res.sendStatus(403);
        })
        .catch(err => {
            res.status(404).send(err);
        });
    // ukoliko je uspješno, izvršavanje izmjena
    db.Entry
        .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(entry => {
            res.json(entry);
        })
        .catch(err => {
            res.sendStatus(404);
        });
});


// brisanje jednog unosa
router.delete("/:id", passport.authenticate('jwt', {session:false}), (req, res) => {
    let userId = req.user._id;
    // prvo pronalaženje unosa, zatim provjera odgovara li ID korisnika
    db.Entry
        .findById(req.params.id)
        .then(entry => {
            if(userId.toString() !== entry.userId.toString()) {
                res.sendStatus(403);
            }
        })
        .catch(err => {
            res.sendStatus(404);
        });
    // ukoliko je uspješno, brisanje
    db.Entry
        .remove({ _id: req.params.id })
        .then(() => {
            res.json({ message: "Obrisano!" });
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

module.exports = router;