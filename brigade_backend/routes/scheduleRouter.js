const express = require('express');
const router = express.Router();
const passport = require('passport');
const reservationQueries = require('../queries/reservationQueries');
const scheduleQueries = require('../queries/scheduleQueries');

const HttpError = require("../HttpError");

router.get("/:scheduleweekid",
    (req, res, next) =>
    {
        const scheduleWeekId = req.params.scheduleweekid;
        if (!scheduleWeekId || scheduleWeekId === "")
        {
            return next(new HttpError(400, "Le champ ScheduleWeekId est requis"));
        }
        scheduleQueries
            .getScheduleWeekInfoByID(scheduleWeekId)
            .then((scheduleWeek) =>
            {
                if (scheduleWeek)
                {
                    scheduleQueries.getAllSchedulePeriodsByScheduleWeekID(scheduleWeekId).then(allScheduledPeriod =>
                    {
                        res.json(allScheduledPeriod);
                    })

                } else
                {
                    const week = findAllDayOfAWeek(scheduleWeekId);
                    console.log("Week", week)
                    scheduleQueries.insertNewScheduleWeek(week).then(result =>
                    {
                        if (result)
                        {
                            console.log("result",result)
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
    (req, res, next) =>
    {
        const scheduleWeekId = req.params.scheduleweekid;

        if (!scheduleWeekId) { return next(new HttpError(400, `Un scheduleWeekId doit etre fournis`)); }

        scheduleQueries.selectAllEmployeesScheduleByScheduleWeekId(scheduleWeekId).then(result =>
        {
            employeeList = [];
            result.forEach(element =>
            {

                let found = employeeList.find(({ employeeNumber }) => employeeNumber == element.employeeNumber);

                if (!found)
                {
                    const employee = {
                        employeeNumber: element.employeeNumber,
                        name: element.name,
                        role: element.role,
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

router.post("/",

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