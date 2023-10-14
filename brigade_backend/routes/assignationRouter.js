const express = require('express');
const router = express.Router();
const passport = require('passport');
const regex = require('../../REGEX/REGEX_backend');
const HttpError = require("../HttpError");

const assignationQueries = require("../queries/assignationQueries");

//GET assignation par date
router.get('/:date', (req, res, next) => {
    const date = req.params.date;
    assignationQueries.getAssignationsByDate(date)
        .then(assignationList => {
            if (assignationList) {
                res.json(assignationList);
            } else {
                return next(new HttpError(404, `Les assignation sont introuvables`));
            }
        })
        .catch((err) => {
            return next(err);
        });
});

router.post('/', (req, res, next) => {
    const user = req.user;

    const employeeNumber = req.body.employeeNumber;
    const tableNumber = req.body.tableNumber;
    const date = req.body.date;
    const shift = req.body.shift;
    const isActive = req.body.isActive;

    if (!employeeNumber || employeeNumber == '') return next(new HttpError(400, 'Le champ employeeNumber est requis'));
    if (!regex.validEmployeeNumber.test(employeeNumber)) return next(new HttpError(400, 'Le numéro d\'employé ne respecte pas les critères d\'acceptation'));

    if (!tableNumber || tableNumber == "") {
        return next(new HttpError(400, "Le numéro de la table est requis."));
    }
    if (!date || date == "") {
        return next(new HttpError(400, "La date est requise."));
    }
    if (!shift || shift == "") {
        return next(new HttpError(400, "Le shift est requis."));
    }
    if (isActive == null) {
        return next(new HttpError(400, "Le status de l'assignation est requis."));
    }

    const newAssignation = {
        employeeNumber: req.body.employeeNumber,
        tableNumber: req.body.tableNumber,
        date: req.body.date,
        shift: req.body.shift,
        isActive: req.body.isActive,
    }
assignationQueries.insertAssignation(newAssignation)
.then((result) => {
    res.json(result);
}).catch((err)=>{
    next(err);
})
})



module.exports = router;