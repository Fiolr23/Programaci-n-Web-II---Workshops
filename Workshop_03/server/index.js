const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Course = require('./models/course');
const Profesor = require('./models/profesor');

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});


const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: '*'
}));


//routes
// CRUD Cursos
//Crear
app.post('/course', async (req, res) => {
    // valida que el profesor existe por su id
    const profesor = await Profesor.findById(req.body.profesorId);
    if (!profesor) {
        return res.status(404).json({ message: "Profesor not found" });
    }
    const course = new Course({
        name: req.body.name,
        code: req.body.code,
        descripcion: req.body.descripcion,
        profesorId: req.body.profesorId
    })
    try {
        const courseCreated = await course.save();
        res.header('Location', `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

//Obtener
app.get('/course', async (req, res) => {
    try{
        //si se pasa id como parámetro de consulta, se devuelve un solo curso; 
        //de lo contrario, se devuelven todos los cursos
        if(!req.query.id){
            const data = await Course.find();
            return res.status(200).json(data)
        }
        const data = await Course.findById(req.query.id);
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

// UPDATE 
app.put('/course/:id', async (req, res) => {
    try {
        // valida que el profesor existe por el id
        const profesor = await Profesor.findById(req.body.profesorId);
        if (!profesor) {
            return res.status(404).json({ message: "Profesor not found" });
        }
        //busca el curso y lo actualiza
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
});

// DELETE 
app.delete('/course/:id', async (req, res) => {
    try {
        //busca el curso por el id y lo elimina
        const courseDeleted = await Course.findByIdAndDelete(req.params.id);
        if (!courseDeleted) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//CRUD profesores
app.post('/profesor', async (req, res) => {
    const profesor = new Profesor({
        name: req.body.name,
        apellido: req.body.apellido,
        cedula: req.body.cedula,
        edad: req.body.edad
    })
    try {
        const profesorCreated = await profesor.save();
        res.header('Location', `/profesor?id=${profesorCreated._id}`);
        res.status(201).json(profesorCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

app.get('/profesor', async (req, res) => {
    try{
        if(!req.query.id){
            const data = await Profesor.find();
            return res.status(200).json(data)
        }
        const data = await Profesor.findById(req.query.id);
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


app.put('/profesor/:id', async (req, res) => {
    try {
        //Busca el profesor y lo actualiza
        const profesorUpdated = await Profesor.findByIdAndUpdate(
            req.params.id, //id del profesor que viene de la URL
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
});

app.delete('/profesor/:id', async (req, res) => {
    try {
        const profesorDeleted = await Profesor.findByIdAndDelete(req.params.id);
        if (!profesorDeleted) {
            return res.status(404).json({ message: "Profesor not found" });
        }
        res.status(200).json({ message: "Profesor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//start the app
app.listen(3001, () => console.log(`UTN API service listening on port 3001!`))