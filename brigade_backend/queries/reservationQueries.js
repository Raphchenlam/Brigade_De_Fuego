const pool = require('./DBPool');


const getReservationById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM reservation
        WHERE id = $1`,
        [id]);

    return result.rows[0];
};
exports.getReservationById = getReservationById;


const getReservationByInformations = async (firstName, lastName, phoneNumber) => {
    const result = await pool.query(
        `SELECT * FROM client
          WHERE first_name = $1 AND last_name = $2 AND phone_number = $3`,
        [firstName, lastName, phoneNumber]);

    const row = result.rows[0];

    if (row) {

        const client = {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            phoneNumber: row.phone_number,
            allergy: row.allergy,
            isFavorite: row.is_favorite,
            isBlacklisted: row.is_blacklisted
        };

        return client;
    }

    return undefined;
};
exports.getReservationByInformations = getReservationByInformations;


// const insertReservation = async (clientInfos) => {
//     const result = await pool.query(
//         `INSERT INTO client(first_name, last_name, phone_number, allergy, is_favorite, is_blacklisted)
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING *;`,
//         [clientInfos.firstName, clientInfos.lastName, clientInfos.phoneNumber, clientInfos.allergy, clientInfos.isFavorite, clientInfos.isBlacklisted]);

//     const row = result.rows[0];

//     if (row) {
//         const client = {
//             id: row.id,
//             firstName: row.first_name,
//             lastName: row.last_name,
//             phoneNumber: row.phone_number,
//             allergy: row.allergy,
//             isFavorite: row.is_favorite,
//             isBlacklisted: row.is_blacklisted
//         };

//         return client;
//     }

//     throw new Error("L'insertion a échoué pour une raison inconnue");
// };
// exports.insertReservation = insertReservation;
