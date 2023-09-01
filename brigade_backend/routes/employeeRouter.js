const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD POUR CREATION EMPLOYEE

const HttpError = require("../HttpError");

const employeeQueries = require ('../queries/employeeQueries');

router.get('/', 
    passport.authenticate('basic', {session:false}) , (req,res,next) => {
        const employee = req.employee;

        if(!employee || !employee.isAdmin || !employee.isSuperAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        employeeQueries.selectAllEmployees().then(employees => {
            res.json(employees);
        }).catch(err => {
            return next(err);
        });
    });

router.post('/',
    passport.authenticate('basic', {session:false}), (req,res,next) => {
        const employee = req.employee;

        if(!employee || !employee.isAdmin || !employee.isSuperAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        const employeeNumber = employee.employeeNumber;
        if(!employeeNumber || employeeNumber == ''){
            return next(new HttpError(400, 'Le champ employeeNumber est requis'));
        }

        //Double verif Input ?

        employeeQueries.selectEmployeeByEmployeeNumber(employeeNumber).then(employee => {
            if(employee){
                throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé à ce numéro d'employé`);
            }

            const newEmployee = {
                employeeNumber: "" + employeeNumber,
                fisrtName: "" + req.body.firstName,
                lastName: "" + req.body.lastName,
                role: "" + req.body.role,
                colorHexCode: "" + req.body.colorHexCode,
                hourlyRate: "" + req.body.hourlyRate,
                barcodeNumber: "" + req.body.barcodeNumber,
                employeeEmail: "" + req.body.employeeEmail,
                phoneNumber: "" + req.body.phoneNumber,
                isAdmin: "" + req.body.isAdmin,
                skillPoints: "" + req.body.skillPoints
            };

            return employeeQueries.insertEmployee(newEmployee);

        }).then(result => {
            if (!result){
                return next(new HttpError(404, `L'employé avec le numéro ${employeeNumber} introuvable`));
            }
            res.json(result);
        }).catch(err => {
            next(err);
        });
    }
);

module.exports = router;