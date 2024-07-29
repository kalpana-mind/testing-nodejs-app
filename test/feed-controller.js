const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function () {
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
      })
      .catch((err) => {
        done(err);
      });
  });

  beforeEach(function () {});

  afterEach(function () {});

  it('should add a created post to the posts of the creator', function (done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post',
      },
      file: {
        path: 'abc',
      },
      userId: '66a1b4415c3b3235c3a9e6c7',
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
