const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const HttpError = require('./HttpError');

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');

const clientRouter = require ('./routes/clientRouter');
const eventRouter = require ('./routes/eventRouter');
const leaveRouter = require ('./routes/leaveRouter');
const punchRouter = require ('./routes/punchRouter');
const reservationRouter = require ('./routes/reservationRouter');
const schedulePeriodRouter = require ('./routes/schedulePeriodRouter');
const sectionRouter = require ('./routes/sectionRouter');
const tableRouter = require ('./routes/tableRouter');

const employeeQueries = require ('./queries/employeeQueries');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

class BasicStrategyModified extends BasicStrategy {
    constructor(options, verify) {
      return super(options, verify);
    }
  
    _challenge() {
      return 'xBasic realm="' + this._realm + '"';
    }
}