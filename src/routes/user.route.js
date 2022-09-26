const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/createUsers', userController.createUser);
router.post('/login', userController.login);

router.put('/user/follow-user/:followId', auth, userController.followUsers);
router.put('/user/unfollow-user/:unfollowId', auth, userController.unfollowUsers);

module.exports = router;
