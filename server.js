const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const blogPostsRouter = require('./blogPostsRouter');

const router = express.Router();
app.use(express.static('public'));

app.get('/', (req,res) => {
	res.sendFile(__dirname + 'index.html');
});

app.use('/blog-posts', blogPostsRouter);


app.listen(8080);