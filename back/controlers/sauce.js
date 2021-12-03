// Import packages :
const { json } = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
// Import schéma :
const Sauce = require('../models/Sauce');

// Logique métier :
exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObj,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Post réussi.' }))
    .catch((error) => res.status(404).res.json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  // Vérification de l'utilisateur.
  // On récupère l'userId dans la requête :
  const userId = jwt.verify(
    req.headers.authorization.split(' ')[1],
    'TOKEN_SECRET_PHRASE'
  ).userId;
  // On cherche la sauce à modifier :
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si les ID créateur et modificateur correspondent :
      if (userId === sauce.userId) {
        // Création de l'objet modifié :
        const sauceObj = req.file
          ? {
              // La requête contient une image :
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
              }`,
            }
          : // La requête ne contient pas d'image :
            req.body;
        // Modification :
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObj, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Objet modifié !' }))
          .catch((error) => res.status(400).json({ error }));
      }
      // Les ID ne correspondent pas :
      else {
        res.status(401).json({ message: 'Accès non authorisé.' });
      }
    })
    .catch((error) => ({ error }));
};

exports.deleteSauce = (req, res, next) => {
  const userId = jwt.verify(
    req.headers.authorization.split(' ')[1],
    'TOKEN_SECRET_PHRASE'
  ).userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (userId === sauce.userId) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`./images/${filename}`, (error) => {
          if (error) {
            throw error;
          }
          Sauce.deleteOne({ _id: req.params.id })
            .then(() =>
              res
                .status(200)
                .json({ message: 'Sauce ' + sauce._id + ' supprimée.' })
            )
            .catch((error) => res.status(404).json({ error }));
        });
      } else {
        res.status(401).json({ message: 'Accès non authorisé.' });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        case 1:
          // On vérifie si l'utilisateur a déjà voté :
          if (
            sauce.usersLiked.find((user) => user === req.body.userId) ||
            sauce.usersDisliked.find((user) => user === req.body.userId)
          ) {
            // Si oui :
            res.status(200).json({ message: "L'utilisateur a déjà voté" });
          } // Sinon :
          else {
            sauce.likes += 1;
            sauce.usersLiked.push(req.body.userId);
            sauce
              .save()
              .then(() => res.status(200).json({ message: 'Like enregistré.' }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        case -1:
          if (
            sauce.usersLiked.find((user) => user === req.body.userId) ||
            sauce.usersDisliked.find((user) => user === req.body.userId)
          ) {
            res.status(200).json({ message: "L'utilisateur a déjà voté" });
          } else {
            sauce.dislikes += 1;
            sauce.usersDisliked.push(req.body.userId);
            sauce
              .save()
              .then(() =>
                res.status(200).json({ message: 'Dislike enregistré.' })
              )
              .catch((error) => res.status(400).json({ error }));
          }
          break;
        case 0:
          // L'utilisateur enlève son like :
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            sauce.likes -= 1;
            sauce.usersLiked = sauce.usersLiked.filter(
              (user) => user !== req.body.userId
            );
            sauce
              .save()
              .then(() => res.status(200).json({ message: 'Like annulé.' }))
              .catch((error) => res.status(400).json({ error }));
          } // L'utilisateur enlève son dislike :
          else if (
            sauce.usersDisliked.find((user) => user === req.body.userId)
          ) {
            sauce.dislikes -= 1;
            sauce.usersDisliked = sauce.usersDisliked.filter(
              (user) => user !== req.body.userId
            );
            sauce
              .save()
              .then(() => res.status(200).json({ message: 'Dislike annulé.' }))
              .catch((error) =>
                res.status(400).json({ error: 'Something went wrong' })
              );
          } else {
            res.status(200).json({ message: 'Utilisateur non trouvé.' });
          }
          break;
        default:
          res.status(400).json({ message: 'Action non reconnue.' });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
