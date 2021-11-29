// Import packages :
const fs = require('fs');
// Import schéma :
const Sauce = require('../models/Sauce');

// Logique métier :
exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObj,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json(sauce))
    .catch((error) => ({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(200).json({ error }));
};
