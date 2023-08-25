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

app.use('/employee', employeeRouter);

// class BasicStrategyModified extends BasicStrategy {
//     constructor(options, verify) {
//       return super(options, verify);
//     }
  
//     _challenge() {
//       return 'xBasic realm="' + this._realm + '"' ;
//     }
// }

// passport.use(new BasicStrategyModified((user_email, password, cb) => {
//   userAccountQueries.getLoginByUserAccountEmail(user_email).then(login => {
//     if (!login || !login.isActive) {
//       return cb(null, false);
//     }

//     const iterations = 100000;
//     const keylen = 64;
//     const digest = "sha512";

//     crypto.pbkdf2(password, login.passwordSalt, iterations, keylen, digest, (err, hashedPassword) => {
//       if (err) {
//         return cb(err);
//       }

//       const passwordHashBuffer = Buffer.from(login.passwordHash, "base64");

//       if (!crypto.timingSafeEqual(passwordHashBuffer, hashedPassword)) {
//         return cb(null, false);
//       }

//       return cb(null, login);
//     });
//   }).catch(err => {
//     return cb(err);
//   });
// }));


module.exports = app;