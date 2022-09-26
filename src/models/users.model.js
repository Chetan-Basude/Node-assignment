const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (
        !value.match(/\d/g) ||
        !value.match(/[a-z]/g) ||
        !value.match(/[A-Z]/g) ||
        !value.match(/[!"#$%&'()*+.:;<=>?@^_`{|}~-]/g)
      ) {
        throw new Error(
          'Password must contain one upper and lower letter, one number and one special character'
        );
      }
    },
    private: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
  },
  following: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
