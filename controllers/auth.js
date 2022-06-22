const { response } = require('express'); // tipar la response
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const newUser = async (req, res = response) => {
  const {name, email, password} = req.body;
  // console.log(name, email, password);

  try {
    // Verificar email no repetido
    const user = await User.findOne({ email });

    if(user) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con ese email'
      })
    }

    // Crear usuario con el modelo
    const dbUser = new User(req.body);

    // Hashear la password
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    // Generar JWT
    const token = await generateJWT(dbUser.id, name, email);

    // Guardar en la DB
    await dbUser.save();

    // Generar resp exito
    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      email,
      token
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Error, algo salio mal',
    });
  }
}

const loginUser = async (req, res = response) => {
  const {email, password} = req.body;
  // console.log(email, password);

  try {
    const dbUser = await User.findOne({email});

    if(!dbUser) {
      return res.status(400).json({
        ok: 'true',
        msg: 'Credenciales no son validas'
      });
    }

    // Confirmar si el password es correcto
    const validPassword =  bcrypt.compareSync(password, dbUser.password);

    if(!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales no son validas'
      });
    }

    // Generar JWT
    const token = await generateJWT(dbUser.id, dbUser.name, dbUser.email);

    // Resp del serivicio
    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token
    });

  } catch (error) {
    return res.status(500).json({
      ok: true,
      msg: 'Hable con el administrador',
    });
  }
}

const renewToken = async (req, res = response) => {
  const { uid, name, email } = req;

  // Leer db para obtener los datos
  const dbUser = await User.findById(uid);
  // Se podria validar si existe aunque ya se valido con el jwt

  const newToken = await generateJWT(uid, dbUser.name);

  return res.json({
    ok: true,
    uid,
    name: dbUser.name,
    email: dbUser.email,
    newToken
  });
}

module.exports = {
  newUser,
  loginUser,
  renewToken
}