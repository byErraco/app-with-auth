
const catchAsync = require('../utils/catchAsync');
const viewCtrl = {};


viewCtrl.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

viewCtrl.getRegisterForm = (req, res) => {
  res.status(200).render('register', {
    title: 'Register',
  });
};


module.exports = viewCtrl;
