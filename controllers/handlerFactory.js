const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { APIFeatures } = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      next(new AppError('No se encontro ningun documento con ese ID', 404));
    }

    res.status(204).json({
      status: 'succes',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      next(new AppError('No se encontro ningun documento con ese ID', 404));
    }
    res.status(200).json({
      status: 'succes',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
     console.log(req.file);
     console.log(req.body);
    if (req.file) req.body.imageCover = req.file.filename;
    console.log(req.body.imageCover);
    // console.log(req.body);
    try {
      const doc = await Model.create(req.body);
      res.status(200).json({
        status: 'succes',
        data: {
          data: doc,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate('reviews');
    const doc = await query;

    if (!doc) {
      next(new AppError('No se encontro ningun servicio con ese ID', 404));
    }

    res.status(200).json({
      status: 'succes',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //para el nested get reviews en servicios (esto es un hack )
    let filter = {};
    if (req.params.serviceId) filter = { service: req.params.serviceId };
    //execute query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    //send response
    res.status(200).json({
      status: 'succes',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
