const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const clientQueries = require('../queries/clientQueries');

const HttpError = require("../HttpError");

router.get("/:id",
    (req, res, next) => {
        const id = req.params.id;
        if (!id || id === "") {
            return next(new HttpError(400, "Le champ Id du client est requis"));
        }
        
        reservationQueries
            .getReservationById(id)
            .then((reservation) => {
                if (reservation) {
                    res.json(reservation);
                } else {
                    return next(new HttpError(404, `La réservation ${id} est introuvable`));
                }
            })
            .catch((err) => {
                return next(err);
            });
    }
);

router.post("/",
    (req, res, next) => {
        const clientId = req.body.clientId;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const explodedStartTime = reservationQueries.explodingTime(startTime);
        const mention = req.body.mention;
        const peopleCount = req.body.peopleCount;

        if (!clientId || clientId === "") return next(new HttpError(400, "Le champ Id du client est requis"));
        clientQueries.getClientById(clientId).then(clientExists => (!clientExists) ? next(new HttpError(404, `Le client ${clientId} n'existe pas dans la base de données`)): false)
        if (!date || date == "") return next(new HttpError(400, "Le champ date est requis"));
        if (!startTime || startTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
        if (explodedStartTime.hour < 11 || explodedStartTime.hour > 23) return next(new HttpError(400, "Le champ heure de début doit être entre 11h00 am et 23h00 pm"));
        if (mention.length > 255) return next(new HttpError(400, `Le champ mention ne peux pas dépasser 255 caractères. Il y a ${mention.length - 255} caractères de trop.`));
        if (!peopleCount || peopleCount == "") return next(new HttpError(400, "Le champ peopleCount est requis"));
        if (peopleCount < 1 || peopleCount > 30) return next(new HttpError(400, "La quantité de personne de la réservation doit être entre 1 et 30."));

        const newReservation = {
            tableNumber: req.body.tableNumber,
            clientId: req.body.clientId,
            statusCode: req.body.statusCode,
            peopleCount: req.body.peopleCount,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            mention: req.body.mention,
            hasMinor: req.body.hasMinor,
            takenBy: req.body.takenBy
        };

        reservationQueries
            .getReservationByInformations(clientId, date, startTime)
            .then((reservation) => {
                if (!reservation) {
                    reservationQueries.insertReservation(newReservation)
                        .then((latestReservation) => {
                            if (latestReservation) {
                                res.json(latestReservation);
                            } else {
                                return next(new HttpError(404, `La réservation ${id} n'a pas été sauvegarder`));
                            }
                        })
                        .catch((err) => {
                            return next(err);
                        });
                } else {
                    return next(new HttpError(409, `Une réservation du client ${reservation.first_name} ${reservation.last_name}, le ${reservation.date} a ${reservation.start_time} existe déjà`))
                }
            })
            .catch((err) => {
                return next(err);
            });


    }
);

module.exports = router;