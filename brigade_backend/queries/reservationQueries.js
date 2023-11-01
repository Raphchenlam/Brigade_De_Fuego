const pool = require('./DBPool');
const dATObj = require('../../REGEX/dateAndTimeObjectifier');

// DATES OKAY HERE 
const constructReservation = function (reservationObject) {
    return {
        id: reservationObject.id,
        tableNumber: reservationObject.table_number,
        clientId: reservationObject.client_id,
        statusCode: reservationObject.status_code,
        statusName: reservationObject.status_name,
        peopleCount: reservationObject.people_count,
        date: dATObj.toLocale(reservationObject.date).fullDate,
        startTime: reservationObject.start_time,
        endTime: reservationObject.end_time,
        mention: reservationObject.mention,
        hasMinor: reservationObject.has_minor,
        takenBy: reservationObject.taken_by
    }
}

const getReservationById = async (id) => {
    const result = await pool.query(
        `SELECT 
            r.id AS id, r.table_number, r.client_id, r. people_count, r.date, r.start_time, r.end_time, r.mention, r.has_minor, r.taken_by, r.status_code,
            c.first_name AS client_first_name, c.last_name AS client_last_name, c.phone_number AS client_phone_number, c.allergy, c.is_favorite, c.is_blacklisted,
            rs.name
                FROM reservation AS r
                    JOIN client AS c ON c.id = r.client_id
                    JOIN reservation_status AS rs ON rs.code = r.status_code
                        WHERE r.id = $1`,
        [id]);

    const row = result.rows[0];

    if (row) {

        const reservation = constructReservation(row);

        const reservationFinal = {
            firstName: row.client_first_name,
            lastName: row.client_last_name,
            phoneNumber: row.client_phone_number,
            allergy: row.allergy,
            isFavorite: row.is_favorite,
            isBlacklisted: row.is_blacklisted,
            status: row.name,
            ...reservation
        };

        return reservationFinal;
    }

    return undefined;
};
exports.getReservationById = getReservationById;


const getReservationByInformations = async (clientId, date, startTime) => {
    const timeObj = dATObj.toLocale(startTime);

    let result;
    if (timeObj.hours >= 16) {
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

    const row = result.rows[0];

    if (row) {
        const reservation = constructReservation(row);

        return {
            ...reservation,
            clientFirstname: row.first_name,
            clientLastname: row.last_name,
            clientPhoneNumber: row.phone_number,
            clientAllergy: row.allergy,
            clientIsFavorite: row.is_favorite,
            clientIsBlacklisted: row.is_blacklisted,
        }
    }

    return undefined;
};
exports.getReservationByInformations = getReservationByInformations;


const getExpectedPeopleByDateAndShiftName = async (date, shiftName) => {

    let result;
    if (shiftName == "Midi") {
        result = await pool.query(
            `SELECT SUM(people_count)
            FROM public.reservation
            WHERE date = $1
            AND start_time < '16:00'`,
            [date]);
    } else {
        result = await pool.query(
            `SELECT SUM(people_count)
            FROM public.reservation
            WHERE date = $1
            AND start_time >= '16:00'`,
            [date]);
    }
    let peopleCount = result.rows[0].sum;
    if (!peopleCount) peopleCount = 0;
    return peopleCount;
};
exports.getExpectedPeopleByDateAndShiftName = getExpectedPeopleByDateAndShiftName;


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

    if (row) return constructReservation(row);

    throw new Error("L'insertion a échoué pour une raison inconnue");
};
exports.insertReservation = insertReservation;

const getReservationStatusList = async (reservationInfos) => {
    const result = await pool.query(
        `SELECT * FROM public.reservation_status
        ORDER BY code ASC `);

    const row = result.rows;

    if (row) {
        return row;
    }

    throw new Error("La requête des statuts de réservation à échoué pour une raison inconnue");
};
exports.getReservationStatusList = getReservationStatusList;


const updateReservation = async (newReservationInfos) => {

    let UPDATEquery = `UPDATE reservation `;
    let newInformation = [];
    let changedFields = [];
    let counter = 1;

    if (newReservationInfos.date) changedFields.push(`date = $${counter}`), newInformation.push(newReservationInfos.date), counter++;
    if (newReservationInfos.startTime) changedFields.push(`start_time = $${counter}`), newInformation.push(newReservationInfos.startTime), counter++;
    if (newReservationInfos.endTime) changedFields.push(`end_time = $${counter}`), newInformation.push(newReservationInfos.endTime), counter++;
    if (newReservationInfos.tableNumber || newReservationInfos.tableNumber == null) changedFields.push(`table_number = $${counter}`), newInformation.push(newReservationInfos.tableNumber), counter++;
    if (newReservationInfos.statusCode) changedFields.push(`status_code = $${counter}`), newInformation.push(newReservationInfos.statusCode), counter++;
    if (newReservationInfos.peopleCount) changedFields.push(`people_count = $${counter}`), newInformation.push(newReservationInfos.peopleCount), counter++;
    if (newReservationInfos.mention || newReservationInfos.mention == '') changedFields.push(`mention = $${counter}`), newInformation.push(newReservationInfos.mention), counter++;
    if (newReservationInfos.hasMinor === false || newReservationInfos.hasMinor === true) changedFields.push(`has_minor = $${counter}`), newInformation.push(newReservationInfos.hasMinor), counter++;


    if (changedFields.length > 0) {
        UPDATEquery += `SET ${changedFields.join(', ')}`;
        UPDATEquery += ` WHERE reservation.id = $${counter} RETURNING *`;
        newInformation.push(newReservationInfos.id);

        const result = await pool.query(UPDATEquery, newInformation);

        const row = result.rows[0];
        if (row) {
            const reservation = constructReservation(row);

            const reservationFinal = {
                ...reservation,
                clientFirstname: row.client_first_name,
                clientLastname: row.client_last_name,
                clientPhoneNumber: row.client_phone_number,
                clientAllergy: row.allergy,
                clientIsFavorite: row.is_favorite,
                clientIsBlacklisted: row.is_blacklisted,
                employeeBarcodeNumber: row.employee_barcode_number,
                employeeFirstname: row.employee_first_name,
                employeeLastname: row.employee_last_name,
                employeeRole: row.employee_role
            };

            return reservationFinal;
        }
    }

    return undefined;
};
exports.updateReservation = updateReservation;


const getReservationListByDates = async (startDate, endDate) => {
    const queryStartDate = !!startDate ? startDate : new Date().toLocaleDateString("en-GB");
    const queryEndDate = !!endDate ? endDate : new Date().toLocaleDateString("en-GB");    

    results = await pool.query(
        `SELECT 
            r.id AS id, r.table_number, r.client_id, r. people_count, r.date, r.start_time, r.end_time, r.mention, r.has_minor, r.taken_by,
            c.first_name AS client_first_name, c.last_name AS client_last_name, c.phone_number AS client_phone_number, c.allergy, c.is_favorite, c.is_blacklisted,
            e.barcode_number AS employee_barcode_number, e.first_name AS employee_first_name, e.last_name AS employee_last_name, e.role AS employee_role,
            rs.code AS status_code, rs.name AS status_name
            FROM reservation AS r
                JOIN client AS c ON r.client_id = c.id
                JOIN employee AS e ON r.taken_by = e.barcode_number
                JOIN reservation_status AS rs ON rs.code = r.status_code 
                WHERE date >= $1 AND date <= $2
                ORDER BY date ASC, start_time ASC, client_first_name ASC`,
        [queryStartDate, queryEndDate]);

    return results.rows.map((row) => {

        const reservation = constructReservation(row);

        const reservationFinal = {
            ...reservation,
            clientFirstname: row.client_first_name,
            clientLastname: row.client_last_name,
            clientPhoneNumber: row.client_phone_number,
            clientAllergy: row.allergy,
            clientIsFavorite: row.is_favorite,
            clientIsBlacklisted: row.is_blacklisted,
            employeeBarcodeNumber: row.employee_barcode_number,
            employeeFirstname: row.employee_first_name,
            employeeLastname: row.employee_last_name,
            employeeRole: row.employee_role

        };

        return reservationFinal;
    });
};
exports.getReservationListByDates = getReservationListByDates;


const updateTableOnReservationById = async(id, tableNumber) => {
    if(tableNumber==0)tableNumber = null;

    const result = await pool.query(
        `UPDATE reservation SET table_number = $2 WHERE id = $1`,
        [id, tableNumber]
    );
    if (result.rowCount === 0) {
        return undefined
    }
    return getReservationById(id);
};
exports.updateTableOnReservationById=updateTableOnReservationById;

const updateReservationStatusById = async(id, statusCode) => {
    if (statusCode != null) {
        const result = await pool.query(
            `UPDATE reservation SET status_code = $2 WHERE id = $1`,
            [id, statusCode]
        );
        if(result.rowCount === 0) {
            return undefined
        }
        return getReservationById(id);
    }
};
exports.updateReservationStatusById = updateReservationStatusById;
