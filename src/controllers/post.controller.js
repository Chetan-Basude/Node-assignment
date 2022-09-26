const Post = require('../models/upload.model');
require('dotenv').config();

const postUpload = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body || !req.files) {
      return res.status(400).send({ error: 'Please add all the details' });
    }
    req.user.password = undefined;
    const post = new Post({
      title,
      body,
      photo: req.files,
      postedBy: req.user,
    });
    await post.save().then((result) => {
      return res.status(200).send({ post: result });
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const findAll = async (req, res) => {
  try {
    Post.find({ deleted: false })
      .populate('postedBy', '_id name')
      .then((posts) => {
        return res.status(200).send(posts);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const myPost = async (req, res) => {
  try {
    Post.find({ postedBy: req.user._id }, { deleted: false })
      .populate('postedBy', '_id name')
      .then((myPost) => {
        return res.status(200).send(myPost);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const likePost = async (req, res) => {
  try {
    await Post.findOne({ _id: req.body.postId }).then((resp) => {
      const like = resp.likes;
      if (like.includes(req.user._id)) {
        return res.status(400).send('You already liked this post');
      }
      Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      ).exec((err, liked) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          res.status(200).send(liked);
        }
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const unlikePost = async (req, res) => {
  try {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).exec((err, unLike) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        res.status(200).send(unLike);
      }
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const commentPost = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate('comments.postedBy', '_id name')
      .populate('postedBy', '_id name')
      .exec((err, comment) => {
        if (err) {
          return res.status(400).send(err);
        } else {
          res.status(200).send(comment);
        }
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deletePost = async (req, res) => {
  Post.findByIdAndUpdate({ _id: req.params.postId }, { deleted: true })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).send(err);
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .save()
          .then(() => {
            return res
              .status(200)
              .send({ message: 'Post deleted successfully' });
          })
          .catch((err) => {
            return res.status(500).send(err);
          });
      } else {
        return res
          .status(400)
          .send({ message: 'You are not allowed to delete this post' });
      }
    });
};

module.exports = {
  postUpload,
  findAll,
  myPost,
  likePost,
  unlikePost,
  commentPost,
  //   deleteComment,
  deletePost,
};
