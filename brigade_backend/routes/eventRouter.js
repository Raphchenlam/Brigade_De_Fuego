const express = require("express");
const router = express.Router();
const passport = require("passport");

const HttpError = require("../HttpError");

const eventQueries = require("../queries/eventQueries");

// GET pour la liste des evenements
// Aucune authorisation necessaire
router.get("/", (req, res, next) => {

  eventQueries
    .getAllEvents()
    .then((eventList) => {
      res.json(eventList);
    })
    .catch((err) => {
      return next(err);
    });
});

// GET un evenement individuel par nom
// Doit etre Admin

router.get('/:name', (req, res, next) => {
  const name = req.params.name;
  eventQueries.getEventByName(name).then(event => {
    if(event){
      res.json(event);
    }
    else{
      res.status(206).json(`Aucun événement ne porte le nom suivant: ${name}`);
    }
  })
});

// // GET pour la liste des types d evenement
// // Doit etre Admin
// router.get(
//   "/eventType/",

//   //passport.authenticate("basic", { session: false }),
//   (req, res, next) => {
//     const user = req.user;

//     // if (!user || !user.isAdmin) {
//     //   return next(new HttpError(403, "Droit administrateur requis"));
//     // }

//     eventQueries
//       .getAllEventType()
//       .then((eventTypeList) => {
//         res.json(eventTypeList);
//       })
//       .catch((err) => {
//         return next(err);
//       });
//   }
// );

// POST un nouvel evenement
// Doit etre Admin
router.post(
  "/",

  // passport.authenticate("basic", { session: false }),
  (req, res, next) => {
    const user = req.user;

    // if (!user || !user.isAdmin) {
    //   return next(new HttpError(403, "Droit administrateur requis"));
    // }

    if (!req.body.name) {
      return next(new HttpError(400, "Le nom de l'événement est requis."));
    }

    if (!req.body.eventType) {
      return next(new HttpError(400, "Le type d'événement est requis."));
    }

    if (!req.body.impact) {
      return next(new HttpError(400, "L'impact sur l'événement est requis"));
    }

    console.log(req.body);

    const newEvent = {
      name: "" + req.body.name,
      eventType: "" + req.body.eventType,
      impact: req.body.impact,
    };

    eventQueries
      .insertEvent(newEvent)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = router;
