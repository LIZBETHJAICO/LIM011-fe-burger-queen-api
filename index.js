const express = require('express');
const cors = require('cors');
const path = require('path');
// const mongoClient = require('mongodb').MongoClient;
const connectionMongoDB = require('./conection/connection');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');

const { port, secret } = config;
const app = express();

const init = async () => {
  connectionMongoDB()
    .then(() => {
      app.set('config', config);
      app.set('pkg', pkg);
      app.use(cors());
      // parse application/x-www-form-urlencoded
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
      app.use("/", express.static(path.join(__dirname,'dist')));
      app.use(authMiddleware(secret));
      

      // Registrar rutas
      routes(app, (err) => {
        if (err) {
          throw err;
        }

        app.use(errorHandler);

        app.listen(port, () => {
          console.info(`App listening on port ${port}`);
        });
      });
    });
  console.log('Connected successfully to server');
};

init();
