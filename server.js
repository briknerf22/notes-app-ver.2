const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // Pro zpracování formulářů
app.use(express.json()); // Pro zpracování JSON dat
app.use(express.static(path.join(__dirname, 'public'))); // Složka pro HTML, CSS, JS

// Nastavení session (pro přihlášení uživatele)
app.use(session({
    secret: 'tajne-heslo-pro-zkousku',
    resave: false,
    saveUninitialized: false
}));

const authRoutes = require('./routes/auth.js');
app.use('/', authRoutes);

// Připojení k DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB připojeno'))
    .catch(err => console.error('Chyba připojení k DB:', err));

const noteRoutes = require('./routes/notes.js');
app.use('/', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});