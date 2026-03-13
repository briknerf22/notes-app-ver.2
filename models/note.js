const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // Automatické datum a čas 
    isImportant: { type: Boolean, default: false }, // Příznak důležitosti 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Propojení s uživatelem [cite: 31]
});

module.exports = mongoose.model('Note', noteSchema);