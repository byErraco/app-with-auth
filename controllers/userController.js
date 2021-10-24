const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/assets/images/users');
//   },
//   filename: (req, file, cb) => {
//     //user-id-timestamp.extension
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('No es una imagen! Por favor solo suba imagenes', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const userCtrl = {};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

userCtrl.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

userCtrl.resizeUserPhoto = catchAsync(async (req, res, next) => {
  console.log(req.file);
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/assets/images/users/${req.file.filename}`);

  next();
});

userCtrl.uploadUserPhoto = upload.single('photo');

userCtrl.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  console.log(req.body);
  //error por si POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Esta ruta no es para actualizar password. Por favor use updateMyPassword',
        400
      )
    );
  }
  //filter
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  //update user doc
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'succes',
    data: {
      user: updatedUser,
    },
  });
});

userCtrl.createUser = catchAsync(async (req, res, next) => {
  res.status(202).json({
    status: 'succes',
    data: null,
  });
});


userCtrl.deleteMe = catchAsync(async (req, res, next) => {
  //error por si POST password data
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(202).json({
    status: 'succes',
    data: null,
  });
});

userCtrl.getAllUsers = factory.getAll(User);

userCtrl.getUser = factory.getOne(User);

userCtrl.deleteUser = factory.deleteOne(User);
//no actualizar password  con esto
userCtrl.updateUser = factory.updateOne(User);

module.exports = userCtrl;
