const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../http-error');


let DUMMY_POSTS = [
    {
      pid: 'p1',
      uid: 'u1',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
      creatorName: 'user1',
      title: 'This skirt is so BEAUTIFUL!',
      content: 'Guys! You should try this! It can make your legs look long.',
      likes: 2,
      likedByUser: false,
      comments: [
        { cid: 'c1', text: 'Nice post!', userId: 'user2', likes: 1, CommentslikedByUser: false},
        { cid: 'c2', text: 'Hope you like!', userId: 'user1', likes: 2, CommentslikedByUser: false }
      ]
    }
]

const getPostById = (req, res, next) => {
  const postId = req.params.pid; // { pid: 'p1' }

  const post = DUMMY_POSTS.find(p => {
    return p.pid === postId;
  });

  if (!post) {
    throw new HttpError('Could not find a post for the provided id.', 404);
  }

  res.json({ post }); // => { post } => { post: post }
};



const getPostsByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const posts = DUMMY_POSTS.filter(p => {
    return p.uid === userId;
  });

  if (!posts || posts.length === 0) {
    return next(
      new HttpError('Could not find posts for the provided user id.', 404)
    );
  }

  res.json({ posts });
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, content, imageUrl, creatorName } = req.body;



  // const title = req.body.title;
  const createdPost = {
    pid: uuid(),
    title,
    content,
    imageUrl,
    creatorName
  };

  DUMMY_POSTS.push(createdPost); //unshift(createdPost)

  res.status(201).json({ post: createdPost });
};

const updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, content } = req.body;
  const postId = req.params.pid;

  const updatedPost = { ...DUMMY_POSTS.find(p => p.id === postId) };
  const postIndex = DUMMY_POSTS.findIndex(p => p.id === postId);
  updatedPost.title = title;
  updatedPost.content = content;

  DUMMY_POSTS[postIndex] = updatedPost;

  res.status(200).json({ place: updatedPost });
};

const deletePost = (req, res, next) => {
  const postId = req.params.pid;
  if (!DUMMY_POSTS.find(p => p.id === postId)) {
    throw new HttpError('Could not find a place for that id.', 404);
  }
  DUMMY_POSTS = DUMMY_POSTS.filter(p => p.id !== postId);
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;