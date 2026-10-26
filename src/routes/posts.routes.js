const express = require('express');
const postsController = require('../controllers/posts.controllers');

const router = express.Router();

router.post('/', postsController.createPost);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.patch('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);

module.exports = router;
