const express = require('express');
const postController = require('../controllers/post.controller');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create posts
router.post(
  '/createPost',
  auth,
  upload.array('files'),
  postController.postUpload
);

//Find all post
router.get('/findPosts', auth, postController.findAll);

//Find post by userId
router.get('/myPost', auth, postController.myPost);

// Like post
router.put('/like', auth, postController.likePost);

// unLike post
router.put('/unlike', auth, postController.unlikePost);

// comment post
router.put('/comment', auth, postController.commentPost);

// delete post
router.delete('/deletePost/:postId', auth, postController.deletePost);

module.exports = router;
