const express = require('express');
const router = express.Router();
const passport = require('passport');
const clientQueries = require('../queries/clientQueries');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

router.get("/",
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;
        if (!user) {
            return next(new HttpError(401, "Authentification nécessaire"))
        }
        console.log("user",user)
        if (!user.isAdmin && !user.isSuperAdmin) {
            return next(new HttpError(403, "Vous n'avez pas les droits requis"))
        }
        clientQueries
            .getClientList()
            .then((clients) => {
                if (clients) {
                    res.json(clients);
                } else {
                    return next(new HttpError(404, `Une erreur inconnue est survenue`));
                }
            })
            .catch((err) => {
                return next(err);
            });
    }
);

router.get("/:id",
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;
        if (!user) {
            return next(new HttpError(401, "Authentification nécessaire"))
        }
        if (!user.isAdmin && !user.isSuperAdmin) {
            return next(new HttpError(403, "Vous n'avez pas les droits requis"))
        }

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
    passport.authenticate("basic", { session: false }),
    (req, res, next) => {
        const user = req.user;

        if (!user) {
            return next(new HttpError(401, "Authentification nécessaire"))
        }
        if (!user.isAdmin && !user.isSuperAdmin) {
            return next(new HttpError(403, "Vous n'avez pas les droits requis"))
        }

        const firstName = req.body.firstName;
        if (!firstName || firstName === "") return next(new HttpError(400, "Le champ prénom est requis"));
        if (!regex.validName.test(firstName)) return next(new HttpError(400, "Le champ prénom ne respect pas les critères d'acceptation"));
        if (firstName.length > 255) return next(new HttpError(400, `Le champ prénom ne peux pas dépasser 255 caractères. Il y a ${firstName.length - 255} caractères de trop.`));

        const lastName = req.body.lastName;
        if (!lastName || lastName === "") return next(new HttpError(400, "Le champ nom de famille est requis"));
        if (!regex.validName.test(lastName)) return next(new HttpError(400, "Le champ nom de famille ne respect pas les critères d'acceptation"));
        if (lastName.length > 255) return next(new HttpError(400, `Le champ nom de famille ne peux pas dépasser 255 caractères. Il y a ${lastName.length - 255} caractères de trop.`));

        const phoneNumber = req.body.phoneNumber;
        if (!phoneNumber || phoneNumber === "") return next(new HttpError(400, "Le champ numéro de téléphone est requis"));
        if (!regex.validPhoneNumber.test(phoneNumber)) return next(new HttpError(400, "Le champ numéro de téléphone ne respect pas les critères d'acceptation"));
        if (phoneNumber.length > 12 || phoneNumber.length < 10) return next(new HttpError(400, `Le champ numéro de téléphone ne peux pas dépasser 10 caractères. Il y a ${phoneNumber.length - 10} caractères de trop.`));

        clientQueries.getClientByInformations(firstName, lastName, phoneNumber)
            .then((client) => {
                if (client) {
                    throw new HttpError(409, `Un client avec le prénom ''${firstName}'', le nom ''${lastName}'' et le numéro de téléphone ''${phoneNumber}'' existe déjà`);
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
                res.json(result);
            })
            .catch((err) => {
                next(err);
            });
    }
);

module.exports = router;