const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const path = require('path');
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const dotenv = require('dotenv').config()


const app = express();

// ratelimite secure

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Trop de requêtes envoyer depuis cette IP"
});

app.use(limiter);

// LOG de notre DB depuis notre fichier .env grace au package "dotenv"
const DB_CONNECT = process.env.DATABASE


// Request pour se connecter et faire des request a notre db
mongoose.connect(DB_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// sécurisation des request avec cors. 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// package
app.use(helmet());
app.use(bodyParser.json());


// Main Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;

