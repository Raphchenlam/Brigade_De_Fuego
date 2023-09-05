const pool = require("./DBPool");

const createEvent = async (event) => {
  const result = await pool.query(
    `INSERT INTO event(name, event_type, impact, is_active)
            VALUES ($1, $2, $3, true) RETURNING id`,
    [event.name, event.eventType, event.impact]
  );
  const row = result.rows[0];

  if (row) {
    return row.id;
  }

  throw new Error("L'insertion a échoué pour une raison inconnue");

};

exports.createEvent = createEvent;

const getAllEvents = async () => {
  const result = await pool.query(
    `SELECT * FROM event`
  );

  return result.rows.map(row => {
    const event = {
      id: row.id,
      name: row.name,
      eventType: row.event_type,
      impact: row.impact,
      isActive: row.is_active
    };
    return event;
  });
};
exports.getAllEvents = getAllEvents;

const getEventByName = async (eventName) => {
  const result = await pool.query(
    `SELECT * FROM event WHERE name = $1`, [eventName]
  );

const row = result.rows[0];
if (row) {
  const event = {
    id: row.id,
    name: row.name,
    eventType: row.event_type,
    impact: row.impact,
    isActive: row.is_active
  };
  return event;
}
return undefined;
};


exports.getEventByName = getEventByName;

const getAllEventType = async () => {
  const result = await pool.query(
    `SELECT name FROM event_type`
  );

  const eventTypeList = result.rows

  return eventTypeList;
}

exports.getAllEventType = getAllEventType;