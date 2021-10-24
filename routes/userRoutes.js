const express = require('express');

const router = express.Router();

//Controlador de servicios
const {
  signup,
  login,
  protect,
  restrictTo,
  logout,

} = require('../controllers/authController');


router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);


router.use(protect);

//Exportando modulo
module.exports = router;
