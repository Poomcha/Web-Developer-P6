// Import des packages :
const express = require('express');

const router = express.Router();

const sauceCtrl = require('../controlers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

// Création des routes :
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', sauceCtrl.getAllSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
