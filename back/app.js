// Import des packages :
const mongoose = require('mongoose');
const express = require('express');
// Import des logiques de route :

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

//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routage :

module.exports = app;
