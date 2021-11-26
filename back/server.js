// Import des packages :
const http = require('http');
const dotenv = require('dotenv').config({ path: '../.env' }); // Chargement des données d'environnement.
const app = require('./app');

/**
 * Retourne un port valide.
 * @param { String | Integer } val
 * @returns { Integer }
 */
const normalizePort = (val) => {
  return val;
};

// Configuration du port :
const port = normalizePort(process.env.PORT);
app.set('port', port);

/**
 * Gère les erreurs de serveurs.
 * @param {*} error
 */
const errorHandler = (error) => {
  throw error;
};

//  Création du serveur :
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
