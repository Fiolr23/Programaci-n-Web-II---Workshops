const User = require('../models/user');
const bcrypt = require('bcrypt');

/**
 * Registra un nuevo usuario en el sistema.
 * @param {Request} req - Datos enviados desde el cliente
 * @param {Response} res - Respuesta que se envía al cliente
 */
const userPost = async (req, res) => {

  const { name, lastname, email, password } = req.body;
  // Validación de campos obligatorios
  if (!name || !lastname || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Verifica que el correo no esté registrado previamente
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }
    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      lastname,
      email,
      password: hashedPassword
    });

    await user.save();

    return res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

module.exports = { userPost };