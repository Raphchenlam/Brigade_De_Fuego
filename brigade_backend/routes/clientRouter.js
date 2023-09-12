const express = require('express');
const router = express.Router();
const passport = require('passport');
const clientQueries = require('../queries/clientQueries');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

router.get("/:id",
    (req, res, next) => {
        const id = req.params.id;

        clientQueries
            .getClientById(id)
            .then((client) => {
                if (client) {
                    res.json(client);
                } else {
                    return next(new HttpError(404, `Le client ${id} est introuvable`));
                }
            })
            .catch((err) => {
                return next(err);
            });
    }
);


router.post("/",
    // passport.authenticate("basic", { session: false }),
    (req, res, next) => {
        // const user = req.user;
        // if(!user){
        //     return next(new HttpError(403, "Authentification nécessaire"))
        // }     

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phoneNumber = req.body.phoneNumber;

        if (!firstName || firstName === "") return next(new HttpError(400, "Le champ prénom est requis"));
        if (regex) return next(new HttpError(400, "Le champ prénom est requis"));
        if (!lastName || lastName === "") return next(new HttpError(400, "Le champ nom de famille est requis"));
        if (!phoneNumber || phoneNumber === "") return next(new HttpError(400, "Le champ numéro de téléphone est requis"));

        clientQueries.getClientByInformations(firstName, lastName, phoneNumber)
            .then((client) => {
                if (client) {
                    throw new HttpError(409, `Un client avec le prénom "${firstName}", le nom "${lastName}" et le numéro de téléphone "${phoneNumber}" existe déjà`);
                }

                const clientInfos = {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    allergy: req.body.allergy,
                    isFavorite: req.body.isFavorite,
                    isBlacklisted: req.body.isBlacklisted
                };

                return clientQueries.insertClient(clientInfos);
            })
            .then((result) => {
                console.log(result);
                res.json(result);
            })
            .catch((err) => {
                next(err);
            });
    }
);

module.exports = router;