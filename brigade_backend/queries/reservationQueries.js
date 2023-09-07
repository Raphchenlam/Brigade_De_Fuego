const pool = require('./DBPool');

const truncateDate = dateTime => {
    return new Date(dateTime).toLocaleDateString();
};

const remakeDate = date => {
    return new Date(date);
};

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
    const remadeDate = remakeDate(date);
    // const remadeTime = remakeDate(startTime);
    
    
    const result = await pool.query(
        // `SELECT * FROM reservation
        //     WHERE client_id = $1 AND date = DATE '$2' AND start_time = TIME '$3'`,
        // [clientId, date, startTime]);
        `SELECT * FROM reservation
            WHERE client_id = $1 AND date = DATE '$2'`,
        [clientId, remadeDate]);

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
exports.getReservationByInformations = getReservationByInformations;


// const insertReservation = async (reservationInfos) => {
//     const result = await pool.query(
//         `INSERT INTO reservation(first_name, last_name, phone_number, allergy, is_favorite, is_blacklisted)
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING *;`,
//         [reservationInfos.firstName, reservationInfos.lastName, reservationInfos.phoneNumber, reservationInfos.allergy, reservationInfos.isFavorite, reservationInfos.isBlacklisted]);

//     const row = result.rows[0];

//     // if (row) {
//     //     const client = {
//     //         id: row.id,
//     //         firstName: row.first_name,
//     //         lastName: row.last_name,
//     //         phoneNumber: row.phone_number,
//     //         allergy: row.allergy,
//     //         isFavorite: row.is_favorite,
//     //         isBlacklisted: row.is_blacklisted
//     //     };

//     //     return client;
//     // }

//     // throw new Error("L'insertion a échoué pour une raison inconnue");
// };
// exports.insertReservation = insertReservation;
