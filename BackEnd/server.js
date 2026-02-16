// import du package dotenv
// les variables de .env deviennent accessibles grace à .config()
require('dotenv').config();

// import de l'application Express configurée dans app.js
const app = require('./app');

// definit le port d'écoute du serveur
const PORT = process.env.PORT || 3000;


// demarre le serveur
// affiche "Serveur lancé sur le port ....",
// affiche un lien cliquable vers l'api du localhost,
// une fois le serveur prêt
app.listen(PORT, () =>{
    console.log(`Serveur lancé sur le port ${PORT}`);
    console.log(`http://localhost:${PORT}/api`);
});