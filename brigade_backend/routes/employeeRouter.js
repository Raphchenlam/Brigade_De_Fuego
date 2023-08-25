const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD POUR CREATION EMPLOYEE

const HttpError = require("../HttpError");

const employeeQueries = require ('../queries/employeeQueries');

router.get('/', (req,res,next) => {
    employeeQueries.getAllEmployees().then(employees => {
        res.json(employees);
    }).catch(err => {
        return next(err);
    });
});

module.exports = router;