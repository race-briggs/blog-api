const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const blogPostsRouter = require('./blogPostsRouter');
const {PORT, DATABASE_URL} = require('./config');


const router = express.Router();

app.use(express.static('public'));

app.use('/blog-posts', blogPostsRouter);

let server;

app.get('/', (req,res) => {
	res.sendFile(__dirname + 'index.html');
});

function runServer(databaseURL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseURL,
      err => {
        if(err){
          return reject(err);
        }
      server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        mongoose.disconnect();
        reject(err);
      });
      }
      )    
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });})
  
}

if(require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};