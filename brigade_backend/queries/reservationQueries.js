const pool = require('./DBPool');

// DATES OKAY HERE 

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
        `SELECT 
            r.id AS res_id, r.table_number, r.client_id, r. people_count, r.date, r.start_time, r.end_time, r.mention, r.has_minor, r.taken_by,
            c.first_name AS client_first_name, c.last_name AS client_last_name, c.phone_number AS client_phone_number, c.allergy, c.is_favorite, c.is_blacklisted,
            rs.name 
                FROM reservation AS r
                    JOIN client AS c ON c.id = r.client_id
                    JOIN reservation_status AS rs ON rs.code = r.status_code
                        WHERE r.id = $1`,
        [id]);

    const row = result.rows[0];
    console.log(row);

    if (row) {

        const reservation = {
            id: row.res_id,
            tableNumber: row.table_number,
            clientId: row.client_id,
            peopleCount: row.people_count,
            date: truncateDate(row.date),
            startTime: row.start_time,
            endTime: row.end_time,
            mention: row.mention,
            hasMinor: row.has_minor,
            takenBy: row.taken_by,
            firstName: row.client_first_name,
            lastName: row.client_last_name,
            phoneNumber: row.client_phone_number,
            allergy: row.allergy,
            isFavorite: row.is_favorite,
            isBlacklisted: row.is_blacklisted,
            status: row.name
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
    const queryStartDate = !!startDate ? startDate : new Date().toLocaleDateString();
    const queryEndDate = !!endDate ? endDate : new Date().toLocaleDateString();

    results = await pool.query(
        `SELECT 
            r.id AS res_id, r.table_number, r.client_id, r. people_count, r.date, r.start_time, r.end_time, r.mention, r.has_minor, r.taken_by,
            c.first_name AS client_first_name, c.last_name AS client_last_name, c.phone_number AS client_phone_number, c.allergy, c.is_favorite, c.is_blacklisted,
            e.barcode_number AS employee_barcode_number, e.first_name AS employee_first_name, e.last_name AS employee_last_name, e.role AS employee_role
            FROM reservation AS r
                JOIN client AS c ON r.client_id = c.id
                JOIN employee AS e ON r.taken_by = e.barcode_number
                JOIN reservation_status AS rs ON rs.code = r.status_code 
                WHERE date >= $1 AND date <= $2
                ORDER BY date ASC`,
        [queryStartDate, queryEndDate]);

    return results.rows.map((row) => {
        const reservation = {
            id: row.res_id,
            tableNumber: row.table_number,
            clientId: row.client_id,
            peopleCount: row.people_count,
            date: truncateDate(row.date),
            startTime: row.start_time,
            endTime: row.end_time,
            mention: row.mention,
            hasMinor: row.has_minor,
            takenBy: row.taken_by,
            clientFirstname: row.client_first_name,
            clientLastname: row.client_last_name,
            clientPhoneNumber: row.client_phone_number,
            clientAllergy: row.allergy,
            clientIsFavorite: row.is_favorite,
            clientIsBlacklisted: row.is_blacklisted,
            employeeBarcodeNumber: row.employee_barcode_number,
            employeeFirstname: row.employee_first_name,
            employeeLastname: row.employee_last_name,
            employeeRole: row.employee_role,

        };

        return reservation;
    });
};
exports.getReservationListByDates = getReservationListByDates;