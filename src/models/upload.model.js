const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: [],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      text: String,
      postedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
  ],
  deleted: { type: Boolean, default: false },
});

const Upload = mongoose.model('post', postSchema);

module.exports = Upload;
