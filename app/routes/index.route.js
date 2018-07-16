const indexRouter = require('./index');
const usersRouter = require('./users');

module.exports = (app) => {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });
}
