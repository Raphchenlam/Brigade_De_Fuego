const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const scheduleQueries = require('../queries/scheduleQueries');
const regex = require('../REGEX/REGEXbackend');

const HttpError = require("../HTTPError");

const { sendEmail } = require("../emailManagement");

router.get('/employee/:employeeNumber/:scheduleWeekId',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employee = req.user;
        const employeeNumberToGet = req.params.employeeNumber;
        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (employee.employeeNumber != employeeNumberToGet) return next(new HttpError(403, "Vous ne pouvez pas obtenir l'horaire d'un autre employé"));

        const scheduleWeekId = req.params.scheduleWeekId;
        if (!scheduleWeekId || scheduleWeekId == "") { return next(new HttpError(400, `Un scheduleWeekId doit etre fournis`)); }
        if (!regex.validWeekId.test(scheduleWeekId)) return next(new HttpError(400, "Le champ scheduleWeekId ne respect pas les critères d'acceptation ex: '2023-W39'"));

        scheduleQueries.selectEmployeeScheduleByWeekId(employeeNumberToGet, scheduleWeekId).then(result =>
        {
            let employeeSchedule = [];
            result.forEach(element =>
            {
                const schedule = {
                    id: element.id,
                    employeeNumber: element.employeeNumber,
                    date: element.date,
                    shiftName: element.shiftName,
                    startTime: element.startTime,
                    endTime: element.endTime,
                    time: element.time,
                    isPublished: element.isPublished
                }
                employeeSchedule.push(schedule);
            });

            res.json(employeeSchedule);
        }).catch(err =>
        {
            return next(err);
        });
    });

router.get('/periodinfo/:date/:shiftName',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employee = req.user;
        const date = req.params.date;
        const shiftName = req.params.shiftName;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!date) { return next(new HttpError(400, `Une date doit etre fournis`)); }
        if (!shiftName || shiftName == "") { return next(new HttpError(400, `Un shift name etre fournis`)); }

        scheduleQueries.selectSchedulePeriodInfoByDateAndShiftName(date, shiftName).then(result =>
        {
            if (result)
            {
                res.json(result);
            }
            else
            {
                res.status(206).json(`Aucun informations pour cette date`);
            }
        }).catch(err =>
        {
            return next(err);
        });
    });

router.get('/nextshift/:employeenumber',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employee = req.user;
        const employeeNumber = req.params.employeenumber;
        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (employee.employeeNumber != employeeNumber) return next(new HttpError(403, "Vous ne pouvez pas obtenir le prochain shift d'un autre employé"));
        if (!employeeNumber || employeeNumber == "") { return next(new HttpError(400, `Un numero d'employé doit etre fournis`)); }

        scheduleQueries.selectNextShiftForEmployee(employeeNumber).then(result =>
        {
            if (!result)
            {
                return res.status(200).send({
                    message: "Aucun prochain shift a l'horaire"
                })
            }

            res.json(result);
        }).catch(err =>
        {
            return next(err);
        });
    });

router.get("/:scheduleweekid",
    (req, res, next) =>
    {
        const scheduleWeekId = req.params.scheduleweekid;
        if (!scheduleWeekId || scheduleWeekId === "")
        {
            return next(new HttpError(400, "Le champ ScheduleWeekId est requis"));
        }
        if (!regex.validWeekId.test(scheduleWeekId)) return next(new HttpError(400, "Le champ scheduleWeekId ne respect pas les critères d'acceptation ex: '2023-W39'"));
        scheduleQueries
            .selectScheduleWeekInfoByID(scheduleWeekId)
            .then((scheduleWeek) =>
            {
                if (scheduleWeek)
                {
                    const isPublished = scheduleWeek.published;
                    scheduleQueries.selectAllSchedulePeriodsByScheduleWeekID(scheduleWeekId).then(allScheduledPeriod =>
                    {
                        allScheduledPeriod.push({ isPublished: isPublished });
                        res.json(allScheduledPeriod);
                    })

                } else
                {
                    const week = findAllDayOfAWeek(scheduleWeekId);
                    scheduleQueries.insertNewScheduleWeek(week).then(result =>
                    {
                        if (result)
                        {
                            res.json(result);
                        }
                        else
                        {
                            return next(new HttpError(400, "semaine non creer"));
                        }
                    })
                }
            })
            .catch((err) =>
            {
                return next(err);
            });
    }
);

router.get('/:scheduleweekid/employee',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));
        const scheduleWeekId = req.params.scheduleweekid;

        if (!scheduleWeekId || scheduleWeekId == "") { return next(new HttpError(400, `Un scheduleWeekId doit etre fournis`)); }
        if (!regex.validWeekId.test(scheduleWeekId)) return next(new HttpError(400, "Le champ scheduleWeekId ne respect pas les critères d'acceptation ex: '2023-W39'"));

        scheduleQueries.selectAllEmployeesScheduleByScheduleWeekId(scheduleWeekId).then(result =>
        {
            let employeeList = [];
            result.forEach(element =>
            {
                let found = employeeList.find(({ employeeNumber }) => employeeNumber == element.employeeNumber);

                if (!found)
                {
                    const employee = {
                        employeeNumber: element.employeeNumber,
                        name: element.name,
                        role: element.role,
                        skillPoints: element.skillPoints,
                        schedules: []
                    }
                    employeeList.push(employee);
                    found = employee;
                }
                const schedule = {
                    id: element.id,
                    date: element.date,
                    shiftName: element.shiftName,
                    startTime: element.startTime,
                    endTime: element.endTime,
                    time: element.time
                }
                found.schedules.push(schedule);
            });

            res.json(employeeList);
        }).catch(err =>
        {
            return next(err);
        });
    });


router.get('/:scheduleweekid/event',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));
        const scheduleWeekId = req.params.scheduleweekid;

        if (!scheduleWeekId || scheduleWeekId == "") { return next(new HttpError(400, `Un scheduleWeekId doit etre fournis`)); }
        if (!regex.validWeekId.test(scheduleWeekId)) return next(new HttpError(400, "Le champ scheduleWeekId ne respect pas les critères d'acceptation ex: '2023-W39'"));

        scheduleQueries.selectAllEventScheduleByWeekId(scheduleWeekId).then(result =>
        {
            let eventList = [];
            result.forEach(element =>
            {
                eventList.push(element)
            });

            res.json(eventList);
        }).catch(err =>
        {
            return next(err);
        });
    });

router.get('/:date/:shift',
    // passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employee = req.user;

        // if (!employee) return next(new HttpError(401, "Connexion requise"));
        // if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));
        const date = req.params.date;
        const shift = req.params.shift;

        if (!date || date == "" || !shift || shift == "") { return next(new HttpError(400, `Une date et shift doit etre fournis`)); }

        scheduleQueries.selectAllWaitersForOperationByDateAndShift(date, shift).then(result =>
        {
            employeeList = [];
            result.forEach(element =>
            {
                const schedule = {
                    waiterNumber: element.waiterNumber,
                    waiterName: element.waiterName,
                    waiterColor: element.waiterColor,
                    date: element.date,
                    shift: element.shift,
                    shiftTime: element.shiftTime
                }
                employeeList.push(schedule);
            });

            res.json(employeeList);
        }).catch(err =>
        {
            return next(err);
        });
    });

router.put("/",
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const isPublished = req.body.isPublished;
        const isModified = req.body.isModified;
        const weekInformationsList = req.body.weekInformations;
        const employee = req.user;
        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));
        let body = req.body;
        const scheduleWeekId = body.scheduleWeekId;
        if (!scheduleWeekId || scheduleWeekId == "") return next(new HttpError(400, `Un scheduleWeekId doit etre fournis`));
        if (!regex.validWeekId.test(scheduleWeekId)) return next(new HttpError(400, "Le champ scheduleWeekId ne respect pas les critères d'acceptation ex: '2023-W39'"));
        if (!body.weekInformations) return next(new HttpError(400, `Des weekInformations doivent etre fournis`));
        if (body.weekInformations.length != 14) return next(new HttpError(400, `weekInformation est invalide`));
        if (!body.scheduledEmployees) return next(new HttpError(400, `Un array d'employés est manquant`));
        let scheduledEmployees = body.scheduledEmployees;

        let eventList = []
        weekInformationsList.forEach(element =>
        {
            if (element.events.length > 0)
            {
                const newEvent = {
                    idSchedulePeriod: element.id,
                    events: element.events
                }
                eventList.push(newEvent);
            }
        })
        scheduleQueries.selectAllSchedulePeriodsByScheduleWeekID(scheduleWeekId).then(result =>
        {
            let periodIdList = [];
            result.forEach(element =>
            {
                periodIdList.push(element.id)
            });
            if (periodIdList.length != 14) return next(new HttpError(400, `Erreur dans les Schedule Periods obtenues. Nous en avons obtenus ${periodIdList.length} `));
            const lowest = Math.min(...periodIdList);
            const highest = Math.max(...periodIdList);
            
            if (lowest != body.weekInformations[0].id) return next(new HttpError(400, `Erreur dans les Schedule Periods obtenues. Elle ne correspondent pas a la semaine dans la demande`));
            if (highest != body.weekInformations[13].id) return next(new HttpError(400, `Erreur dans les Schedule Periods obtenues. Elle ne correspondent pas a la semaine dans la demande`));

            scheduleQueries.deleteEmployeeFromSchedule(periodIdList).then(() =>
            {
                const scheduledEmployeeList = req.body.scheduledEmployees;
                {
                    scheduleQueries.insertNewEmployeeSchedule(scheduledEmployeeList).then((employeeList) =>
                    {
                        scheduleQueries.updateSchedulePeriodsInformations(weekInformationsList).then(() =>
                        {
                            scheduleQueries.updateScheduleWeekStatus(scheduleWeekId, isPublished).then(() =>
                            {
                                scheduleQueries.updateEventForScheduleWeek(periodIdList, eventList).then(() =>
                                {
                                    let employeeList = [];
                                    scheduledEmployees.forEach(element =>
                                    {
                                        let found = employeeList.find(({ employeeNumber }) => employeeNumber == element.employeeNumber);

                                        if (!found)
                                        {
                                            employeeList.push(element.employeeNumber);
                                        }
                                    });
                                    let mondayDate = new Date(req.body.weekMonday)
                                    let mondayString = mondayDate.getDate() + " " + mondayDate.toLocaleString('fr-FR', { month: 'long' }) + " " + mondayDate.getFullYear();
                                    let sundayDate = new Date(req.body.weekSunday)
                                    let sundayString = sundayDate.getDate() + " " + sundayDate.toLocaleString('fr-FR', { month: 'long' }) + " " + sundayDate.getFullYear();
                                    let dateString = mondayString + " au " + sundayString;
                                    if (isPublished)
                                    {
                                        //envoie des emails avant le retour au front end
                                        const emailPromises = employeeList.map(async (element) =>
                                        {
                                            const result = await scheduleQueries.selectEmailFromEmployeeNumber(element);
                                            return result.email;
                                        });
                                        Promise.all(emailPromises)
                                            .then((emailList) =>
                                            {
                                                let emailDone = sendEmailSchedule(emailList, isModified, dateString);
                                                if (emailDone) { res.status(200).json("Mise a jour reussi") };
                                            })
                                            .catch((error) =>
                                            {
                                                console.error("Erreur lors de la récupération des e-mails :", error);
                                            });
                                    } else
                                    {
                                        res.status(200).json("Mise a jour reussi")
                                    }

                                }).catch(err =>
                                {
                                    return next(err);
                                });
                            }).catch(err =>
                            {
                                return next(err);

                            })
                        }).catch(err =>
                        {
                            return next(err);
                        });
                    }).catch(err =>
                    {
                        return next(err);
                    })
                }
            }).catch(err =>
            {
                return next(err);
            });
        }).catch(err =>
        {
            return next(err);
        })
    }
);

function sendEmailSchedule(emailList, isModified, date)
{
    const recipients = emailList;
    let subject = "Nouvel horaire disponible";
    const text = "";
    let html = `
        <h1>Nouvel horaire</h1>
        <p>Bonjour,</p>
        <p>Un nouvel horaire a été publié pour la semaine du ` + date + `.</p>
        <p>Veuillez vous connecter à l'application afin d'y avoir accès.</p>`
    if (isModified)
    {
        subject = "Horaire mis a jour";
        html = `
        <h1>Horaire mis à jour</h1>
        <p>Bonjour,</p>
        <p>L'horaire pour la semaine du ` + date + ` vient d'être mis à jour.</p>
        <p>Veuillez vous connecter à l'application afin d'y avoir accès.</p>`
    }
    sendEmail(recipients, subject, text, html);
    console.log("emails envoyes")
    return true
};

function findAllDayOfAWeek(yearWeek)
{
    const splittedYearWeek = {
        year: parseInt(yearWeek.split('-').slice(0)[0]),
        week: parseInt(yearWeek.split('W').slice(0)[1])
    };
    const monday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 6);
    const tuesday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 5);
    const wednesday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 4);
    const thursday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 3);
    const friday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 2);
    const saturday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 1);
    const sunday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7));
    while (sunday.getDay() !== 0)
    {
        sunday.setDate(sunday.getDate() - 1);
        monday.setDate(sunday.getDate() - 6);
        tuesday.setDate(sunday.getDate() - 5);
        wednesday.setDate(sunday.getDate() - 4);
        thursday.setDate(sunday.getDate() - 3);
        friday.setDate(sunday.getDate() - 2);
        saturday.setDate(sunday.getDate() - 1);
    }
    return {
        weekId: yearWeek,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday
    }
}

module.exports = router;