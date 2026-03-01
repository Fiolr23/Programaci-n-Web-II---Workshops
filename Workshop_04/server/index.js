const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { authenticateToken, generateToken } = require('./controllers/auth');

const courseRoutes = require('./routes/courses');
const teacherRoutes = require('./routes/teachers');
const userRoutes = require('./routes/user'); 

const app = express();

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('connected', () => {
    console.log('Database Connected');
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client')));

//RUTAS PÚBLICAS (NO requieren token)

// Login
app.post('/auth/token', generateToken);

// Registro
app.use('/user', userRoutes);


//ACTIVAR PROTECCIÓN
app.use(authenticateToken);


//RUTAS PROTEGIDAS
app.use('/course', courseRoutes);
app.use('/profesor', teacherRoutes);


app.listen(3001, () =>
    console.log("UTN API service listening on port 3001!")
);