const express = require('express');
const { check } = require('express-validator');

const postsControllers = require('../controllers/posts-controllers');

const router = express.Router();

router.get('/:pid', postsControllers.getPostById);

router.get('/user/:uid', postsControllers.getPostsByUserId);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('content').isLength({ min: 5 }),
  ],
  postsControllers.createPost
);

router.post(
    //??
    '/', 
    [
      check('comment').isLength({ min: 5 }),
    ],
    postsControllers.createComment
  );

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('content').isLength({ min: 5 })
  ],
  postsControllers.updatePost
);

router.delete('/:pid', postsControllers.deletePost);

module.exports = router;