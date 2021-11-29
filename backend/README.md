# Pour pouvoir installer les packages dirigez vous depuis le dossier /backend et executer :

npm install

# Ceci installera tous les packages utilisé pour le bon fonctionnement de notre server.


# Après cela modifier le nom du fichier .env_test par .env :

Dans celui-ci mettre vos variables sécurisées tel que vos ID de Base de donnée ou autre.
exemple: 
DB_CONNECT="MonSuperUrlMongoose";

# Packages utilisé

nodemon
express
mongoose
mongoose-unique-validator
bcrypt
jsonwebtoken
multer
dotenv
helmet
express-rate-limit

# Une fois les variables /.env/ configurées, executer cette commande depuis le dossier /backend pour lancer le serveur :

nodemon server.js

ou si problème avec nodemon

node server.js


