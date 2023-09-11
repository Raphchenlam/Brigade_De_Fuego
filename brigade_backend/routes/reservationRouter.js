const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const clientQueries = require('../queries/clientQueries');

const HttpError = require("../HttpError");

router.get("/:id",
    (req, res, next) => {
        const id = req.params.id;

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
        if (!clientId || clientId === "") {
            return next(new HttpError(400, "Le champ Id du client est requis"));
        }

        clientQueries.getClientById().then(clientExists => {
            if (!clientExists) {
                return next(new HttpError(404, `Le client ${clientId} n'existe pas dans la base de données`));
            }
        })

        const date = req.body.date;
        if (!date || date == "") {
            return next(new HttpError(400, "Le champ date est requis"));
        }

        const startTime = req.body.startTime;
        if (!startTime || startTime == "") {
            return next(new HttpError(400, "Le champ heure de début est requis"));
        }
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
                    return next(new HttpError(409, `Une réservation de ${reservation.client_id}, le ${reservation.date} a ${reservation.start_time} existe déjà`))
                }
            })
            .catch((err) => {
                return next(err);
            });


    }
);

module.exports = router;