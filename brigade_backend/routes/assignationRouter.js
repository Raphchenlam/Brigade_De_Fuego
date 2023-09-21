const express = require('express');
const router = express.Router();
const passport = require('passport');

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

module.exports = router;