const { Router } =  require('express');
const { check } = require('express-validator');
const { newUser, loginUser, renewToken } = require('../controllers/auth');
const { validFields } = require('../middlewares/validFields');
const { validJWT } = require('../middlewares/validJWT');

// 1. Se inicia el router
const router = Router();

// Crear nuevo usuario
router.post('/new', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').isLength({min: 6}),
  validFields // middleware de validar campo propia
], newUser);

// Login de usuario
router.post('/', [
  check('email', 'El email es obligaotrio').isEmail(),
  check('password', 'La contraseña es obligatoria').isLength({min: 6}),
  validFields
], loginUser);

// Renovar token
router.get('/renew', validJWT, renewToken);

// Exportación por defecto
module.exports = router;