const express = require('express');
const router = express.Router();
const passport = require('passport'); //PLUS TARD

const HttpError = require("../HttpError");

const leaveQueries = require('../queries/leaveQueries');

// passport.authenticate('basic', { session: false }), (req,res,next)...

/*
router.get('/',
    (req, res, next) =>
    {
        // const employee = req.employee;

        // if (!employeeConnected) {
        //     return next(new HttpError(401, "Vous devez etre connecté"));
        // };
        // if (!employeeConnected.isAdmin || !employeeConnected.isSuperAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // };

        leaveQueries.selectAllLeaves().then(leaves =>
        {
            res.json(leaves);
        }).catch(err =>
        {
            return next(err);
        });
    });
*/

router.get('/category',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const user = req.user;
        if (!user)
        {
            return next(new HttpError(401, "Vous devez etre connecté"));
        };
        if (!user.isAdmin)
        {
            return next(new HttpError(403, "Droit administrateur requis"));
        };

        leaveQueries.selectAllLeavesCategory().then(leavesCategory =>
        {
            res.json(leavesCategory);
        }).catch(err =>
        {
            return next(err);
        });
    });


router.get('/filter',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const user = req.user;
        if (!user)
        {
            return next(new HttpError(401, "Vous devez etre connecté"));
        };
        if (!user.isAdmin)
        {
            return next(new HttpError(403, "Droit administrateur requis"));
        };

        const checkboxesData = req.query.data;
        if (!checkboxesData) return next(new HttpError(400, `Un data de checkboces doit etre fournis`));
        const checkboxes = JSON.parse(checkboxesData);


        if (!checkboxes.accepted && !checkboxes.refused && !checkboxes.pending && !checkboxes.pendingModified) 
        {
            res.json([]);
        }
        if (!checkboxes.coming && !checkboxes.passed) 
        {
            res.json([]);
        }

        leaveQueries.selectAllFilteredLeaves(checkboxes).then(leaves =>
        {
            res.json(leaves);
        }).catch(err =>
        {
            return next(err);
        });
    });

router.get('/employee/:employeeNumber',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const employeeNumberToGet = req.params.employeeNumber;
        const user = req.user;
        if (!user)
        {
            return next(new HttpError(401, "Vous devez etre connecté"));
        };
        if (user.employeeNumber != employeeNumberToGet)
        {
            if (!user.isAdmin) return next(new HttpError(403, "Vous ne pouvez pas obtenir les congés d'un autre employé"));
        };
        leaveQueries.selectLeavesByEmployeeNumber(employeeNumberToGet).then(leaves =>
        {
            res.json(leaves);
        }).catch(err =>
        {
            return next(err);
        });
    });

router.post('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const user = req.user;
        if (!user)
        {
            return next(new HttpError(401, "Vous devez etre connecté"));
        };

        const body = req.body;
        if (!body.employeeNumber || body.employeeNumber == '') return next(new HttpError(400, `Un numero d'employé est requis`));
        if (!body.category || body.category == '') return next(new HttpError(400, `Une catégorie de congé est requise`));
        if (!body.startDate) return next(new HttpError(400, `Une date de début est requise`));
        if (!body.endDate) return next(new HttpError(400, `Une date de fin est requise`));
        if (!body.reason || body.reason == '') return next(new HttpError(400, `Une raison du congé est requise`));

        if (user.employeeNumber != body.employeeNumber)
        {
            if (!user.isAdmin) return next(new HttpError(403, "Vous ne pouvez pas demander un congé pour un autre employé"));
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 7);
        var dayOfWeek = futureDate.getDay();
        var daysToAdd = 1 - dayOfWeek;
        futureDate.setDate(futureDate.getDate() + daysToAdd);

        const dateStr = body.startDate;
        var dateParts = dateStr.split('-');
        var startDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        if (startDate < futureDate) return next(new HttpError(400, `La date de debut doit etre minimum le lundi 1 semaine à l'avance`));
        if (body.endDate < body.startDate) return next(new HttpError(400, `La date de fin ne peut pas etre avant la date de debut`));

        const newLeave = {
            employeeNumber: body.employeeNumber,
            startDate: body.startDate,
            endDate: body.endDate,
            category: body.category,
            reason: body.reason,
            status: 'Pending'
        }

        leaveQueries.insertLeave(newLeave).then(leave =>
        {
            res.json(leave);
        }).catch(err =>
        {
            return next(err);
        });
    });


router.put('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) =>
    {
        const user = req.user;
        if (!user)
        {
            return next(new HttpError(401, "Vous devez etre connecté"));
        };

        const body = req.body;
        if (!body.employeeNumber || body.employeeNumber == '') return next(new HttpError(400, `Un numero d'employé est requis`));
        if (!body.category || body.category == '') return next(new HttpError(400, `Une catégorie de congé est requise`));
        if (!body.startDate) return next(new HttpError(400, `Une date de début est requise`));
        if (!body.endDate) return next(new HttpError(400, `Une date de fin est requise`));
        if (!body.reason || body.reason == '') return next(new HttpError(400, `Une raison du congé est requise`));
        if (user.employeeNumber != body.employeeNumber)
        {
            if (!user.isAdmin) return next(new HttpError(403, "Vous ne pouvez pas modifier un congé pour un autre employé"));
        };

        leaveQueries.selectLeaveByID(body.id).then(result =>
        {
            if (!result) return next(new HttpError(404, "Aucun congé n'a pu être trouvé avec ce id"));
            if (result.employeeNumber != body.employeeNumber)
            {
                return next(new HttpError(400, "Le numéro de l'employé envoyé ne correspong pas a celui déjà dans le congé"));
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let futureDate = new Date(today);
            futureDate.setDate(today.getDate() + 7);
            var dayOfWeek = futureDate.getDay();
            var daysToAdd = 1 - dayOfWeek;
            futureDate.setDate(futureDate.getDate() + daysToAdd);

            const dateStr = body.startDate;
            var dateParts = dateStr.split('-');
            var startDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            
            if (startDate < futureDate && !(body.status == "Approved" || body.status == "Refused")) return next(new HttpError(400, `La date de debut doit etre minimum le lundi 1 semaine à l'avance`));
            if (body.endDate < body.startDate) return next(new HttpError(400, `La date de fin ne peut pas etre avant la date de debut`));

            const newLeave = {
                id: body.id,
                startDate: body.startDate,
                endDate: body.endDate,
                category: body.category,
                reason: body.reason,
                status: body.status
            }

            leaveQueries.updateLeave(newLeave).then(leave =>
            {
                res.json(leave);
            }).catch(err =>
            {
                return next(err);
            });
        });
    });
module.exports = router;
