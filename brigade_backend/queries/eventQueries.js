const pool = require("./DBPool");

const getAllEvents = async () => {
  const result = await pool.query(
    `SELECT * FROM event`
  );

  return result.rows.map(row => {
    const event = {
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

const insertEvent = async (event) => {
  const result = await pool.query(
    `INSERT INTO event(name, event_type, impact, is_active)
            VALUES ($1, $2, $3, true) RETURNING name`,
    [event.name, event.eventType, event.impact]
  );
  const row = result.rows[0];

  if (row) {
    return row.name;
  }

  throw new Error("L'insertion a échoué pour une raison inconnue");

};
exports.insertEvent = insertEvent;

const updateEvent = async (newEvent) => {
  const result = await pool.query(
    `UPDATE event SET event_type = $2, impact = $3, is_active = $4
    WHERE name = $1`,
    [newEvent.name, newEvent.eventType, newEvent.impact, newEvent.isActive]
  );
  if (result.rowCount === 0) {
    return undefined
  }
  return getEventByName(newEvent.name);
};
exports.updateEvent = updateEvent;

const deleteEvent = async (eventName) => {
  const result = await pool.query(
    `DELETE FROM event WHERE name = $1`,
    [eventName]
  );
  if (result.rowCount === 0) {
    return undefined;
  }
  return {};
};
exports.deleteEvent = deleteEvent;