// Import des packages :
const mongoose = require('mongoose');
const express = require('express');
// Import des logiques de route :
const userRoutes = require('./routes/user');
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
  express.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routage :
app.use('/api/auth', userRoutes);

module.exports = app;
