const Course = require('../models/course');
const Profesor = require('../models/profesor');

// POST
const coursePost = async (req, res) => {

    const profesor = await Profesor.findById(req.body.profesorId);
    if (!profesor) {
        return res.status(404).json({ message: "Profesor not found" });
    }

    const course = new Course({
        name: req.body.name,
        code: req.body.code,
        descripcion: req.body.descripcion,
        profesorId: req.body.profesorId
    });

    try {
        const courseCreated = await course.save();
        res.header('Location', `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// GET
const courseGet = async (req, res) => {
    try {
        if (!req.query.id) {
            const data = await Course.find();
            return res.status(200).json(data);
        }

        const data = await Course.findById(req.query.id);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// PUT
const coursePut = async (req, res) => {
    try {

        const profesor = await Profesor.findById(req.body.profesorId);
        if (!profesor) {
            return res.status(404).json({ message: "Profesor not found" });
        }

        const courseUpdated = await Course.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                code: req.body.code,
                descripcion: req.body.descripcion,
                profesorId: req.body.profesorId
            },
            { new: true }
        );

        if (!courseUpdated) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(courseUpdated);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// DELETE
const courseDelete = async (req, res) => {
    try {

        const courseDeleted = await Course.findByIdAndDelete(req.params.id);

        if (!courseDeleted) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {coursePost, courseGet, coursePut, courseDelete};