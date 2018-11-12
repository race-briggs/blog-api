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
				const expectedKeys = ['title', 'content', 'author', 'publishDate'];
				res.body.forEach(function(item){
					expect(item).to.be.a('object');
					expect(item).to.have.keys(expectedKeys);
				})
			})
	});





});