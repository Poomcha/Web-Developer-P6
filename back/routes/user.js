// Import des packages :
const express = require('express');
const router = express.Router();
const userCtrl = require('../controlers/user');

// Création des routes :
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
