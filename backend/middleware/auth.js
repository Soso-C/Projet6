const jwt = require('jsonwebtoken');

// On vérifie si la personne a un token avec son userid valid pour pouvoir se connecter au site 
module.exports = (req, res, next) => {
  try { // on récupere le token, on decode la clé secrete du token si = a ("Random_token_secret") et on recupe l'user id du token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { // Si l'id de notre user et son token/key est != du uid et son token/key donnée lors du login alors connection impossible au site
      throw 'Invalid user ID';
    } else { // Si tout vas bien on passe l'auth et connection OK puis next.
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};