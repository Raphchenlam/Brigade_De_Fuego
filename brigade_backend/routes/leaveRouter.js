const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD

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


router.get('/filter',
    (req, res, next) =>
    {
        // const employee = req.employee;

        // if (!employeeConnected) {
        //     return next(new HttpError(401, "Vous devez etre connecté"));
        // };
        // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // };
        const checkboxesData = req.query.data;
        if (!checkboxesData) return next(new HttpError(400, `Un data de checkboces doit etre fournis`));
        console.log("checkboxesData", checkboxesData)
        const checkboxes = JSON.parse(checkboxesData);
        console.log("checkboxes", checkboxes)

        if (!checkboxes.accepted && !checkboxes.refused && !checkboxes.pending && !checkboxes.pendingModified) 
        {
            res.json([]);
        }
        if (!checkboxes.coming && !checkboxes.passed) 
        {
            res.json([]);
        }

        leaveQueries.selectAllFilteredLeaves(checkboxes).then(leaves =>
        {
            console.log("leaves qui senvoie du backend au frontend", leaves)
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