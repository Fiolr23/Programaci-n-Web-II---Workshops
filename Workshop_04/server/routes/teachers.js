const express = require('express');
const router = express.Router();

const {teacherPost, teacherGet, teacherPut, teacherDelete} = require('../controllers/teacher');

router.post('/', teacherPost);
router.get('/', teacherGet);
router.put('/:id', teacherPut);
router.delete('/:id', teacherDelete);

module.exports = router;