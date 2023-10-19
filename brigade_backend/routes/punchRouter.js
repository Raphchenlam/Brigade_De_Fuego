const express = require('express');
const router = express.Router();
const passport = require('passport');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

const employeeQueries = require('../queries/employeeQueries');
const punchQueries = require('../queries/punchQueries');

// FOR NOW, PunchIn/PunchOut Operation

//Espace Employé - Admin
router.get('/all/:dateIn',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;
        if (!user) return next(new HttpError(401, 'Connexion requise'));
        if (!user.isAdmin) return next(new HttpError(403, 'Droits administrateur requis'));

        const dateIn = req.params.dateIn;
        if (!dateIn) return next(HttpError(400, 'Le champ dateIn est requis'));

        punchQueries.selectAllPunchsFromDateIn(dateIn).then(punchs => {
            res.json(punchs);
        }).catch(err => {
            return next(err);
        });
    });


// //Espace Employé - Admin
// router.get('/all',
//     passport.authenticate('basic', { session: false }),
//     (req, res, next) => {
//         const user = req.user;

//         if (!user) return next(new HttpError(401, 'Connexion requise'));
//         if (!user.isAdmin) return next(new HttpError(403, 'Droits administrateur requis'));

//         punchQueries.selectAllPunchs().then(punchs => {
//             res.json(punchs);
//         }).catch(err => {
//             return next(err);
//         });
//     });


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

//Espace Employé - Admin
router.put('/:punchId',
    passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        
        const employee = req.user;
        if(!employee) return next(new HttpError(401), 'Connexion requise');
        if (!employee.isAdmin) return next(new HttpError(403, "Vous devez avoir les droits administrateurs pour pouvoir modifier les heures d'un employé"));
        
        const punchToUpdate = req.body;
        if(!punchToUpdate) return next(new HttpError(400), "L'objet punch est requis");

        const punchId = punchToUpdate.id;
        if(!punchId) return next (new HttpError (400, "Le paramètre id est requis"))
        const dbPunch = await punchQueries.selectPunchByPunchId(punchId);
        
        const dbEmployee = await employeeQueries.selectEmployeeByEmployeeNumber(punchToUpdate.employeeNumber);
        if(!dbEmployee) return next(new HttpError(404, `Employé(e) au numéro ${punchToUpdate.employeeNumber} n'existe pas`));
        
        const employeeNumber = punchToUpdate.employeeNumber;
        if(!employeeNumber) return next (new HttpError (400, "Le paramètre employeeNumber est requis"));
        if(employeeNumber != dbPunch.employeeNumber) return next (new HttpError(409, 'Le numéro de l\'employé du punch ne correspond pas à celui reçu de la base de données'));
        
        const employeeFullName = punchToUpdate.employeeFullName;
        if(!employeeFullName || employeeFullName == '') return next (new HttpError (400, "Le paramètre employeeFullName est requis")); 
        if(employeeFullName != dbPunch.employeeFullName) return next (new HttpError(409, 'Le nom de l\'employé du punch ne correspond pas à celui reçu de la base de données'));
        
        const dateIn = punchToUpdate.dateIn;
        if(!dateIn) return next (new HttpError (400, "Le paramètre dateIn est requis"));
        if(dateIn != dbPunch.dateIn) return next (new HttpError(409, 'La date de début de ce punch ne correspond pas à celle de la base de données'));
        
        const startTime = punchToUpdate.startTime;
        if(!startTime) return next (new HttpError (400, "Le paramètre startTime est requis"));

        const dateOut = punchToUpdate.dateOut;
        if(dateOut){
            const dateInParts = dateIn.split('-');
            const dateOutParts = dateOut.split('-');
            
            const dateInObj = new Date(dateInParts[0], dateInParts[1] -1, dateInParts[2]);
            const dateOutObj = new Date(dateOutParts[0], dateOutParts[1] -1, dateOutParts[2]);

            if(dateOutObj < dateInObj){
                return next (new HttpError (400, "La date de fin ne peut pas être plus vielle que la date de début"));
            }
        }

        punchQueries.updateEmployeePunchByPunchId(punchToUpdate).then(updatedPunch => {
            res.json(updatedPunch);
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
        if(!punchOut) return next(new HttpError(400), "L'objet punchOut est requis");

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




module.exports = router;