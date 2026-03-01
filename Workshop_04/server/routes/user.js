const express = require('express');
const router = express.Router();
const { userPost } = require('../controllers/user');

router.post('/', userPost);

module.exports = router;