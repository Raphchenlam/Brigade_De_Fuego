const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD POUR CREATION EMPLOYEE
const regex = require('../REGEX');

const HttpError = require("../HttpError");

const employeeQueries = require('../queries/employeeQueries');

// passport.authenticate('basic', { session: false }), (req,res,next)...
router.get('/',
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

//Ne pas utiliser le passport authenticate pour l'instant
//passport.authenticate('basic', {session:false}), (req,res,next)...
router.post('/', (req, res, next) => {
    // const employee = req.employee;

    // if(!employee || !employee.isAdmin || !employee.isSuperAdmin) {
    //     return next(new HttpError(403, "Droit administrateur requis"));
    // }

    const employeeNumber = req.body.employeeNumber;
    if (!employeeNumber || employeeNumber == '') {
        return next(new HttpError(400, 'Le champ employeeNumber est requis'));
    }
    if (!regex.validEmployeeNumber.test(employeeNumber)) {
        return next(new HttpError(400, 'Le champ employeeNumber ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }
    employeeQueries.selectEmployeeByEmployeeNumber(employeeNumber).then(employee => {
        if (employee) {
            throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à ce numéro d'employé`);
        }
    }).catch(err => {
        next(err);
    });


    const firstName = req.body.firstName;
    if (!firstName || firstName == '') {
        return next(new HttpError(400, 'Le champ firstName est requis'));
    }
    if (!regex.validName.test(firstName)) {
        return next(new HttpError(400, 'Le champ firstName ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }


    const lastName = req.body.lastName;
    if (!lastName || lastName == '') {
        return next(new HttpError(400, 'Le champ lastName est requis'));
    }
    if (!regex.validName.test(lastName)) {
        return next(new HttpError(400, 'Le champ lastName ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }


    const role = req.body.role;
    if (!role || role == '') {
        return next(new HttpError(400, 'Le champ role est requis'));
    }
    employeeQueries.selectRoleByName(role).then(existingRole => {
         if(!existingRole){
            throw new HttpError(400, `Le role ${role} n'existe pas`);    
         }    
    });


    const colorHexcode = req.body.colorHexcode;
    if (!colorHexcode || colorHexcode == '') {
        return next(new HttpError(400, 'Le champ colorHexcode est requis'));
    }
    if (!regex.validcolorHexcode.test(colorHexcode)) {
        return next(new HttpError(400, 'Le champ colorHexcode ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }
    employeeQueries.selectAssignedColorHexcode(colorHexcode).then(assignedColorHexcode => {
        if(assignedColorHexcode){
           throw new HttpError(400, `${req.body.firstName} ${req.body.lastName} est associé(e) à cette couleur`);
        }
    });


    const hourlyRate = req.body.hourlyRate;
    if (!hourlyRate || hourlyRate == '') {
        return next(new HttpError(400, 'Le champ hourlyRate est requis'));
    }
    if (!regex.validHourlyRate.test(hourlyRate)) {
        return next(new HttpError(400, 'Le champ barcodeNumber ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }


    const barcodeNumber = req.body.barcodeNumber;
    if (!barcodeNumber || barcodeNumber == '') {
        return next(new HttpError(400, 'Le champ barcodeNumber est requis'));
    }
    if (!regex.validBarcodeNumber.test(barcodeNumber)) {
        return next(new HttpError(400, 'Le champ barcodeNumber ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }


    const employeeEmail = req.body.employeeEmail;
    if (!employeeEmail || employeeEmail == '') {
        return next(new HttpError(400, 'Le champ employeeEmail est requis'));
    }
    if (!regex.validEmail.test(employeeEmail)) {
        return next(new HttpError(400, 'Le champ employeeEmail ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }


    const phoneNumber = req.body.phoneNumber;
    if (!phoneNumber || phoneNumber == '') {
        return next(new HttpError(400, 'Le champ phoneNumber est requis'));
    }
    if (!regex.validPhoneNumber.test(phoneNumber)) {
        return next(new HttpError(400, 'Le champ phoneNumber ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }


    const isAdmin = req.body.isAdmin;
    if (!isAdmin || isAdmin == '') {
        return next(new HttpError(400, 'Le champ isAdmin est requis'));
    }


    const skillPoints = req.body.skillPoints;
    if (!skillPoints || skillPoints == '') {
        return next(new HttpError(400, 'Le champ skillPoints est requis'));
    }
    if (!regex.validSkillPoints.test(skillPoints)) {
        return next(new HttpError(400, 'Le champ skillPoints ne respecte pas les critères d\'acceptation de la REGEX associé à ce champ'));
    }

    const newEmployee = {
        employeeNumber: "" + employeeNumber,
        fisrtName: "" + firstName,
        lastName: "" + lastName,
        role: "" + role,
        colorHexCode: "" + colorHexCode,
        hourlyRate: "" + hourlyRate,
        barcodeNumber: "" + barcodeNumber,
        employeeEmail: "" + employeeEmail,
        phoneNumber: "" + req.body.phoneNumber,
        isAdmin: "" + req.body.isAdmin,
        skillPoints: "" + req.body.skillPoints
    };

    return employeeQueries.insertEmployee(newEmployee);

}
);

module.exports = router;