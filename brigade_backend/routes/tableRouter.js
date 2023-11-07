const express = require('express');
const router = express.Router();
const passport = require('passport');

const HttpError = require("../HTTPError");

const tableQueries = require("../queries/tableQueries");


// GET all tables
router.get('/', (req, res, next) => {
    tableQueries.getAllTables()
        .then(tableList => {
            if (tableList) {
                res.json(tableList);
            } else {
                return next(new HttpError(404, `Les tables sont introuvables`));
            }
        })
        .catch((err) => {
            return next(err);
        });
});

// GET A table by number
router.get('/:tableNumber', (req, res, next) => {
    const tableNumber = req.params.tableNumber;
    tableQueries.getTableByNumber(tableNumber)
    .then(table => {
        if (table) {
            res.json(table);
        }else {
            return next(new HttpError(404, `La table est introuvable`));
        }
    })
    .catch((err)=>{
        return next(err);
    })
})

// UPDATE a table STATUS by number
router.put('/:tableNumber', (req, res, next) =>{
    const tableNumber = req.params.tableNumber;
    const status = req.body.status;
    tableQueries.updateTableStatus(tableNumber, status)
    .then(table =>{
        if (table) {
            res.json(table);
        } else {
            return next(new HttpError(404, `Aucune table modifiée, car la table est introuvable`));
        }
    })
})

module.exports = router;