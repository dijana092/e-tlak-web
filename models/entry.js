// model vezan za unose, nazivi podataka, tipovi podataka i dr.


const mongoose = require("mongoose");

// postavljanje sheme podataka unosa
const entrySchema = new mongoose.Schema({
    sys: {
        type: Number,
        required: true
    },
    dia: {
        type: Number,
        required: true
    },
    pulse: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

// stvaranje modela
const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;