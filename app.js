const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');



const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
//data sanitization against no sql query inject
app.use(mongoSanitize());

//data sanitization
app.use(xss());

//prevent parameter pollution
app.use(hpp({
    whitelist: ['category', 'ratingsQuantity', 'ratingsAverage', 'price'],
  })
);

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());

// app.get('api/v1/services', (req, res) => {});

app.use('/', viewRouter);

app.use('/api/v1/users', userRouter);


app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `No se consigue ${req.originalUrl} en este servidor!`,
  // });
  // const err = new Error(`No se consigue ${req.originalUrl} en este servidor!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // next(err);
  next(
    new AppError(`No se consigue ${req.originalUrl} en este servidor!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
