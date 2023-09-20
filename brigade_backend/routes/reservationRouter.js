const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const clientQueries = require('../queries/clientQueries');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

function isDateBeforeToday(dateString) {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const givenDate = new Date(Date.UTC(year, month, day));

    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    return givenDate < currentDate;
}

router.get("/",
    (req, res, next) => {

        reservationQueries
            .getReservationListByDates()
            .then((reservationList) => {
                if (reservationList) {
                    res.json(reservationList);
                } else {
                    return next(new HttpError(404, `Les réservations ${startDate} et ${endDate} sont introuvables`));
                }
            })
            .catch((err) => {
                return next(err);
            });
    }
);

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

router.get("/:startDate/:endDate",
    (req, res, next) => {
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;

        reservationQueries
            .getReservationListByDates(startDate, endDate)
            .then((reservationList) => {
                if (reservationList) {
                    res.json(reservationList);
                } else {
                    return next(new HttpError(404, `Les réservations ${startDate} et ${endDate} sont introuvables`));
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
        if (!clientId || clientId === "") return next(new HttpError(400, "Le champ Id du client est requis"));
        clientQueries.getClientById(clientId).then(clientExists => (!clientExists) ? next(new HttpError(404, `Le client ${clientId} n'existe pas dans la base de données`)) : false)

        const date = req.body.date;
        if (!date || date == "") return next(new HttpError(400, "Le champ date est requis"));
        console.log(date);
        if (!regex.validDate.test(date)) return next(new HttpError(400, "Le champ date ne respect pas les critères d'acceptation ex: '2023-09-11'"));
        if (isDateBeforeToday(date)) return next(new HttpError(400, "La date de la réservation ne peux indiquer une date antérieur à aujourd'hui"));

        const startTime = req.body.startTime;
        if (!startTime || startTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
        if (!regex.validTime.test(startTime)) return next(new HttpError(400, "Le champ start_time ne respect pas les critères d'acceptation ex: '18:00:00'"));
        const explodedStartTime = reservationQueries.explodingTime(startTime);
        if (explodedStartTime.hour < 11 || explodedStartTime.hour > 23) return next(new HttpError(400, "Le champ heure de début doit être entre 11h00 am et 23h00 pm"));

        const endTime = req.body.endTime;
        if (!endTime || endTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
        if (!regex.validTime.test(endTime)) return next(new HttpError(400, "Le champ start_time ne respect pas les critères d'acceptation ex: '18:00:00', minuit s'écrit 00:00:00"));
        const explodedEndTime = reservationQueries.explodingTime(endTime);
        if (explodedEndTime.hour < 11) return next(new HttpError(400, "Le champ heure de fin ne peux pas être avant 11:00:00 ou dépassé 23:59:00"));

        const peopleCount = req.body.peopleCount;
        if (!peopleCount || peopleCount == "") return next(new HttpError(400, "Le champ peopleCount est requis"));
        if (peopleCount < 1 || peopleCount > 30) return next(new HttpError(400, "La quantité de personne de la réservation doit être entre 1 et 30."));

        const mention = req.body.mention;
        if (mention) if (mention.length > 255) return next(new HttpError(400, `Le champ mention ne peux pas dépasser 255 caractères. Il y a ${mention.length - 255} caractères de trop.`));

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