//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Bookmark = require('../app/model/bookmark');
let User = require('../app/model/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

function base64(s) {
  return new Buffer(s).toString('base64');
}

function authorization(username, password) {
  return 'Basic ' + base64(username + ':' + password)
}

let adminUsername = 'admin'
let adminPass = 'admin123'
let testUsername = 'user123'
let testUsername2 = 'user1234'

//Our parent block
describe('Bookmarks', () => {
    beforeEach((done) => {
        Bookmark.remove({}, (err) => { 
          User.remove({ username: [testUsername, testUsername2] }, (err) => {
            done();
          });
        });
    });

  // Test the /GET route
  describe('/GET bookmark', () => {
      it('should GET empty bookmarks', (done) => {
        chai.request(server)
            .get('/api/bookmarks')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('Authorization', authorization(adminUsername, adminPass))
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  describe('/GET/:id bookmark', () => {
      it('should GET a bookmark by the given id', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        user.save((err, user) => {
          let bookmark = new Bookmark({ url: "http://url.com", owner: user._id });
          bookmark.save((err, bookmark) => {
              chai.request(server)
              .get('/api/bookmarks/' + bookmark._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
                done();
              });
          });
        });
      });
  });

  // Test the /POST route
  describe('/POST bookmark', () => {
      it('should POST a bookmark', (done) => {
        let bookmark = {
          'url': 'http://urltest1.com'
        };

        chai.request(server)
            .post('/api/bookmarks')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('Authorization', authorization(adminUsername, adminPass))
            .send(bookmark)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('owner');
                res.body.should.have.property('url').eql('http://urltest1.com');
              done();
            });
      });

      it('should not POST a bookmark without url', (done) => {
        let bookmark = {
        };

        chai.request(server)
            .post('/api/bookmarks')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('Authorization', authorization(adminUsername, adminPass))
            .send(bookmark)
            .end((err, res) => {
                res.should.have.status(500);
              done();
            });
      });

      it('should not POST a bookmark without owner', (done) => {
        let bookmark = {
          'url': 'http://urltest1.com'
        };

        chai.request(server)
            .post('/api/bookmarks')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(bookmark)
            .end((err, res) => {
                res.should.have.status(401);
              done();
            });
      });
  });

  // Test the /PUT route
  describe('/PUT/:id bookmark', () => {
      it('should PUT a bookmark', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {

          let bookmark = new Bookmark({ url: "http://oldurl.com", owner: user._id });

          bookmark.save((err, bookmark) => {
              let newBM = { url: "http://newurl.com" };
              chai.request(server)
              .put('/api/bookmarks/' + bookmark._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .send(newBM)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('url').eql('http://newurl.com');
                done();
              });
          });

        });
      });

      it('should not PUT a bookmark not owned (non admin user)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        let user2 = new User({ username: testUsername2, password: testUsername2 });

        user.save((err, user) => {
          user2.save((err, user2) => {
            let bookmark = new Bookmark({ url: "http://oldurl.com", owner: user._id });

            bookmark.save((err, bookmark) => {

                let newBM = { url: "http://newurl.com" };
                chai.request(server)
                .put('/api/bookmarks/' + bookmark._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', authorization(testUsername2, testUsername2))
                .send(newBM)
                .end((err, res) => {
                    res.should.have.status(500);
                  done();
                });
            });

          });

        });
      });

      it('should not PUT a bookmark without url', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {

          let bookmark = new Bookmark({ url: "http://oldurl.com", owner: user._id });

          bookmark.save((err, bookmark) => {
              let newBM = { };
              chai.request(server)
              .put('/api/bookmarks/' + bookmark._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .send(newBM)
              .end((err, res) => {
                  res.should.have.status(500);
                done();
              });
          });

        });
      });
  });

  // Test the /DELETE route
  describe('/DELETE/:id bookmark', () => {
      it('should delete a bookmark', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {

          let bookmark = new Bookmark({ url: "http://oldurl.com", owner: user._id });

          bookmark.save((err, bookmark) => {
              chai.request(server)
              .delete('/api/bookmarks/' + bookmark._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .end((err, res) => {
                  res.should.have.status(200);
                done();
              });
          });

        });
      });

      it('should not delete a bookmark not owned (non admin user)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        let user2 = new User({ username: testUsername2, password: testUsername2 });

        user.save((err, user) => {
          user2.save((err, user2) => {
            let bookmark = new Bookmark({ url: "http://oldurl.com", owner: user._id });

            bookmark.save((err, bookmark) => {
                chai.request(server)
                .delete('/api/bookmarks/' + bookmark._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', authorization(testUsername2, testUsername2))
                .end((err, res) => {
                    res.should.have.status(500);
                  done();
                });
            });

          });

        });
      });
  });

});