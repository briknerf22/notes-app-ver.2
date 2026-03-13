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


// POST - Přihlášení
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Najít uživatele v DB
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Chybné jméno nebo heslo.');
        }

        // Porovnat hashované heslo (Požadavek: heslo v hashované podobě [cite: 23])
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Chybné jméno nebo heslo.');
        }

        // Uložit ID uživatele do session
        req.session.userId = user._id;
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Chyba při přihlašování.');
    }
});
module.exports = router;