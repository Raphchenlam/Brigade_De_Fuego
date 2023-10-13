const express = require('express');
const router = express.Router();
const passport = require('passport');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

const employeeQueries = require('../queries/employeeQueries');
const punchQueries = require('../queries/punchQueries');


// FOR NOW, PunchIn/PunchOut Operation
router.get('/:barcodeNumber',
    // passport.authenticate('basic', { session: false }),
    async (req, res, next) => {

        const barcodeNumber = req.params.barcodeNumber;
        if (!barcodeNumber) return next(new HttpError(400, "Le champ barcodeNumber est requis"));
        if (!regex.validBarcodeNumber.test(barcodeNumber)) return next(new HttpError(400, `Le code barre ${barcodeNumber} ne respecte pas les critères d'acceptation`));

        const employee = await employeeQueries.selectEmployeeByBarcodeNumber(barcodeNumber);
        if (!employee) return next(new HttpError(404, `Employé(e) au numéro ${barcodeNumber} n'existe pas`));

        punchQueries.selectLastPunchOfEmployee(employee.employeeNumber).then(lastPunch => {
            res.json(lastPunch);
        }).catch(err => {
            return next(err);
        });
    }
);

// //Espace Employé - Admin
// router.get('/:employeeNumber',
//     passport.authenticate('basic', { session: false }),
//     (req, res, next) => {

//     });

// //Espace Employé - Admin
// router.get('/',
//     passport.authenticate('basic', { session: false }),
//     (req, res, next) => {

//     });


//PunchIn/PunchOut Operation
router.post('/',
    // passport.authenticate('basic', { session: false }),
    async (req, res, next) => {

        const punchIn = req.body;

        let barcodeNumber = punchIn.barcodeNumber;
        if (!barcodeNumber) return next(new HttpError(400, "Le champ barcodeNumber est requis"));
        if (!regex.validBarcodeNumber.test(barcodeNumber)) return next(new HttpError(400, `Le code barre ${barcodeNumber} ne respecte pas les critères d'acceptation`));

        const dateIn = punchIn.dateIn;
        if (!dateIn) return next(new HttpError(400, "Le champ dateIn est requis"));

        const startTime = punchIn.startTime;
        if (!startTime) return next(new HttpError(400, "Le champ startTime est requis"));

        const employee = await employeeQueries.selectEmployeeByBarcodeNumber(barcodeNumber);
        if (!employee) return next(new HttpError(404, `Employé(e) au numéro ${barcodeNumber} n'existe pas`));

        //VERFIER QU<UN EMPLOYE NE PEUT PAS PUNCHER POUR QUELQUUN DAUTRE, À VOIR SI CEST POSSIBLE DEMAIN MATIN DANS LA RENCONTRE

        const punchInWithEmployeeNumber = {
            employeeNumber: employee.employeeNumber,
            dateIn: dateIn,
            startTime: startTime
        };

        punchQueries.insertEmployeePunchIn(punchInWithEmployeeNumber).then(result => {
            res.json(result);
        }).catch(err => {
            return next(err);
        });
    }
);

//PunchIn/PunchOut Operation
router.put('/',
    // passport.authenticate('basic', { session: false }),
    async (req, res, next) => {

        const punchOut = req.body;

        const barcodeNumber = punchOut.barcodeNumber;
        if (!barcodeNumber) return next(new HttpError(400, "Le champ barcodeNumber est requis"));
        if (!regex.validBarcodeNumber.test(barcodeNumber)) return next(new HttpError(400, `Le code barre ${barcodeNumber} ne respecte pas les critères d'acceptation`));

        const dateIn = punchOut.dateIn;
        if (!dateIn) return next(new HttpError(400, "Le champ dateIn est requis"));

        const dateOut = punchOut.dateOut;
        if (!dateOut) return next(new HttpError(400, "Le champ dateIn est requis"));

        const startTime = punchOut.startTime;
        if (!startTime) return next(new HttpError(400, "Le champ startTime est requis"));

        const endTime = punchOut.endTime;
        if (!endTime) return next(new HttpError(400, "Le champ endTime est requis"));

        const employee = await employeeQueries.selectEmployeeByBarcodeNumber(barcodeNumber);
        if (!employee) return next(new HttpError(404, `Employé(e) au numéro ${barcodeNumber} n'existe pas`));

        const punchOutWithEmployeeNumber = {
            employeeNumber: employee.employeeNumber,
            dateIn: dateIn,
            startTime: startTime,
            dateOut: dateOut,
            endTime: endTime
        };

        punchQueries.updateEmployeePunchOut(punchOutWithEmployeeNumber).then(result => {
            res.json(result);
        }).catch(err => {
            return next(err);
        });
    }
);


// //Espace Employé - Admin
// router.put('/:employeeNumber',
//     passport.authenticate('basic', { session: false }),
//     async (req, res, next) => {
//         const employee = req.user;

//         if (!employee.isAdmin || !employee.isSuperAdmin) return next(new HttpError(403, "Vous devez avoir les droits administrateurs pour pouvoir modifier les heures d'un employé"));
//     }
// );

module.exports = router;