const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD POUR CREATION EMPLOYEE
const crypto = require('crypto');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

const employeeQueries = require('../queries/employeeQueries');

router.get('/',
    // passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        // const employee = req.employee;

        // if (!employee || !employee.isAdmin || !employee.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // }

        employeeQueries.selectAllEmployees().then(employees => {
            res.json(employees);
        }).catch(err => {
            return next(err);
        });
    });


router.get('/role/:role',
    (req, res, next) =>
    {
        // const employeeConnected = req.employee;
        const role = req.params.role;
        // if (!employeeConnected) {
        //     return next(new HttpError(401, "Vous devez etre connecté"));
        // };
        // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // };

        employeeQueries.selectAllEmployeesByRole(role).then(employeeList =>
        {
            res.json(employeeList);
        }).catch(err =>
        {
            return next(err);
        });
    });
router.get('/role',
    (req, res, next) =>
    {
        // const employeeConnected = req.employee;
        // if (!employeeConnected) {
        //     return next(new HttpError(401, "Vous devez etre connecté"));
        // };
        // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // };

        employeeQueries.selectAllRoles().then(roleList =>
        {
            console.log("roleList:", roleList);
            res.json(roleList);
        }).catch(err =>
        {
            return next(err);
        });
    });

//Ne pas utiliser le passport authenticate pour l'instant
//passport.authenticate('basic', {session:false}), (req,res,next)...
router.post('/', (req, res, next) =>
{
    // const employee = req.employee;

    // if(!employee || !employee.isAdmin || !employee.isSuperAdmin) {
    //     return next(new HttpError(403, "Droit administrateur requis"));
    // };

    employeeQueries.selectAllRoles().then(roleList => {
        res.json(roleList);
    }).catch(err => {
        return next(err);
    });
});

router.get('/:employeeNumber', (req, res, next) => {
    // const employeeConnected = req.employee;
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

    if (isNaN(employeeNumberToGet)) { return next(new HttpError(404, `Le Barcode doit contenir seulement des chiffres`)); }

    if (employeeNumberToGet.length == 4)
    {
        employeeQueries.selectEmployeeByEmployeeNumber(employeeNumberToGet).then(employee =>
        {
            if (employee)
            {
                res.json(employee);
            } else
            {
                return next(new HttpError(404, `Employé avec le numéro ${employeeNumberToGet} inexistant ou introuvable`));
            }
        }).catch(err =>
        {
            return next(err);
        });
    } else if (employeeNumberToGet.length == 16)
    {
        employeeQueries.selectEmployeeByBarcodeNumber(employeeNumberToGet).then(employee =>
        {
            if (employee)
            {
                res.json(employee);
            } else
            {
                return next(new HttpError(404, `Barcode ${employeeNumberToGet} inexistant ou introuvable`));
            }
        }).catch(err =>
        {
            return next(err);
        });
    } else
    {
        return next(new HttpError(404, `Numero non conforme`));
    }
})
module.exports = router;