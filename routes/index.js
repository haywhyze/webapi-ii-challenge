const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).send({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  const newPost = {
    title,
    contents,
  };

  try {
    const newPostId = await db.insert(newPost);
    const newPostData = await db.findById(newPostId.id);
    return res.status(201).json(newPostData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'There was an error while saving the post to the database',
    });
  }
});

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

router.put('/:id', async (req, res) => {
  const { title, contents } = req.body;
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
    return res.status(400).send({
      message: 'The user ID provided is not valid',
    });
  }
  try {
    const post = await db.findById(id);
    if (post.length) {
      if (!title || !contents) {
        return res.status(400).send({
          errorMessage: 'Please provide title and contents for the post.',
        });
      }
      const newPost = {
        title,
        contents,
      };
      let updatedPost;
      const updateResponse = await db.update(id, newPost);
      if (updateResponse === 1) {
        updatedPost = await db.findById(id);
        return res.status(200).json(updatedPost);
      }
      return res.status(500).json({
        error: 'The post information could not be modified.',
      });
    }
    return res.status(404).json({
      message: 'The post with the specified ID does not exist.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'The post information could not be modified.',
    });
  }
});

router.get('/:id/comments', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
    return res.status(400).send({
      message: 'The post ID provided is not valid',
    });
  }
  try {
    const post = await db.findById(id);
    if (post.length) {
      try {
        const comments = await db.findPostComments(id);
        if (comments.length) {
          return res.status(200).send(comments);
        }
        return res.status(200).send({
          data: 'No comments to display',
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          error: 'The comments information could not be retrieved.',
        });
      }
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

router.post('/:id/comments', async (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
    return res.status(400).send({
      message: 'The post ID provided is not valid',
    });
  }
  try {
    const post = await db.findById(id);
    if (post.length) {
      if (!text) {
        return res.status(400).send({
          errorMessage: 'Please provide text for the post.',
        });
      }

      const newComment = {
        text,
        post_id: id,
      };

      try {
        const newCommentId = await db.insertComment(newComment);
        const newCommentData = await db.findCommentById(newCommentId.id);
        return res.status(201).json(newCommentData);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: 'There was an error while saving the comment to the database',
        });
      }
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

module.exports = router;
