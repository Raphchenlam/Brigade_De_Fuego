const pool = require('./DBPool');

const truncateDate = dateTime => {
    return new Date(dateTime).toLocaleDateString();
};

const explodingTime = time => {
    return {
        hour: parseInt(time.split(':').slice(0)[0]),
        minute: parseInt(time.split(':').slice(0)[1])
    }
}
exports.explodingTime = explodingTime;

const explodingDate = date => {
    return {
        year: parseInt(date.split('-').slice(0)[0]),
        month: parseInt(date.split('-').slice(0)[1]),
        day: parseInt(date.split('-').slice(0)[2])
    }
}
exports.explodingDate = explodingDate;


const getReservationById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM reservation
            WHERE id = $1`,
        [id]);

    const row = result.rows[0];

    if (row) {

        const reservation = {
            id: row.id,
            tableNumber: row.table_number,
            clientId: row.client_id,
            statusCode: row.status_code,
            peopleCount: row.people_count,
            date: truncateDate(row.date),
            startTime: row.start_time,
            endTime: row.end_time,
            mention: row.mention,
            hasMinor: row.has_minor,
            takenBy: row.taken_by
        };

        return reservation;
    }

    return undefined;
};
exports.getReservationById = getReservationById;


const getReservationByInformations = async (clientId, date, startTime) => {
    const explodedStartTime = explodingTime(startTime);

    let result;
    if (explodedStartTime.hour >= 16) {
        result = await pool.query(
            `SELECT * FROM reservation
                JOIN client ON client.id = reservation.client_id
                    WHERE client_id = $1 AND date = $2 AND start_time >= '16:00:00'`,
            [clientId, date]);
    } else {
        result = await pool.query(
            `SELECT * FROM reservation
                JOIN client ON client.id = reservation.client_id
                    WHERE client_id = $1 AND date = $2 AND start_time <= '16:00:00'`,
            [clientId, date]);
    }

    const reservation = result.rows[0];

    if (reservation) {
        reservation.date = truncateDate(reservation.date);
        return reservation;
    }

    return undefined;
};
exports.getReservationByInformations = getReservationByInformations;


const insertReservation = async (reservationInfos) => {
    const result = await pool.query(
        `INSERT INTO reservation
        (table_number, client_id, status_code, people_count, date, start_time, end_time, mention, has_minor, taken_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [reservationInfos.tableNumber,
        reservationInfos.clientId,
        reservationInfos.statusCode,
        reservationInfos.peopleCount,
        reservationInfos.date,
        reservationInfos.startTime,
        reservationInfos.endTime,
        reservationInfos.mention,
        reservationInfos.hasMinor,
        reservationInfos.takenBy]);

    const row = result.rows[0];

    if (row) {

        const reservation = {
            id: row.id,
            tableNumber: row.table_number,
            clientId: row.client_id,
            statusCode: row.status_code,
            peopleCount: row.people_count,
            date: truncateDate(row.date),
            startTime: row.start_time,
            endTime: row.end_time,
            mention: row.mention,
            hasMinor: row.has_minor,
            takenBy: row.taken_by
        };

        return reservation;
    }

    throw new Error("L'insertion a échoué pour une raison inconnue");
};
exports.insertReservation = insertReservation;


const getReservationListByDates = async (startDate, endDate) => {

    const queryStartDate = !!startDate ? startDate : new Date().toISOString().split('T')[0];
    const queryEndDate = !!endDate ? endDate : new Date().toISOString().split('T')[0];


    results = await pool.query(
        `SELECT * FROM reservation AS r
            JOIN client AS c ON r.client_id = c.id
            JOIN employee AS e ON r.taken_by = e.barcode_number
            WHERE date >= $1 AND date <= $2
            ORDER BY date ASC`,
        [queryStartDate, queryEndDate]);

    return results.rows.map((row) => {
        const reservation = {
            id: row.id,
            tableNumber: row.table_number,
            clientId: row.client_id,
            statusCode: row.status_code,
            peopleCount: row.people_count,
            date: truncateDate(row.date),
            startTime: row.start_time,
            endTime: row.end_time,
            mention: row.mention,
            hasMinor: row.has_minor,
            takenBy: row.taken_by
        };

        return reservation;
    });
};
exports.getReservationListByDates = getReservationListByDates;