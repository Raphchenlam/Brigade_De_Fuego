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
        if (!user) return next(new HttpError(401, "Authentification nécessaire"));
        if (!user.isAdmin || !user.isSuperAdmin) return next(new HttpError(403, "Vous n'avez pas les droits requis"));

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
        if (!user) return next(new HttpError(401, "Authentification nécessaire"));
        if (!user.isAdmin || !user.isSuperAdmin) return next(new HttpError(403, "Vous n'avez pas les droits requis"));

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
        if (!user) return next(new HttpError(401, "Authentification nécessaire"));
        if (!user.isAdmin || !user.isSuperAdmin) return next(new HttpError(403, "Vous n'avez pas les droits requis"));

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

router.put("/",
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;
        if (!user) return next(new HttpError(401, "Authentification nécessaire"));
        if (!user.isAdmin || !user.isSuperAdmin) return next(new HttpError(403, "Vous n'avez pas les droits requis"));

        let treeFieldComboHasChanged = false;
        let hasChanged = false;

        // id
        const clientId = req.body.id;
        if (!clientId || clientId == "") return next(new HttpError(400, "Le champ id est requis"));
        if (isNaN(clientId)) return next(new HttpError(400, "Le champ id doit être un nombre"));

        // firstName
        const clientOldFirstName = req.body.oldFirstName;
        if (!clientOldFirstName || clientOldFirstName == "") return next(new HttpError(400, "Le champ ancien prénom est requis"));
        if (!regex.validName.test(clientOldFirstName)) return next(new HttpError(400, "Le champ ancien prénom ne respect pas les critères d'acceptations"));
        if (clientOldFirstName.length > 255) return next(new HttpError(400, `Le champ ancien prénom ne peux pas dépasser 255 caractères. Il y a ${clientOldFirstName.length - 255} caractères de trop.`));

        const clientNewFirstName = req.body.newFirstName;
        if (!!clientNewFirstName) {
            if (!regex.validName.test(clientNewFirstName)) return next(new HttpError(400, "Le champ nouveau prénom ne respect pas les critères d'acceptations"));
            if (clientNewFirstName.length > 255) return next(new HttpError(400, `Le champ nouveau prénom ne peux pas dépasser 255 caractères. Il y a ${clientNewFirstName.length - 255} caractères de trop.`));
            if (clientNewFirstName == clientOldFirstName) return next(new HttpError(400, `L'ancien prénom ainsi que le nouveau ne peuvent être identique ${clientOldFirstName} et ${clientNewFirstName}.`));
            treeFieldComboHasChanged = true;
            hasChanged = true;
        }

        // lastName
        const clientOldLastName = req.body.oldLastName;
        if (!clientOldLastName || clientOldLastName == "") return next(new HttpError(400, "Le champ ancien nom de famille est requis"));
        if (!regex.validName.test(clientOldLastName)) return next(new HttpError(400, "Le champ ancien nom de famille ne respect pas les critères d'acceptations"));
        if (clientOldLastName.length > 255) return next(new HttpError(400, `Le champ ancien nom de famille ne peux pas dépasser 255 caractères. Il y a ${clientOldLastName.length - 255} caractères de trop.`));

        const clientNewLastName = req.body.newLastName;
        if (!!clientNewLastName) {
            if (!regex.validName.test(clientNewLastName)) return next(new HttpError(400, "Le champ nouveau nom de famille ne respect pas les critères d'acceptations"));
            if (clientNewLastName.length > 255) return next(new HttpError(400, `Le champ nouveau nom de famille ne peux pas dépasser 255 caractères. Il y a ${clientNewLastName.length - 255} caractères de trop.`));
            if (clientNewLastName == clientOldLastName) return next(new HttpError(400, `L'ancien nom de famille ainsi que le nouveau ne peuvent être identique ${clientOldLastName} et ${clientNewLastName}.`));
            treeFieldComboHasChanged = true;
            hasChanged = true;
        }

        // phoneNumber
        const clientOldPhoneNumber = req.body.oldPhoneNumber;
        if (!clientOldPhoneNumber || clientOldPhoneNumber === "") return next(new HttpError(400, "Le champ ancien numéro de téléphone est requis"));
        if (!regex.validPhoneNumber.test(clientOldPhoneNumber)) return next(new HttpError(400, "Le champ ancien numéro de téléphone ne respect pas les critères d'acceptation"));
        if (clientOldPhoneNumber.length > 12 || clientOldPhoneNumber.length < 10) return next(new HttpError(400, `Le champ ancien numéro de téléphone ne peux pas dépasser 10 caractères. Il y a ${clientOldPhoneNumber.length - 10} caractères de trop.`));

        const clientNewPhoneNumber = req.body.newPhoneNumber;
        if (!!clientNewPhoneNumber) {
            if (!regex.validPhoneNumber.test(clientNewPhoneNumber)) return next(new HttpError(400, "Le champ nouveau numéro de téléphone ne respect pas les critères d'acceptation"));
            if (clientNewPhoneNumber.length > 12 || clientNewPhoneNumber.length < 10) return next(new HttpError(400, `Le champ nouveau numéro de téléphone ne peux pas dépasser 10 caractères. Il y a ${clientNewPhoneNumber.length - 10} caractères de trop.`));
            if (clientNewPhoneNumber == clientOldPhoneNumber) return next(new HttpError(400, `L'ancien numéro de téléphone ainsi que le nouveau ne peuvent être identique ${clientOldPhoneNumber} et ${clientNewPhoneNumber}.`));
            treeFieldComboHasChanged = true;
            hasChanged = true;
        }

        // allergy
        const clientNewAllergy = req.body.newAllergy;
        if (!!clientNewAllergy) {
            if (clientNewAllergy.length > 255) return next(new HttpError(400, `Le champ texte des allergies ne peux pas dépasser 255 caractères. Il y a ${clientNewAllergy.length - 255} caractères de trop.`));
            hasChanged = true;
        }

        // isFavorite
        const clientNewIsFavorite = req.body.newIsFavorite;
        if (clientNewIsFavorite !== true && clientNewIsFavorite !== false && clientNewIsFavorite !== undefined) {
            return next(new HttpError(400, `Le champ 'est favoris' ne peux pas contenir ${clientNewIsFavorite}, il ne peut que contenir vrai ou faux.`));
        }

        // // isBlacklisted
        const clientNewIsBlacklisted = req.body.newIsBlacklisted;
        if (clientNewIsBlacklisted !== true && clientNewIsBlacklisted !== false && clientNewIsBlacklisted !== undefined) {
            return next(new HttpError(400, `Le champ 'est favoris' ne peux pas contenir ${clientNewIsBlacklisted}, il ne peut que contenir vrai ou faux.`));
        }

        // Get the clients for further validation
        const promise1 = clientQueries.getClientById(clientId);
        const promise2 = clientQueries.getClientByInformations(clientOldFirstName, clientOldLastName, clientOldPhoneNumber);

        // prepare fields for new combination search
        let promise3;
        if (treeFieldComboHasChanged) {
            const futureFirstName = (!!clientNewFirstName) ? clientNewFirstName : clientOldFirstName;
            const futureLastName = (!!clientNewLastName) ? clientNewLastName : clientOldLastName;
            const futurePhoneNumber = (!!clientNewPhoneNumber) ? clientNewPhoneNumber : clientOldPhoneNumber;
            promise3 = clientQueries.getClientByInformations(futureFirstName, futureLastName, futurePhoneNumber);
        }

        Promise.all([promise1, promise2, promise3])
            .then((result) => {
                const clientPromise1 = result[0] // client from promise1
                if (!clientPromise1) return next(new HttpError(400, `Le id ${clientId} ne correspond pas à aucun client.`))

                const clientPromise2 = result[1] // client from promise2
                if (!clientPromise2) return next(new HttpError(400, `Il n'y a aucun client avec la combinaison de prénom ; ${clientOldFirstName}, nom de famille ; ${clientOldLastName} et numéro de téléphone ; ${clientOldPhoneNumber}.`))

                const clientPromise3 = result[2] // client from promise3
                if (clientPromise3) return next(new HttpError(400, `Il y a déjà un client avec la combinaison de prénom ; ${clientNewFirstName}, nom de famille ; ${clientNewLastName} et numéro de téléphone ; ${clientNewPhoneNumber}.`))

                if (result[0].id != result[1].id || result[0].firstName != result[1].firstName || result[0].lastName != result[1].lastName || result[0].phoneNumber != result[1].phoneNumber) {
                    return next(new HttpError(400, `Le id ${clientId} ne correspond pas aux informations du client trouvé avec la combinaison des informations personnels ${clientOldFirstName}, ${clientOldLastName} et ${clientOldPhoneNumber}.`))
                }

                if ((clientNewIsFavorite === true || clientNewIsFavorite === false) && clientNewIsFavorite !== result[0].isFavorite) hasChanged = true;
                if ((clientNewIsBlacklisted === true || clientNewIsBlacklisted === false) && clientNewIsBlacklisted !== result[0].isBlacklisted) hasChanged = true;

                if (!hasChanged) return next(new HttpError(400, `Aucun changement n'a été reçu`));

                const clientMAJ = {
                    id: req.body.id,
                    firstName: req.body.newFirstName,
                    lastName: req.body.newLastName,
                    phoneNumber: req.body.newPhoneNumber,
                    allergy: req.body.newAllergy,
                    isFavorite: req.body.newIsFavorite,
                    isBlacklisted: req.body.newIsBlacklisted
                }

                clientQueries
                    .updateClient(clientMAJ)
                    .then((updatedClient) => {
                        if (updatedClient) {
                            res.json(updatedClient);
                        } else {
                            console.log("else's result : ", updatedClient);
                            return next(new HttpError(404, `Une erreur inconnue est survenue`));
                        }
                    })
                    .catch((err) => {
                        return next(err);
                    });
            })
            .catch((err) => {
                return next(err);
            });
    }
);

module.exports = router;