const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const HttpError = require("../HttpError");


router.get("/", 
    (req, res, next) => {
        const clientId = req.body.clientId;
        if (!clientId || clientId === "") {
            return next(new HttpError(400, "Le champ Id du client est requis"));
        }

        const date = req.body.date;
        if (!date || date == "") {
            return next(new HttpError(400, "Le champ date est requis"));
        }

        const startTime = req.body.startTime;
        if (!startTime || startTime == "") {
            return next(new HttpError(400, "Le champ heure de début est requis"));
        }

        reservationQueries
        .getReservationByInformations(clientId, date, startTime)
        .then((reservation) => {
            if(reservation){
                res.json(reservation);
            }else{
                return next(new HttpError(404, `La réservation ${id} est introuvable`));
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

        reservationQueries
        .getReservationById(id)
        .then((reservation) => {
            if(reservation){
                res.json(reservation);
            }else{
                return next(new HttpError(404, `La réservation ${id} est introuvable`));
            }
        })
        .catch((err) => {
            return next(err);
        });
    }
);  

module.exports = router;