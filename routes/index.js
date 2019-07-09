const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db.find();
    if (posts.length) {
      return res.status(200).send(posts);
    }
    return res.status(200).send({
      data: 'No posts to display',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: 'The posts information could not be retrieved.',
    });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
    return res.status(400).send({
      message: 'The post ID provided is not valid',
    });
  }
  try {
    const post = await db.findById(id);
    if (post.length) {
      return res.status(200).send(post[0]);
    }
    return res.status(404).send({
      message: 'The post with the specified ID does not exist.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: 'The post information could not be retrieved.',
    });
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
    return res.status(400).send({
      message: 'The post ID provided is not valid',
    });
  }
  try {
    const deleteResponse = await db.remove(id);
    if (deleteResponse === 1) {
      return res.status(200).json({
        message: 'Post deleted successfully',
      });
    }
    return res.status(404).json({
      message: 'The post with the specified ID does not exist.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'The post could not be removed',
    });
  }
});

module.exports = router;
