const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const clientQueries = require('../queries/clientQueries');
const tableQueries = require("../queries/tableQueries");
const regex = require('../../REGEX/REGEX_backend');
const dATObj = require('../../REGEX/dateAndTimeObjectifier');

const HttpError = require("../HttpError");

// Functions
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




// Routes
router.get("/statusList",
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {

        reservationQueries
            .getReservationStatusList()
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

router.get("/",
    passport.authenticate('basic', { session: false }),
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

router.get("/expectedpeople/:date/:shiftName",
    (req, res, next) => {
        const date = req.params.date;
        const shiftName = req.params.shiftName;
        reservationQueries.getExpectedPeopleByDateAndShiftName(date, shiftName).then((peopleCount) => {
            res.json(peopleCount);
        })
            .catch((err) => {
                return next(err);
            });
    }
);

router.get("/:id",
    passport.authenticate('basic', { session: false }),
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
    passport.authenticate('basic', { session: false }),
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
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const clientId = req.body.clientId;
        if (!clientId || clientId === "") return next(new HttpError(400, "Le champ Id du client est requis"));
        clientQueries.getClientById(clientId).then(clientExists => (!clientExists) ? next(new HttpError(404, `Le client ${clientId} n'existe pas dans la base de données`)) : false)

        const date = req.body.date;
        if (!date || date == "") return next(new HttpError(400, "Le champ date est requis"));
        if (!regex.validDate.test(date)) return next(new HttpError(400, "Le champ date ne respect pas les critères d'acceptation ex: '2023-09-11'"));
        if (dATObj.isBeforeToday(date)) return next(new HttpError(400, "La date de la réservation ne peux indiquer une date antérieur à aujourd'hui"));

        const startTime = req.body.startTime;
        if (!startTime || startTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
        if (!regex.validTime.test(startTime)) return next(new HttpError(400, "Le champ start_time ne respect pas les critères d'acceptation ex: '18:00:00'"));
        const startTimeObj = dATObj.toLocale(startTime);
        if (startTimeObj.hours < 11 || startTimeObj.hours > 23) return next(new HttpError(400, "Le champ heure de début doit être entre 11h00 am et 23h00 pm"));

        const endTime = req.body.endTime;
        if (!endTime || endTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
        if (!regex.validTime.test(endTime)) return next(new HttpError(400, "Le champ start_time ne respect pas les critères d'acceptation ex: '18:00:00', minuit s'écrit 00:00:00"));
        const EndTimeObj = dATObj.toLocale(endTime);
        if (EndTimeObj.hours < 11) return next(new HttpError(400, "Le champ heure de fin ne peux pas être avant 11:00:00 ou dépassé 23:59:00"));

        const peopleCount = req.body.peopleCount;
        if (!peopleCount || peopleCount == "") return next(new HttpError(400, "Le champ peopleCount est requis"));
        if (peopleCount < 1 || peopleCount > 12) return next(new HttpError(400, "La quantité de personne de la réservation doit être entre 1 et 12."));

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
                    return next(new HttpError(409, `Une réservation du client ${reservation.clientFirstname} ${reservation.clientLastname}, le ${reservation.date} a ${reservation.startTime} existe déjà`))
                }
            })
            .catch((err) => {
                return next(err);
            });


    }
);

router.put('/:id/table/:tableNumber', (req, res, next) => {
    const user = req.user;

    // if (!user || !user.isAdmin) {
    //   return next(new HttpError(403, "Droit administrateur requis"));
    // }

    const id = req.params.id;
    if (!id || id === '') {
        return next(new HttpError(400, 'Le paramètre ID est requis'));
    }
    const tableNumber = req.params.tableNumber;
    if (!tableNumber || tableNumber === '') {
        return next(new HttpError(400, 'Le numéro de table est requis'));
    }

    reservationQueries.updateTableOnReservationById(id, tableNumber).then(result => {
        if (!result) {
            return next(new HttpError(404, `La réservation est introuvable`));
        }
        res.json(result);
    }).catch(err => {
        return next(err);
    })
});

router.put("/",
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        console.log("****************************************************************")
        reservationQueries.getReservationById(req.body.id)
            .then((oldReservation) => {
                var newReservationInfos = { id: req.body.id }

                if (oldReservation) {
                    if (!!req.body.clientId && req.body.clientId != oldReservation.clientId) {
                        return next(new HttpError(400, `Une réservation ne peux pas changer de client ( id reçu ${req.body.clientId}, id de la base de données ${oldReservation.clientId})`))
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            clientId: oldReservation.clientId
                        }
                    }

                    if (!!req.body.takenBy && req.body.takenBy != oldReservation.takenBy) {
                        return next(new HttpError(400, `Une réservation ne peux pas le code bar de l'employé responsable.`))
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            takenBy: oldReservation.takenBy
                        }
                    }

                    if (!!req.body.date) {
                        const date = req.body.date;
                        if (!date || date == "") return next(new HttpError(400, "Le champ date est requis"));
                        if (!regex.validDate.test(date)) return next(new HttpError(400, "Le champ date ne respect pas les critères d'acceptation ex: '2023-09-11'"));
                        if (dATObj.isBeforeToday(date)) return next(new HttpError(400, "La date de la réservation ne peux indiquer une date antérieur à aujourd'hui"));

                        newReservationInfos = {
                            ...newReservationInfos,
                            date: req.body.date
                        }
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            date: undefined
                        }
                    }

                    if (!!req.body.startTime) {
                        const startTime = req.body.startTime;
                        if (!startTime || startTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
                        if (!regex.validTime.test(startTime)) return next(new HttpError(400, "Le champ start_time ne respect pas les critères d'acceptation ex: '18:00:00'"));
                        const startTimeObj = dATObj.toLocale(startTime);
                        if (startTimeObj.hours < 11 || startTimeObj.hours > 23) return next(new HttpError(400, "Le champ heure de début doit être entre 11h00 am et 23h00 pm"));

                        newReservationInfos = {
                            ...newReservationInfos,
                            startTime: req.body.startTime
                        }
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            startTime: undefined
                        }
                    }

                    if (!!req.body.endTime) {
                        const endTime = req.body.endTime;
                        if (!endTime || endTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
                        if (!regex.validTime.test(endTime)) return next(new HttpError(400, "Le champ start_time ne respect pas les critères d'acceptation ex: '18:00:00', minuit s'écrit 00:00:00"));
                        const EndTimeObj = dATObj.toLocale(endTime);
                        if (EndTimeObj.hours < 11) return next(new HttpError(400, "Le champ heure de fin ne peux pas être avant 11:00:00 ou dépassé 23:59:00"));

                        newReservationInfos = {
                            ...newReservationInfos,
                            endTime: req.body.endTime
                        }
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            endTime: undefined
                        }
                    }










                    if (!!req.body.statusCode && req.body.statusCode != oldReservation.statusCode) {
                        if (req.body.statusCode < 1 || req.body.statusCode > 8) {
                            return next(new HttpError(400, `Le code de status de la réservation doit être entre 1 et 8, code reçu ${req.body.statusCode}.`));
                        } else {
                            newReservationInfos = {
                                ...newReservationInfos,
                                statusCode: req.body.statusCode
                            }
                        }
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            statusCode: undefined
                        }
                    }

                    if (!!req.body.mention && req.body.mention != oldReservation.mention) {
                        if (req.body.mention.length > 255) {
                            return next(new HttpError(400, `Le champ "mention" ne peux contenir plus de 255 caractères. Vous en avez ${req.body.mention.length},  c'est-à-dire *${req.body.mention.length - 255}* de trop.`));
                        } else {
                            newReservationInfos = {
                                ...newReservationInfos,
                                mention: req.body.mention
                            }
                        }
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            mention: undefined
                        }
                    }

                    if (req.body.hasMinor !== undefined && req.body.hasMinor !== false && req.body.hasMinor !== true) {
                        return next(new HttpError(400, `Le champ "Mineur sur place" ne peux pas être ''${req.body.hasMinor}''.`));
                    } else {
                        if (req.body.hasMinor === true || req.body.hasMinor === false) {
                            newReservationInfos = {
                                ...newReservationInfos,
                                hasMinor: req.body.hasMinor
                            }
                        } else {
                            newReservationInfos = {
                                ...newReservationInfos,
                                hasMinor: undefined
                            }
                        }
                    }

                    if (!!req.body.tableNumber || !!req.body.peopleCount) {
                        if (req.body.tableNumber != oldReservation.tableNumber || req.body.peopleCount != oldReservation.peopleCount) {
                            const tableNumber = req.body.tableNumber;
                            const peopleCount = req.body.peopleCount;

                            console.log("req.body : ");
                            console.log(req.body);
                            console.log("req.body.tableNumber : ");
                            console.log(req.body.tableNumber);

                            tableQueries.getTableByNumber(tableNumber)
                                .then((table) => {
                                    if (table && table.isActive) {
                                        if (table.capacity < peopleCount) return next(new HttpError(400, `La table #${tableNumber} ne peux acceuillir ${peopleCount} personnes.`));

                                        newReservationInfos = {
                                            ...newReservationInfos,
                                            tableNumber: req.body.tableNumber,
                                            peopleCount: req.body.peopleCount
                                        }


                                        console.log("newReservationInfos : ");
                                        console.log(newReservationInfos);


                                        reservationQueries
                                            .updateReservation(newReservationInfos)
                                            .then((updatedReservation) => {
                                                if (updatedReservation) {
                                                    res.json(updatedReservation);
                                                } else {
                                                    return next(new HttpError(404, `La mise à jours de la réservation ${newReservationInfos.id} à échoué pour une raison inconnue.`));
                                                }
                                            })
                                            .catch((err) => {
                                                return next(err);
                                            });
                                    } else {
                                        return next(new HttpError(400, `La table ${tableNumber} est introuvable ou inactive.`));
                                    }
                                })
                                .catch((err) => {
                                    return next(err);
                                });

                        }
                    } else {
                        console.log("Inside the else of peopleCount and Table");

                        newReservationInfos = {
                            ...newReservationInfos,
                            tableNumber: undefined,
                            peopleCount: undefined
                        }

                        console.log("newReservationInfos : ");
                        console.log(newReservationInfos);

                        reservationQueries
                            .updateReservation(newReservationInfos)
                            .then((updatedReservation) => {
                                console.log("updatedReservation : ");
                                console.log(updatedReservation);
                                if (updatedReservation) {
                                    res.json(updatedReservation);
                                } else {
                                    return next(new HttpError(404, `La mise à jours de la réservation ${newReservationInfos.id} à échoué pour une raison inconnue.`));
                                }
                            })
                            .catch((err) => {
                                return next(err);
                            });
                    }

                } else {
                    return next(new HttpError(404, `La réservation ${newReservationInfos.id} n'existe pas dans notre base de données.`));
                }
            })
            .catch((err) => {
                return next(err);
            });
    }
);

module.exports = router;