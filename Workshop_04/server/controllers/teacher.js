const Profesor = require('../models/profesor');

// POST
const teacherPost = async (req, res) => {

    const profesor = new Profesor({
        name: req.body.name,
        apellido: req.body.apellido,
        cedula: req.body.cedula,
        edad: req.body.edad
    });

    try {
        const profesorCreated = await profesor.save();
        res.header('Location', `/profesor?id=${profesorCreated._id}`);
        res.status(201).json(profesorCreated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// GET
const teacherGet = async (req, res) => {
    try {

        if (!req.query.id) {
            const data = await Profesor.find();
            return res.status(200).json(data);
        }

        const data = await Profesor.findById(req.query.id);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// PUT
const teacherPut = async (req, res) => {
    try {

        const profesorUpdated = await Profesor.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                apellido: req.body.apellido,
                cedula: req.body.cedula,
                edad: req.body.edad
            },
            { new: true }
        );

        if (!profesorUpdated) {
            return res.status(404).json({ message: "Profesor not found" });
        }

        res.status(200).json(profesorUpdated);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// DELETE
const teacherDelete = async (req, res) => {
    try {

        const profesorDeleted = await Profesor.findByIdAndDelete(req.params.id);

        if (!profesorDeleted) {
            return res.status(404).json({ message: "Profesor not found" });
        }

        res.status(200).json({ message: "Profesor deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {teacherPost, teacherGet, teacherPut, teacherDelete};