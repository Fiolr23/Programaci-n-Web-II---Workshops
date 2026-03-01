const User = require('../models/user');
const bcrypt = require('bcrypt');

/**
 * Autentica el token enviado en los headers
 * y permite continuar al siguiente middleware si es válido.
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 * @param {Function} next - Función para continuar al siguiente middleware
 */
const authenticateToken = async (req, res, next) => {

  // Obtiene el header Authorization (Bearer token)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, se bloquea el acceso
  if (!token) {
    return res.status(401).json({ message: 'Se requiere un token de autenticación' });
  }

  try {
    // Busca en la base de datos un usuario que tenga ese token
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Guarda el usuario autenticado en la request
    req.user = user;

    // Continúa con la siguiente función (ruta protegida)
    next();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al autenticar el token' });
  }
};


/**
 * Genera un token para el usuario cuando inicia sesión correctamente.
 * @param {Request} req - Objeto de solicitud
 * @param {Response} res - Objeto de respuesta
 */
const generateToken = async (req, res) => {

  const { email, password } = req.body;

  // Validación de campos obligatorios
  if (!email || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
  }

  try {
    // Busca el usuario por correo
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Compara la contraseña ingresada con la encriptada en la base de datos
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Genera un token utilizando un método seguro (hash con bcrypt)
    const token = await bcrypt.hash(email + password, 10);

    // Guarda el token en el usuario
    user.token = token;
    await user.save();

    return res.status(201).json({ token: user.token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al generar el token' });
  }
};

module.exports = {
  authenticateToken,
  generateToken,
};