const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db.find();
    if (posts.length) {
      return res.status(200).send({
        data: posts,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: 'The posts information could not be retrieved.',
    });
  }
});

module.exports = router;
