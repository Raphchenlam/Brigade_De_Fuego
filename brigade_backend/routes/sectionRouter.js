const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HttpError");

const sectionQueries = require("../queries/sectionQueries");

//GET assignation par date
router.get('/:date', (req, res, next) => {
    const date = req.params.date;
    console.log("Date : " + date);
    sectionQueries.getAssignationsByDate(date)
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