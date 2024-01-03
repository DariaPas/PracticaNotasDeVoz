var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Import the handleList function from the previous code
const { handleList } = require('./handlemongo');

var app = express();

// Ignore requests for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// Define a new route handler for /api/list/:id
app.get('/api/list/:id', async (req, res, next) => {
  try {
    // Extract the user ID from the request parameters
    const userId = req.params.id;

    // Call the handleList function to get the JSON response
    const jsonResponse = await handleList(userId);

    // Send the JSON response
    res.json(jsonResponse);
  } catch (error) {
    // Forward the error to the error handler
    next(error);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
