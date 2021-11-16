const Sauce = require("../models/Sauces");
const fs = require("fs");


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};


exports.likeSauce = (req, res, next) => {
  const like = req.body.like
  const userId = req.body.userId
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => { // on créé un objet qui contient nos array (Usersliked et UsersDisliked) et les likes/dislikes de notre base de données.
      const likeOrDislike = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: sauce.likes,
        dislikes: sauce.dislikes,
      }
      if(like === 1){ // Si = 1 alors on push l'id dans l'array UserLiked
        likeOrDislike.usersLiked.push(userId);
        console.log("Like ajouté")
      }else if (like === -1) { // Si = -1 alors on push l'id dans l'array UserDisliked
        likeOrDislike.usersDisliked.push(userId);
        console.log("Dislike ajouté")
      }else if (like === 0) { // Si = 0 alors on delete l'userid dans l'array disliked ou liked
        // Si notre array UsersLiked contient notre userID alors on recupere son index et on le delete de l'array avec .splice
        if (likeOrDislike.usersLiked.includes(userId)){         
          const indexL = likeOrDislike.usersLiked.indexOf(userId);
          likeOrDislike.usersLiked.splice(indexL, 1);         
        }// Si notre array UsersDisliked contient notre userID alors on recupere son index et on le delete de l'array avec .splice
        else if (likeOrDislike.usersDisliked.includes(userId)){
          const indexD = likeOrDislike.usersDisliked.indexOf(userId);
          likeOrDislike.usersDisliked.splice(indexD, 1);
        }
      }
    // Affiche le nombre de like/dislike d'une sauce en fonction du nombre d'users dans les array usersliked ou usersdisliked
    likeOrDislike.likes = likeOrDislike.usersLiked.length
    likeOrDislike.dislikes = likeOrDislike.usersDisliked.length
    // Update notre like ou dislike 
    Sauce.updateOne({ _id: req.params.id }, likeOrDislike)
    .then(() => res.status(200).json({ message: 'Votre avis a été pris en compte !' }))
    .catch(error => res.status(400).json({ error }))
  })   
}

