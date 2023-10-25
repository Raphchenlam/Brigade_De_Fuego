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
      if (eventList) {
        res.json(eventList);
      } else {
        return next(new HttpError(404, `Les événements sont introuvables`));
      }
    })
    .catch((err) => {
      return next(err);
    });
});

router.get('/:date/:shiftName', (req, res, next) => {
  const date = req.params.date;
  const shiftName = req.params.shiftName;
  if (!date) return next(new HttpError(400, "une date doit etre fournis"));
  if (!shiftName || shiftName == "") return next(new HttpError(400, "une nom de shift doit etre fournis"));

  eventQueries.getEventByDateAndShift(date,shiftName).then(event => {
    if (event) {
      res.json(event);
    }
    else {
      res.status(206).json(`Aucun événement pour cette date`);
    }
  })
});

// GET un evenement individuel par nom
// Doit etre Admin

router.get('/:name', (req, res, next) => {
  const name = req.params.name;
  eventQueries.getEventByName(name).then(event => {
    if (event) {
      res.json(event);
    }
    else {
      res.status(206).json(`Aucun événement ne porte le nom suivant: ${name}`);
    }
  })
});


// POST un nouvel evenement
// Doit etre Admin
router.post(
  "/",

  // passport.authenticate("basic", { session: false }),
  (req, res, next) => {
    const user = req.user;
    const eventName = req.body.name;

    // if (!user || !user.isAdmin) {
    //   return next(new HttpError(403, "Droit administrateur requis"));
    // }

    if (!req.body.name) {
      return next(new HttpError(400, "Le nom de l'événement est requis."));
    }

    if (eventName.length >= 255) {
      return next(new HttpError(400, "Le nom est beaucoup trop long, il doit se limiter à 255 caractères.."));
    }

    if (!req.body.eventType) {
      return next(new HttpError(400, "Le type d'événement est requis."));
    }

    if (!req.body.impact) {
      return next(new HttpError(400, "L'impact sur l'événement est requis"));
    }

    console.log(req.body);

    eventQueries.getEventByName(eventName)
      .then((event) => {
        if (event) {
          throw new HttpError(409, `Un événement porte déjà le nom suivant: "${eventName}"`);
        }

        const newEvent = {
          name: "" + req.body.name,
          eventType: "" + req.body.eventType,
          impact: req.body.impact,
        };

        return eventQueries.insertEvent(newEvent);
      }).then((result) => {
        res.json(result);
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put('/:name',
  // passport.authenticate('basic', { session: false }),
  (req, res, next) => {
    const user = req.user;

    // if (!user || !user.isAdmin) {
    //   return next(new HttpError(403, "Droit administrateur requis"));
    // }

    const name = req.params.name;
    if (!name || name === '') {
      return next(new HttpError(400, 'Le paramètre nom est requis'));
    }

    if (name !== req.body.name) {
      return next(new HttpError(400, `Le paramètre spécifie le nom ${name} alors que l'événement fourni porte le nom ${req.body.name}`));
    }

    const newEvent = {
      name: "" + name,
      eventType: "" + req.body.eventType,
      impact: req.body.impact,
      isActive: req.body.isActive
    };

    eventQueries.updateEvent(newEvent).then(result => {
      if (!result) {
        return next(new HttpError(404, `Événement portant le nom ${name} est introuvable`));
      }
      res.json(result);
    }).catch(err => {
      return next(err);
    });

  }
);

router.delete('/:name',
  //passport.authenticate('basic', { session: false }),
  (req, res, next) => {
    const user = req.user;

    // if (!user || !user.isAdmin) {
    //     return next(HttpError(403, "Droit administrateur requis"));
    // }

    const name = req.params.name;
    if (!name || name === '') {
      return next(new HttpError(400, 'Le paramètre nom est requis'));
    }

    eventQueries.deleteEvent(name).then(result => {
      if (!result) {
        return next(new HttpError(404, `Événement portant le nom ${name} est introuvable`));
      }
      res.json(result);
    }).catch(err => {
      return next(err);
    });
  }
);
module.exports = router;

