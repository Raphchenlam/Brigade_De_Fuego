
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const HttpError = require('./HttpError');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');

const clientRouter = require ('./routes/clientRouter');
const employeeRouter = require ('./routes/employeeRouter');
const eventRouter = require ('./routes/eventRouter');
const eventTypeRouter = require ('./routes/eventTypeRouter');
const leaveRouter = require ('./routes/leaveRouter');
const punchRouter = require ('./routes/punchRouter');
const reservationRouter = require ('./routes/reservationRouter');
const scheduleRouter = require ('./routes/scheduleRouter');
const assignationRouter = require ('./routes/assignationRouter');
const tableRouter = require ('./routes/tableRouter');

const employeeQueries = require("./queries/employeeQueries");


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/client', clientRouter);
app.use('/employee', employeeRouter);
app.use('/event', eventRouter);
app.use('/eventType', eventTypeRouter);
app.use('/leave', leaveRouter);
app.use('/reservation', reservationRouter);
app.use('/schedule', scheduleRouter);
app.use('/table', tableRouter);
app.use('/assignation', assignationRouter)

class BasicStrategyModified extends BasicStrategy
{
  constructor(options, verify)
  {
    return super(options, verify);
  }

  _challenge()
  {
    return 'xBasic realm="' + this._realm + '"';
  }
};

passport.use(new BasicStrategyModified((employeeNumber, password, cb) =>
{
  if (employeeNumber.length == 16)
  {
    employeeQueries.selectEmployeeByBarcodeNumber(employeeNumber).then(login =>
    {
      if (!login || !login.isAdmin || !login.isSuperAdmin)
      {
        return cb(null, false);
      }
      return cb(null, login);
    }).catch(err =>
    {
      return cb(err);
    })
  } else
  {
    employeeQueries.selectLoginByEmployeeNumber(employeeNumber).then(login =>
    {
      if (!login || !login.isActive)
      {
        return cb(null, false);
      }

      const iterations = 100000;
      const keylen = 64;
      const digest = "sha512";

      crypto.pbkdf2(password, login.passwordSalt, iterations, keylen, digest, (err, hashedPassword) =>
      {
        if (err)
        {
          return cb(err);
        }

        const passwordHashBuffer = Buffer.from(login.passwordHash, "base64");

        if (!crypto.timingSafeEqual(passwordHashBuffer, hashedPassword))
        {
          return cb(null, false);
        }

        return cb(null, login);
      });
    }).catch(err =>
    {
      return cb(err);
    });
  }
})
);

app.get('/login',
  passport.authenticate('basic', { session: false }),
  (req, res, next) =>
  {
    //want to change user for employee
    if (req.user)
    {

      const employeeDetails = {
        employeeNumber: req.user.employeeNumber,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        isAdmin: req.user.isAdmin,
        isSuperAdmin: req.user.isSuperAdmin,
        isNewEmployee: req.user.isNewEmployee,
        isActive: req.user.isActive
      };

      res.json(employeeDetails);
    } else
    {
      return next({ status: 500, message: "Propriété employee absente" });
    }
  }
);

app.use((err, req, res, next) =>
{
  console.error("error handler: ", err);
  if (res.headersSent)
  {
    return next(err);
  }
  res.status(err.status || 500)
  if (err instanceof HttpError)
  {
    res.json(err.getJsonMessage());
  } else
  {
    res.json(err);
  }
});


module.exports = app;