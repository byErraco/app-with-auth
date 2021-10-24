
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const authCtrl = {};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'succes',
    token,
    data: {
      user,
    },
  });
};

authCtrl.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

authCtrl.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check email y password
  if (!email || !password) {
    return next(new AppError('Por favor, ingrese email y password', 400));
  }
  //check si existe y si es correcto
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email o contrasena incorrecta', 401));
  }
  //todo ok, enviar token
  createSendToken(user, 200, res);
});

authCtrl.protect = catchAsync(async (req, res, next) => {
  //obtener token y ver si existe
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'No tienes una sesion activa, por favor inicia sesion para acceder',
        401
      )
    );
  }
  //verificar token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //verificar si usuario aun existe
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('El usuario de este token ya no existe'));
  }
  //check si la contrasena cambio luego de que el token se revisara
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'El usuario ha cambiado recientemente su password, inicia sesion de nuevo!',
        401
      )
    );
  }
  //dar acceso
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

authCtrl.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //verificar si usuario aun existe
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }
      //check si la contrasena cambio luego de que el token se revisara
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //hay un usuario logeado
      res.locals.user = freshUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};

authCtrl.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

authCtrl.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'worker']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('No tienes permiso para realizar esta accion', 403)
      );
    }
    next();
  };
};



module.exports = authCtrl;
