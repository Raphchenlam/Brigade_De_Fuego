const express = require("express");
const router = express.Router();
const passport = require("passport");

const HttpError = require("../HTTPError");

const eventQueries = require("../queries/eventQueries");


// GET pour la liste des types d evenement
// Doit etre Admin
router.get(
  "/",

  //passport.authenticate("basic", { session: false }),
  (req, res, next) => {
    const user = req.user;

    // if (!user || !user.isAdmin) {
    //   return next(new HttpError(403, "Droit administrateur requis"));
    // }

    eventQueries
      .getAllEventType()
      .then((eventTypeList) => {
        res.json(eventTypeList);
      })
      .catch((err) => {
        return next(err);
      });
  }
);

module.exports = router;
