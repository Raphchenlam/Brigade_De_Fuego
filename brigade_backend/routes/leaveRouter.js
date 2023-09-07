const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD POUR CREATION EMPLOYEE
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

const leaveQueries = require('../queries/leaveQueries');

// passport.authenticate('basic', { session: false }), (req,res,next)...
router.get('/',
    (req, res, next) =>
    {
        // const employee = req.employee;

        // if (!employeeConnected) {
        //     return next(new HttpError(401, "Vous devez etre connecté"));
        // };
        // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // };

        leaveQueries.selectAllLeaves().then(leaves =>
        {
            res.json(leaves);
        }).catch(err =>
        {
            return next(err);
        });
    });

router.get('/:employeeNumber',
    (req, res, next) =>
    {
        // const employee = req.employee;
        const employeeNumberToGet = req.params.employeeNumber;
        // if (!employeeConnected) {
        //     return next(new HttpError(401, "Vous devez etre connecté"));
        // };
        // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // };
        // if (employeeConnected.employeeNumber != employeeNumberToGet) {
        //     return next(new HttpError(403, "Vous ne pouvez pas acceder aux informations d'un autre employé"));
        // };

        leaveQueries.selectLeavesByEmployeeNumber(employeeNumberToGet).then(leaves =>
        {
            res.json(leaves);
        }).catch(err =>
        {
            return next(err);
        });
    });

module.exports = router;