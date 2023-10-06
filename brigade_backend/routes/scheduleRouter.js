const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const scheduleQueries = require('../queries/scheduleQueries');
const regex = require('../../REGEX/REGEX_backend');

const HttpError = require("../HttpError");

const { envoyerEmail } = require("../emailManagement");


router.post('/sendemailtest',
    (req, res, next) =>
    {
        const destinataires = ["m.marchand22@hotmail.com"];
        const sujet = "Nouvel horaire disponible";
        const texte = "Bonjour Maxime, un nouvel horaire a été publier pour le Restaurant Del Fuego. Vous pouvez la consulter en vous connectant sur l'application";

        envoyerEmail(destinataires, sujet, texte);
        console.log("test")
        res.json("test")
    });


router.get('/employee/:employeeNumber/:scheduleWeekId',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        console.log("params", req.params);
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


router.get("/:scheduleweekid",
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

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
                    console.log("isPublished", isPublished);
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
                            console.log("result", result)
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


router.put("/",
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const isPublished = req.body.isPublished;
        const isModified = req.body.isModified;
        const savingMode = req.body.savingMode;
        console.log("isPublished", isPublished)
        console.log("isModified", isModified)
        console.log("savingMode", savingMode)
        // Rergarder si je recois un TRUE dans la valeur de Published et aussi TRUE dans Modified... SI oui, changer dans le BD et aussi envoyer le courriel a toute
        // les employés sur l'horaire


        const employee = req.user;

        if (!employee) return next(new HttpError(401, "Connexion requise"));
        if (!employee.isAdmin) return next(new HttpError(403, "Droit administrateur requis"));

        let body = req.body;
        console.log("body", body)

        const scheduleWeekId = body.scheduleWeekId;
        if (!scheduleWeekId || scheduleWeekId == "") return next(new HttpError(400, `Un scheduleWeekId doit etre fournis`));
        if (!regex.validWeekId.test(scheduleWeekId)) return next(new HttpError(400, "Le champ scheduleWeekId ne respect pas les critères d'acceptation ex: '2023-W39'"));
        if (!body.weekInformations) return next(new HttpError(400, `Des weekInformations doivent etre fournis`));
        if (body.weekInformations.length != 14) return next(new HttpError(400, `weekInformation est invalide`));
        if (!body.scheduledEmployees) return next(new HttpError(400, `Un array d'employés est manquant`));

        scheduleQueries.selectAllSchedulePeriodsByScheduleWeekID(scheduleWeekId).then(result =>
        {
            console.log("result", result)

            let periodIdList = [];
            result.forEach(element =>
            {
                periodIdList.push(element.id)
            });
            if (periodIdList.length != 14) return next(new HttpError(400, `Erreur dans les Schedule Periods obtenues. Nous en avons obtenus seumlement ${periodIdList.length} `));
            const lowest = Math.min(...periodIdList);
            const highest = Math.max(...periodIdList);
            if (lowest != body.weekInformations[0].id) return next(new HttpError(400, `Erreur dans les Schedule Periods obtenues. Elle ne correspondent pas a la semaine dans la demande`));
            if (highest != body.weekInformations[13].id) return next(new HttpError(400, `Erreur dans les Schedule Periods obtenues. Elle ne correspondent pas a la semaine dans la demande`));

            scheduleQueries.deleteEmployeeFromSchedule(periodIdList).then(() =>
            {
                const scheduledEmployeeList = req.body.scheduledEmployees;
                console.log("scheduledEmployeeList.length", scheduledEmployeeList.length)
                {
                    scheduleQueries.insertNewEmployeeSchedule(scheduledEmployeeList).then(() =>
                    {
                        const weekInformationsList = req.body.weekInformations;
                        scheduleQueries.updateSchedulePeriodsInformations(weekInformationsList).then(() =>
                        {
                            scheduleQueries.updateScheduleWeekStatus(scheduleWeekId, isPublished)

                            res.status(200).json("Mise a jour reussi");
                        }).catch(err =>
                        {
                            return next(err);
                        })
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