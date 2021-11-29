// Import des packages :
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
// Import des logiques de route :
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
// Connexion à MongoDB Atlas :
mongoose
  .connect(
    'mongodb+srv://poomcha:48Xa8QKzvR99MC7@cluster-piiquante.anxes.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création de l'app :
const app = express();

// Configuration des Headers :
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
// Rend les données récupérées exploitables :
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Chemin du dossier vers les images :
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routage :
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
