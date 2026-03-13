const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// POST - Registrace
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kontrola, zda uživatel již existuje (Požadavek: unikátní jméno)
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Uživatelské jméno je již obsazeno.');
        }

        // Hashování hesla (Požadavek: hashovaná podoba)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Uložení uživatele
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        res.send('Registrace úspěšná! Nyní se můžete přihlásit.');
    } catch (err) {
        res.status(500).send('Chyba při registraci.');
    }
});

module.exports = router;