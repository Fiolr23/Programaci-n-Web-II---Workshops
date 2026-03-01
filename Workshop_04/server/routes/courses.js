const express = require('express');
const router = express.Router();

const {coursePost, courseGet, coursePut, courseDelete} = require('../controllers/course');

router.post('/', coursePost);
router.get('/', courseGet);
router.put('/:id', coursePut);
router.delete('/:id', courseDelete);

module.exports = router;