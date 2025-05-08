const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CatwaysSchema = new Schema({
    catwayNumber: {
        type: Number,
        trim : true
    },
    type: {
        type: String,
        trim: true,
        enum: ['long', 'short']
    },
    catwayState: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

const Catways = mongoose.models.Catways || mongoose.model('Catways', CatwaysSchema);
module.exports = Catways;
