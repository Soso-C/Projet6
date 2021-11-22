const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/User");

// Créer un user depuis notre schema User : on récupere le pwd de l'user qu'on salt et hash avec bcrypt on créé depuis le model et on met l'email et le new pwd hash et salt en tant que pwd pour la db
exports.signup = (req, res, next) => {
    // on récup la req de l'user, on salt et hash le password
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // créé un new user depuis le model users, on récup l'email et on met le new pwd salt et hash par bcrypt.
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // on save l'user dans la db
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  // On recupere le pwd et l'email user pour savoir si elle est dans db si oui alors on se connecte et on créé un token d'auth avec jwtoken
  exports.login = (req, res, next) => {
    // On récupere et cherche l'email de la request si elle est dans la db ou non
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }// on compare le pwd de la req si il est = au pwd dans la db.
        bcrypt.compare(req.body.password, user.password)
          .then(valid => { 
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ // Si pwd et email ok alors return une réponse 200 et on créé un token d'auth avec l'user id, la clé secrete et l'expiration dans 24h
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};