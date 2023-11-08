const express = require('express');
const router = express.Router();
const passport = require('passport');
const regex = require('../REGEX/REGEXbackend');
const HttpError = require("../HTTPError");

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

router.post('/',
    passport.authenticate("basic", { session: false }),
    (req, res, next) => {
        const user = req.user;

        if (!user) {
            return next(new HttpError(401, "Authentification nécessaire"))
        }

        const newAssignations = req.body.assignations

        assignationQueries.insertAssignation(newAssignations)
            .then((result) => {
                res.json(result);
            }).catch((err) => {
                next(err);
            })
    })



module.exports = router;