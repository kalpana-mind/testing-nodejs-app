const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function () {
  before(function (done) {
    mongoose
      .connect(
        'mongodb+srv://kalpanareadwrite:Sd5z6gsdbzGs8rSF@cluster0.zxyvbda.mongodb.net/test-messages?retrywrites=true'
      )
      .then((result) => {
        const user = new User({
          email: 'test2@test.com',
          password: 'testing',
          name: 'Test',
          posts: [],
          _id: '66a1b4415c3b3235c3a9e6c7',
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  it('should throw an error with code 500 if accessing the database fails', function (done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test2@test.com',
        password: 'testing',
      },
    };
    AuthController.login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done();
      })
      .catch((err) => {
        done(err);
      });

    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', function (done) {
    const req = { userId: '66a1b4415c3b3235c3a9e6c7' };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal('I am new!');
      done();
    });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
