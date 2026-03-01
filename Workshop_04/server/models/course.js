const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    code: {
        required: true,
        type: String
    },
    descripcion: {
        required: true,
        type: String
    },
    profesorId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor'
    },
})

module.exports = mongoose.model('Course', courseSchema)