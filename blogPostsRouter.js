const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');
const {blogPostModel} = require('./models');

BlogPosts.create('First Post', 'This is the content of my first Blog Post', 'Race', 'November 2nd, 2018');
BlogPosts.create('Second Post', 'Second Post, Woohoo!', 'Race', 'November 3rd, 2018');
BlogPosts.create('Third Post', 'Third Post, on a roll now!', 'Race', 'November 3rd, 2018');

router.get('/', (req, res) => {
	blogPostModel.find().limit(5)
		.then(response => {
			response.json();
		})
		.catch(err => {
			console.error(err);
			response.status(500).json({message: "Internal server error"});
		});
});

router.get('/:id', (req, res) => {
	blogPostModel.findById(req.params.id)
		.then(response => res.json())
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: "Internal serverr error"});
		});
});


router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate']
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i]
		if(!(field in req.body)){
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message)
		}
	}
	const newBlogPost = BlogPosts.createBlogPostsModel(req.body.title, req.body.content, req.body.author, req.body.publishDate)

	res.status(201).json(newBlogPost);
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate']
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i]
		if(!(field in req.body)){
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message)
		}
	}

	if(req.params.id !== req.body.id){
		const message = `Request path id ${req.params.id} and request body id ${req.body.id} do not match`
		console.error(message);
	}

	const toUpdate = {};
	const updateableFields = ["title", 'content', 'author', 'publishDate'];

	updateableFields.forEach(field => {
		if(field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	console.log(`Updating post at id ${req.params.id}...`)

	BlogPosts
		.findByIdAndUpdate( req.params.id, {$set: toUpdate})
		.then(response => res.status(204).end())
		.catch(err => res.status(500).json({message: "Internal server error"}));
});


router.delete('/:id', (req, res) => {
	BlogPosts.findByIdAndRemove(req.params.id);
	console.log(`Deleting blog post id ${req.params.id}`);
	res.status(204).end();
});

module.exports = router;