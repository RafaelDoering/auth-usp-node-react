const { Router } = require('express');

const AuthController = require('../controllers/authController');

const router = Router();

router.post(
  '/signup',
  AuthController.signup,
);

router.post(
  '/login',
  AuthController.login,
);

router.get('/success', AuthController.authenticationSuccess);

router.get('/failure', AuthController.authenticationFailure);

router.get('/logout', AuthController.logout);

module.exports = router;