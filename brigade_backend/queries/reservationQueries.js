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


// const getReservationByInformations = async (clientId, date, startTime) => {
//     const remadeDate = remakeDate(date);
//     // const remadeTime = remakeDate(startTime);
//     console.log(remadeDate);

//     const result = await pool.query(
//         // `SELECT * FROM reservation
//         //     WHERE client_id = $1 AND date = DATE '$2' AND start_time = TIME '$3'`,
//         // [clientId, date, startTime]);
//         `SELECT * FROM reservation
//             WHERE client_id = $1
//             ORDER BY date DESC `,
//         [clientId]);

//     const rows = result.rows.map(row => {
//         const reservation = {
//             id: row.id,
//             tableNumber: row.table_number,
//             clientId: row.client_id,
//             statusCode: row.status_code,
//             peopleCount: row.people_count,
//             date: truncateDate(row.date),
//             startTime: row.start_time,
//             endTime: row.end_time,
//             mention: row.mention,
//             hasMinor: row.has_minor,
//             takenBy: row.taken_by
//         };

//         if(reservation.date ){
//             break;
//         }

//         return reservation;
//     });

//     if (rows) {
//         return reservation;
//     }

//     return undefined;
// };
// exports.getReservationByInformations = getReservationByInformations;


const insertReservation = async (reservationInfos) => {
    const result = await pool.query(
        `INSERT INTO reservation
        (table_number, 
            client_id, 
            status_code, 
            people_count, 
            date, 
            start_time, 
            end_time, 
            mention, 
            has_minor, 
            taken_by)
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
