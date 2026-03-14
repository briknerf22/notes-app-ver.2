const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Middleware pro kontrolu přihlášení
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).send('Pro tuto akci se musíte přihlásit.');
}

// POST - Vložení nové poznámky [cite: 25, 27]
router.post('/add-note', isAuthenticated, async (req, res) => {
    try {
        const { title, text } = req.body;
        const newNote = new Note({
            title,
            text,
            userId: req.session.userId // Přiřazení k přihlášenému uživateli
        });
        await newNote.save();
        res.redirect('/'); // Po uložení se vrátíme na hlavní stránku
    } catch (err) {
        res.status(500).send('Chyba při ukládání poznámky.');
    }
});

// GET - Výpis poznámek (seřazené od nejnovějších) [cite: 27, 28]
router.get('/my-notes', isAuthenticated, async (req, res) => {
    try {
        // Najdeme poznámky uživatele a seřadíme je sestupně podle data [cite: 27]
        const notes = await Note.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).send('Chyba při načítání poznámek.');
    }
});

// DELETE - Smazání poznámky
router.post('/delete-note/:id', isAuthenticated, async (req, res) => {
    try {
        // Smaže poznámku, ale jen pokud patří přihlášenému uživateli (bezpečnost!)
        await Note.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Chyba při mazání.');
    }
});

module.exports = router;