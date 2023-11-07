const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const clientQueries = require('../queries/clientQueries');
const tableQueries = require("../queries/tableQueries");
const regex = require('../../REGEX/REGEXbackend');
const dATObj = require('../../REGEX/dateAndTimeObjectifier');

const HttpError = require("../HTTPError");

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

router.put('/:id/status/:statusCode', (req, res, next) => {
    const user = req.user;

    // if (!user || !user.isAdmin) {
    //   return next(new HttpError(403, "Droit administrateur requis"));
    // }

    const id = req.params.id;
    if (!id || id === '') {
        return next(new HttpError(400, 'Le paramètre ID est requis'));
    }
    const statusCode = req.params.statusCode;
    if (!statusCode || statusCode === '') {
        return next(new HttpError(400, 'Le code du statut est requis'));
    }
    reservationQueries.updateReservationStatusById(id, statusCode).then(result => {
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

        reservationQueries.getReservationById(req.body.id)
            .then((oldReservation) => {
                var newReservationInfos = { id: req.body.id }

                if (oldReservation) {
                    if (!!req.body.clientId && req.body.clientId != oldReservation.clientId) {
                        return next(new HttpError(400, `Une réservation ne peux pas changer de client ( id reçu ${req.body.clientId}, id de la base de données ${oldReservation.clientId})`))
                    }

                    if (!!req.body.takenBy && req.body.takenBy != oldReservation.takenBy) {
                        return next(new HttpError(400, `Une réservation ne peux pas changer le code bar de l'employé responsable.`))
                    }

                    if (!!req.body.date) {
                        const date = req.body.date;
                        if (date == "") return next(new HttpError(400, "Le champ date est requis"));
                        if (!regex.validDate.test(date)) return next(new HttpError(400, "Le champ date ne respect pas les critères d'acceptation ex: '2023-09-11'"));
                        if (dATObj.isBeforeToday(date)) return next(new HttpError(400, "La date de la réservation ne peux indiquer une date antérieur à aujourd'hui"));
                    }

                    if (!!req.body.startTime) {
                        const startTime = req.body.startTime;
                        if (startTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
                        if (!regex.validTime.test(startTime)) return next(new HttpError(400, "Le champ start_time ne respect pas les critères d'acceptation ex: '18:00:00'"));

                        const startTimeObj = dATObj.toLocale(startTime);
                        if (startTimeObj.hours < 11 || startTimeObj.hours > 23) return next(new HttpError(400, "Le champ heure de début doit être entre 11h00 am et 23h00 pm"));
                    }

                    if (!!req.body.endTime) {
                        const endTime = req.body.endTime;
                        if (endTime == "") return next(new HttpError(400, "Le champ heure de début est requis"));
                        if (!regex.validTime.test(endTime)) return next(new HttpError(400, "Le champ end_time ne respect pas les critères d'acceptation ex: '18:00:00', minuit s'écrit 00:00:00"));

                        const endTimeObj = dATObj.toLocale(endTime);
                        if (endTimeObj.hours < 11) return next(new HttpError(400, "Le champ heure de fin ne peux pas être avant 11:00:00 ou dépassé 23:59:00"));

                        const startTimeString = (!!req.body.startTime) ? req.body.startTime : oldReservation.startTime;
                        const startTimeObject = dATObj.toLocale(startTimeString);
                        const totalReservationTime = ((endTimeObj.hours * 60 + endTimeObj.minutes) - (startTimeObject.hours * 60 + startTimeObject.minutes)) / 60;

                        if (endTimeObj.hours < startTimeObject.hours) {
                            return next(new HttpError(400, "L'heure de fin ne peux être antérieurs à l'heure de début."));
                        } else if (endTimeObj.hours == startTimeObject.hours && endTimeObj.minutes <= startTimeObject.minutes) {
                            return next(new HttpError(400, "L'heure de fin ne peux être antérieurs à l'heure de début."));
                        } else if (totalReservationTime > 3) {
                            const totalReservationTimeString = parseInt(totalReservationTime) + "h" + parseInt((totalReservationTime - parseInt(totalReservationTime)) * 60) + "m";
                            return next(new HttpError(400, `La durée total de la réservation (${totalReservationTimeString}) ne peux excédé 3 heures.`));
                        }
                    }

                    if (!!req.body.statusCode && req.body.statusCode != oldReservation.statusCode) {
                        if (req.body.statusCode < 1 || req.body.statusCode > 8) {
                            return next(new HttpError(400, `Le code de status de la réservation doit être entre 1 et 8, code reçu ${req.body.statusCode}.`));
                        }
                    }

                    if ((!!req.body.mention || req.body.mention == '') && req.body.mention != oldReservation.mention && req.body.mention.length > 255) {
                        return next(new HttpError(400, `Le champ "mention" ne peux contenir plus de 255 caractères. Vous en avez ${req.body.mention.length},  c'est-à-dire *${req.body.mention.length - 255}* de trop.`));
                    }

                    if (req.body.hasMinor !== undefined && req.body.hasMinor !== false && req.body.hasMinor !== true) {
                        return next(new HttpError(400, `Le champ "Mineur sur place" ne peux pas être ''${req.body.hasMinor}''.`));
                    }

                    if (!!req.body.peopleCount && req.body.peopleCount < 1 || req.body.peopleCount > 12) {
                        return next(new HttpError(400, `Le nombre de personnes reçu ( ${req.body.peopleCount} ) n'est pas entre 1 et 12.`));
                    }

                    newReservationInfos = {
                        ...newReservationInfos,
                        clientId: oldReservation.clientId,
                        takenBy: oldReservation.takenBy,
                        date: req.body.date,
                        startTime: req.body.startTime,
                        endTime: req.body.endTime,
                        statusCode: req.body.statusCode,
                        mention: req.body.mention,
                        hasMinor: req.body.hasMinor
                    }

                    let reservationNewDateAndTimeAvailableForClient;
                    if (!!req.body.date || !!req.body.startTime) {
                        const date = (!!req.body.date) ? req.body.date : oldReservation.date;
                        const startTime = (!!req.body.startTime) ? req.body.startTime : oldReservation.startTime;

                        reservationNewDateAndTimeAvailableForClient = reservationQueries.getReservationByInformations(oldReservation.clientId, date, startTime);
                    }

                    let tableCapcityVerificationQuery;
                    if ((!!req.body.tableNumber || !!req.body.peopleCount) && req.body.tableNumber !== null) {
                        tableCapcityVerificationQuery = tableQueries.getTableByNumber(req.body.tableNumber)
                    } else {
                        newReservationInfos = {
                            ...newReservationInfos,
                            tableNumber: null,
                            peopleCount: req.body.peopleCount
                        }
                    }

                    // Idéalement j'aurais attendus toutes le résultat de toutes les requêtes avec le Promise.all mais par manque de temps j'ai décidé de le laisser comme tel, j'ai compris le Promise.all après avoir initialement créé cette méthode et sont ajout à été fait par après
                    Promise.all([reservationNewDateAndTimeAvailableForClient, tableCapcityVerificationQuery])
                        .then((result) => {
                            const reservation = result[0];

                            
                            // TODO : Needs to permit changing the time in the same shift for the same reservation
                            if (reservation) {
                                if(oldReservation.id != newReservationInfos.id && newReservationInfos.id != reservation.id && oldReservation.id != reservation.id){
                                        return next(new HttpError(409, `Une réservation du client ${reservation.clientFirstname} ${reservation.clientLastname}, le ${reservation.date} a ${reservation.startTime} existe déjà`))                                        
                                    }
                            }

                            const table = result[1];
                            if (table && table.isActive) {
                                if (table.capacity < req.body.peopleCount) return next(new HttpError(400, `La table #${req.body.tableNumber} ne peux acceuillir ${req.body.peopleCount} personnes.`));

                                newReservationInfos = {
                                    ...newReservationInfos,
                                    tableNumber: req.body.tableNumber,
                                    peopleCount: req.body.peopleCount
                                }

                            } else if(!!table){
                                return next(new HttpError(400, `La table ${req.body.tableNumber} est introuvable ou inactive.`));
                            }

                            reservationQueries.updateReservation(newReservationInfos)
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

                        })
                        .catch((err) => {
                            return next(err);
                        });
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