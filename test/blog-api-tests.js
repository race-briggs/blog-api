const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);

describe("BlogPosts", function(){
	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	//testing GET functionality
	it('should return a list of blog posts', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.be.at.least(1);
				const expectedKeys = ['title', 'content', 'id', 'author', 'publishDate'];
				res.body.forEach(function(item){
					expect(item).to.be.a('object');
					expect(item).to.have.keys(expectedKeys);
				})
			})
	});

	//testing POST functionality
	it('should append a new blog post into the collection of posts', function() {
		const newPost = {title: 'test post', content: 'test content', author: 'author', publishDate: '11-12-2018'};

		return (
			chai.request(app)
			.post('/blog-posts')
			//.set('Accept', 'application/json')
			.send(newPost)
			.then(function(res) {
					expect(res).to.have.status(201);
					expect(res).to.be.a('object');
					expect(res.body).to.include.keys("id", "content", "title", "author", "publishDate");
					expect(res.body.id).to.not.equal(null);
					expect(res.body).to.deep.equal(
						Object.assign(newPost, {id: res.body.id})
					);
			})
			);
	});

	//testing PUT functionality
	it('should retrieve a GET request, then update a post with a matching id', function(){
		const updatedPost = {title: 'new title', content: 'new content', author: 'new author', publishDate: '11-13-18'};

		return (chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				updatedPost.id = res.body[0].id;
				return chai.request(app)
					.put(`/blog-posts/${updatedPost.id}`)
					.send(updatedPost)
			})
			.then(function(res){
				expect(res).to.have.status(204);
				expect(res.body).to.deep.equal({});
			})
			);
	});


	//testing DELETE functionality
	it('should remove a blog post by a matching id', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				return chai.request(app).delete(`/blog-posts/${res.body[0].id}`)
			})
			.then(function(res){
				expect(res).to.have.status(204);
			})
	})




});