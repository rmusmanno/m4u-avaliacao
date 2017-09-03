//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
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
describe('Users', () => {
    beforeEach((done) => {
      User.remove({ username: [testUsername, testUsername2] }, (err) => {
        done();
      });
    });

  // Test the /GET route
  describe('/GET user', () => {
      it('should GET all users', (done) => {
        chai.request(server)
            .get('/api/users')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('Authorization', authorization(adminUsername, adminPass))
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
      });

      it('should GET only himself (non admin)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        user.save((err, user) => {
          chai.request(server)
              .get('/api/users')
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('username').eql(testUsername);
                done();
              });
        });
      });
  });

  describe('/GET/:id user', () => {
      it('should GET a user by the given id (non admin)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        user.save((err, user) => {
          chai.request(server)
              .get('/api/users/' + user._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('username').eql(testUsername);
                  res.body.should.have.property('_id').eql('' + user._id);
                done();
              });
        });
      });

      it('should GET a user by the given id', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        user.save((err, user) => {
          chai.request(server)
              .get('/api/users/' + user._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(adminUsername, adminPass))
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('username').eql(testUsername);
                  res.body.should.have.property('_id').eql('' + user._id);
                done();
              });
        });
      });

      it('should not GET another user by the given id (non admin)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        let user2 = new User({ username: testUsername2, password: testUsername2 });

        user.save((err, user) => {
          user2.save((err, user2) => {
            let newUser = { username: testUsername2 };
            chai.request(server)
                .get('/api/users/' + user2._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', authorization(testUsername, testUsername))
                .send(newUser)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
                });
          });
        });
      });
  });

  // Test the /POST route
  describe('/POST user', () => {
      it('should POST a user', (done) => {
        let user = {
          'username': testUsername,
          'password': testUsername
        };

        chai.request(server)
            .post('/api/users')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
              done();
            });
      });

      it('should not POST a user without credentials', (done) => {
        let user = {
        };

        chai.request(server)
            .post('/api/users')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
              done();
            });
      });

      it('should not POST a non-unique username', (done) => {
        let user = new User({
          'username': testUsername,
          'password': testUsername
        });

        user.save((err, user) => {
          chai.request(server)
              .post('/api/users')
              .set('content-type', 'application/x-www-form-urlencoded')
              .send(user)
              .end((err, res) => {
                res.should.have.status(500);
                done();
              });
        });
      });
  });

  // Test the /PUT route
  describe('/PUT/:id user', () => {
      it('should PUT himself (non admin)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {

          let newUser = { username: testUsername2 };
          chai.request(server)
              .put('/api/users/' + user._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .send(newUser)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('username').eql(testUsername2);
                done();
              });

        });
      });

      it('should PUT a user', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {

          let newUser = { username: testUsername2 };
          chai.request(server)
              .put('/api/users/' + user._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(adminUsername, adminPass))
              .send(newUser)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('username').eql(testUsername2);
                done();
              });

        });
      });

      it('should not PUT another user (non admin)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        let user2 = new User({ username: testUsername2, password: testUsername2 });

        user.save((err, user) => {
          user2.save((err, user2) => {
            let newUser = { username: testUsername2 };
            chai.request(server)
                .put('/api/users/' + user2._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', authorization(testUsername, testUsername))
                .send(newUser)
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
                });
          });
        });
      });
  });

  // Test the /DELETE route
  describe('/DELETE/:id user', () => {
      it('should DELETE himself', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {
          chai.request(server)
              .delete('/api/users/' + user._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .end((err, res) => {
                res.should.have.status(200);
                done();
              });
        });
      });

      it('should not DELETE another user (non admin)', (done) => {
        let user = new User({ username: testUsername, password: testUsername });
        let user2 = new User({ username: testUsername2, password: testUsername2 });

        user.save((err, user) => {
          user2.save((err, user2) => {

            chai.request(server)
                .delete('/api/users/' + user._id)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('Authorization', authorization(testUsername2, testUsername2))
                .end((err, res) => {
                  res.should.have.status(500);
                  done();
                });

          });

        });
      });

      it('should DELETE another user', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {
          chai.request(server)
              .delete('/api/users/' + user._id)
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(adminUsername, adminPass))
              .end((err, res) => {
                res.should.have.status(200);
                done();
              });
        });
      });
  });

  // Test the /ME route
  describe('/ME user', () => {
      it('should GET himself', (done) => {
        let user = new User({ username: testUsername, password: testUsername });

        user.save((err, user) => {
          chai.request(server)
              .get('/api/me')
              .set('content-type', 'application/x-www-form-urlencoded')
              .set('Authorization', authorization(testUsername, testUsername))
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql('' + user._id);
                res.body.should.have.property('username').eql(testUsername);
                done();
              });
        });
      });
  });

});