const pool = require('./DBPool');
const dATObj = require('../../REGEX/dateAndTimeObjectifier');

// DATES OKAY HERE 

const getReservationById = async (id) => {
    const result = await pool.query(
        `SELECT 
            r.id AS res_id, r.table_number, r.client_id, r. people_count, r.date, r.start_time, r.end_time, r.mention, r.has_minor, r.taken_by, r.status_code,
            c.first_name AS client_first_name, c.last_name AS client_last_name, c.phone_number AS client_phone_number, c.allergy, c.is_favorite, c.is_blacklisted,
            rs.name
                FROM reservation AS r
                    JOIN client AS c ON c.id = r.client_id
                    JOIN reservation_status AS rs ON rs.code = r.status_code
                        WHERE r.id = $1`,
        [id]);

    const row = result.rows[0];

    if (row) {
        const reservation = {
            id: row.res_id,
            tableNumber: row.table_number,
            clientId: row.client_id,
            peopleCount: row.people_count,
            date: dATObj.toLocale(row.date).fullDate,
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
            status: row.name,
            statusCode: row.status_code
        };

        return reservation;
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

    const reservation = result.rows[0];

    if (reservation) {
        reservation.date = dATObj.toLocale(reservation.date).fullDate;
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
            date: dATObj.toLocale(row.date).fullDate,
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


const updateReservation = async (newReservationInfos) => {

    // TODO:  Faire la requête a la bd


    // console.log("updateReservation call to DB used");


    let UPDATEquery = `UPDATE reservation `;
    let newInformation = [];
    let changedFields = [];
    let counter = 1;

    if (newReservationInfos.date)          changedFields.push(` date = $${counter}`),            console.log(`newReservationInfos.date : \t ${changedFields[counter - 1]} => ${newReservationInfos.date}`),           newInformation.push(newReservationInfos.date), counter++;
    if (newReservationInfos.startTime)     changedFields.push(` start_time = $${counter}`),      console.log(`newReservationInfos.startTime : ${changedFields[counter - 1]} => ${newReservationInfos.startTime}`),     newInformation.push(newReservationInfos.startTime), counter++;
    if (newReservationInfos.endTime)       changedFields.push(` end_time = $${counter}`),        console.log(`newReservationInfos.endTime : \t ${changedFields[counter - 1]} => ${newReservationInfos.endTime}`),       newInformation.push(newReservationInfos.endTime), counter++;
    if (newReservationInfos.tableNumber)   changedFields.push(` table_number = $${counter}`),    console.log(`newReservationInfos.tableNumber : ${changedFields[counter - 1]} => ${newReservationInfos.tableNumber}`),   newInformation.push(newReservationInfos.tableNumber), counter++;
    if (newReservationInfos.statusCode)    changedFields.push(` status_code = $${counter}`),     console.log(`newReservationInfos.statusCode : ${changedFields[counter - 1]} => ${newReservationInfos.statusCode}`),    newInformation.push(newReservationInfos.statusCode), counter++;
    if (newReservationInfos.peopleCount)   changedFields.push(` people_count = $${counter}`),    console.log(`newReservationInfos.peopleCount : ${changedFields[counter - 1]} => ${newReservationInfos.peopleCount}`),   newInformation.push(newReservationInfos.peopleCount), counter++;
    if (newReservationInfos.mention)       changedFields.push(` mention = $${counter}`),         console.log(`newReservationInfos.mention : ${changedFields[counter - 1]} => ${newReservationInfos.mention}`),        newInformation.push(newReservationInfos.mention), counter++;
    if (newReservationInfos.hasMinor)      changedFields.push(` has_minor = $${counter}`),       console.log(`newReservationInfos.hasMinor : ${changedFields[counter - 1]} => ${newReservationInfos.hasMinor}`),      newInformation.push(newReservationInfos.hasMinor), counter++;

    // // if (checkboxes.pendingModified) changedFields.push(`leave.status = 'PendingModified'`);

    // if (changedFields.length > 0) 
    // { //TODO there's a braquette at the end that goes with this one
    //     UPDATEquery += `SET ${changedFields.join(', ')}`;
    //     UPDATEquery += `WHERE reservation.id = $${counter}`;
    //     newInformation.push(newReservationInfos.id);
    // TODO: uncomment to here, not further

    //     if (checkboxes.coming && checkboxes.passed) {
    //         // Aucune condition WHERE nécessaire si les deux cases sont cochées
    //     } else if (checkboxes.coming) {
    //         query += ` AND leave.start_date >= CURRENT_DATE`;
    //     } else if (checkboxes.passed) {
    //         query += ` AND leave.start_date < CURRENT_DATE`;
    //     }
    // } else {
    //     if (checkboxes.coming && checkboxes.passed) {
    //         // Aucune condition WHERE nécessaire si les deux cases sont cochées
    //     } else if (checkboxes.coming) {
    //         query += ` WHERE leave.start_date >= CURRENT_DATE`;
    //     } else if (checkboxes.passed) {
    //         query += ` WHERE leave.start_date < CURRENT_DATE`;
    //     }
    // }

    // query += ` ORDER BY leave.start_date`;

    // let result;

    // result = await pool.query(query);

    // if (!result) return [];

    // const resultNbPending = await pool.query(`SELECT COUNT(*) AS nb_pending
    //                 FROM leave
    //                 JOIN employee ON employee.employee_number = leave.employee_number
    //                 WHERE leave.status = 'Pending' OR leave.status = 'PendingModified'`)

    // nbPending = resultNbPending.rows[0].nb_pending;

    // let resultFinal = result.rows.map(row => {
    //     const leave = {
    //         id: row.id,
    //         employeeNumber: row.employee_number,
    //         employeeName: row.first_name + " " + row.last_name,
    //         startDate: row.start_date,
    //         endDate: row.end_date,
    //         category: row.category,
    //         reason: row.reason,
    //         status: row.status
    //     };
    //     return leave;
    // });
    // resultFinal.push({ nbPending: parseInt(nbPending) });
    // return resultFinal;
    // } // TODO: remove or comment this braquette
    return "updateReservation call to DB used";

};
exports.updateReservation = updateReservation;


const getReservationListByDates = async (startDate, endDate) => {
    const queryStartDate = !!startDate ? startDate : new Date().toLocaleDateString("en-GB");
    const queryEndDate = !!endDate ? endDate : new Date().toLocaleDateString("en-GB");

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
            date: dATObj.toLocale(row.date).fullDate,
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