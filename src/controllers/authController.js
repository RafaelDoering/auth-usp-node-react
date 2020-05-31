const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongoose').Types.ObjectId;

const UserModel = require('../models/userModel');

module.exports.signup = async (req, res) => {
  try {
    const {
      email,
      name,
      password,
    } = req.body;

    const createdUser = new UserModel({
      _id: ObjectId(),
      email,
      name,
      password,
    });
    await createdUser.save();

    const token = jwt.sign({ data: { id: createdUser._id, isUsp: false } }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json({
      email: createdUser.email,
      name: createdUser.name,
      id: createdUser._id,
    });
  } catch (e) {
    return res.status(500).json(e);
  }
};

module.exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const foundUser = await UserModel.findOne({ email, isUsp: false });
    if (!foundUser || !foundUser.password || !bcrypt.compareSync(password, foundUser.password)) {
      throw { statusCode: 401 };
    }

    const token = jwt.sign({ data: { id: foundUser._id, isUsp: false } }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: '30d',
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.status(200).json({
      email: foundUser.email,
      name: foundUser.name,
      id: foundUser._id,
    });
  } catch (e) {
    if (e.statusCode) {
      return res.status(e.statusCode).json(e);
    }
    return res.status(500).json(e);
  }
};

module.exports.authenticateUsp = async (data, cb) => {
  const user = JSON.parse(data);
  console.log(user);
  const currentUser = await UserModel.findOne({
    email: user.emailUspUsuario,
    nusp: user.loginUsuario,
    isUsp: true
  });

  if (!currentUser) {
    const createdUser = new UserModel({
      _id: ObjectId(),
      nusp: user.loginUsuario,
      email: user.emailUspUsuario,
      isUsp: true,
      name: user.nomeUsuario,
      course: user.vinculo && user.vinculo[0] && user.vinculo[0].siglaUnidade,
    });
    await createdUser.save();

    if (createdUser) {
      cb(null, createdUser);
    }
  }

  cb(null, currentUser);
};

module.exports.authenticationSuccess = async (req, res) => {
  if (!req.cookies.session) {
    return res.status(403).json('Cookie não pode ser vazio.');
  }

  if (!req.user) {
    return res.status(403).json('Usuário não encontrado.');
  }

  const token = jwt.sign({ data: { id: req.user._id, isUsp: req.user.isUsp } }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: '30d',
  });

  res.setHeader('Authorization', `Bearer ${token}`);

  return res.status(200).json({
    success: true,
    email: req.user.email,
    name: req.user.name,
    id: req.user._id,
  });
};

module.exports.authenticationFailure = async (req, res) => res.status(403).json({
  success: false,
  message: 'Falha ao autenticar usuário.',
});

module.exports.logout = async (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
};