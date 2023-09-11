
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
const schedulePeriodRouter = require ('./routes/schedulePeriodRouter');
const sectionRouter = require ('./routes/sectionRouter');
const tableRouter = require ('./routes/tableRouter');


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

class BasicStrategyModified extends BasicStrategy {
    constructor(options, verify) {
      return super(options, verify);
    }
  
    _challenge() {
      return 'xBasic realm="' + this._realm + '"' ;
    }
};

passport.use(new BasicStrategyModified((user_email, password, cb) => {
  userAccountQueries.getLoginByUserAccountEmail(user_email).then(login => {
    if (!login || !login.isActive) {
      return cb(null, false);
    }

    const iterations = 100000;
    const keylen = 64;
    const digest = "sha512";

    crypto.pbkdf2(password, login.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
      if (err) {
        return cb(err);
      }

      const passwordHashBuffer = Buffer.from(login.passwordHash, "base64");

      if (!crypto.timingSafeEqual(passwordHashBuffer, hashedPassword)) {
        return cb(null, false);
      }

      return cb(null, login);
    });
  }).catch(err => {
    return cb(err);
  });
})
);

app.get('/login',
  passport.authenticate('basic', { session: false }),
  (req, res, next) => {
    if (req.user) {
      const userDetails = {
        userAccountId: req.user.userAccountId,
        userFullName: req.user.userFullName,
        isAdmin: req.user.isAdmin,
        isActive: req.user.isActive
      };

      res.json(userDetails);
    } else {
      return next({ status: 500, message: "Propriété user absente" });
    }
  }
);

app.post('/login',
  (req, res, next) => {
    if (!req.body.userAccountId || req.body.userAccountId === '') return next(new HttpError(400, 'Propriété userAccountId requise'));
    if (!req.body.password || req.body.password === '') return next(new HttpError(400, 'Propriété password requise'));

    const saltBuf = crypto.randomBytes(16);
    const salt = saltBuf.toString("base64");

    crypto.pbkdf2(req.body.password, salt, 100000, 64, "sha512", async (err, derivedKey) => {
      if (err) return next(err);

      const passwordHashBase64 = derivedKey.toString("base64");

      try {
        const userAccountWithPasswordHash = await userAccountQueries.createUserAccount(req.body.userAccountId,
          passwordHashBase64, salt, req.body.userFullName);

        const userDetails = {
          userAccountId: userAccountWithPasswordHash.userAccountId,
          userFullName: userAccountWithPasswordHash.userFullName,
          isAdmin: userAccountWithPasswordHash.isAdmin,
          isActive: userAccountWithPasswordHash.isActive
        };

        res.json(userDetails);
      } catch (err) {
        return next(err);
      }

    });
  }
);

app.use((err, req, res, next) => {
    console.log("error handler: ", err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500)
    if (err instanceof HttpError) {
        res.json(err.getJsonMessage());
    } else {
        res.json(err);
    }
});


module.exports = app;