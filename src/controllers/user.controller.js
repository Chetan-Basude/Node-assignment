const User = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userValid = require('../validation/userValidation');
const Upload = require('../models/upload.model');
require('dotenv').config();

const createUser = async (req, res) => {
  const { error } = await userValid.validateUser(req.body);
  if (error) {
    return res.status(400).send({
      message: error.details,
    });
  }
  let user = await User.findOne({ email: req.body.email });
  let userName = await User.findOne({ user_name: req.body.user_name });
  if (userName) {
    return res.status(400).send({
      message: 'User name already exists, please use another user name',
    });
  }
  if (user) {
    return res.status(400).send('User already exists!');
  } else {
    user = new User({
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 8),
      email: req.body.email.toLowerCase(),
      user_name: req.body.user_name,
      gender: req.body.gender,
      mobile: req.body.mobile,
    });

    user.save();
    res.status(200).send({
      Data: user,
      message: 'User registered successfully!',
    });
  }
};

const login = async (req, res) => {
  User.findOne({ email: req.body.email }).then(async (response) => {
    if (response) {
      try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
          return res.status(400).send('All input is required');
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = await jwt.sign(
            { _id: user._id },
            process.env.TOKEN_KEY
          );

          // save user token
          user.token = token;

          // user
          return res.status(200).send({
            user: user,
            message: 'Logged in successfully',
          });
        }
        return res.status(400).send('Invalid Credentials');
      } catch (err) {
        return res.send(err);
      }
    } else {
      return res.status(500).send({
        message: 'some error occurred',
      });
    }
  });
};

const followUsers = async (req, res) => {
  try {
    if (req.user.id === req.params.followId) {
      return res
        .status(400)
        .json({ alreadyfollow: 'You cannot follow yourself' });
    }

    await User.findById(req.params.followId).then(async (user) => {
      await user.followers.map((element) => {
        if (element.user.toString() === req.user._id.toString()) {
          return res
            .status(400)
            .json({ alreadyfollow: 'You already followed the user' });
        }
      });

      user.followers.unshift({ user: req.user._id });
      user.save();
      User.findOne({ email: req.user.email })
        .then(async (user) => {
          user.following.unshift({ user: req.params.followId });
          user.save().then((user) => res.json(user));
        })
        .catch((err) =>
          res
            .status(404)
            .json({ alradyfollow: 'you already followed the user' })
        );
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const unfollowUsers = async (req, res) => {
  try {
    if (req.user.id === req.params.unfollowId) {
      return res
        .status(400)
        .json({ alreadyfollow: 'You cannot unfollow yourself' });
    }

    await User.findById(req.params.unfollowId).then(async (user) => {
      await user.followers.map((element) => {
        if (element.user.toString() !== req.user._id.toString()) {
          return res
            .status(400)
            .json({ alreadyfollow: 'You do not follow this user' });
        }
      });

      user.followers.pop({ user: req.user._id });
      user.save();
      User.findOne({ email: req.user.email })
        .then(async (user) => {
          user.following.pop({ user: req.params.followId });
          user.save().then((user) => res.json(user));
        })
        .catch((err) =>
          res
            .status(404)
            .json({ alradyfollow: 'you already followed the user' })
        );
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createUser,
  login,
  followUsers,
  unfollowUsers,
};
