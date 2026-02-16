const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    apellido: {
        required: true,
        type: String
    },
    cedula: {
        required: true,
        type: Number
    },
    edad: {
        required: true,
        type: Number
    },
})

module.exports = mongoose.model('Profesor', profesorSchema)