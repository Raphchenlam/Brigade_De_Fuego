const pool = require("./DBPool");


const getClientList = async () => {
    const result = await pool.query(
        `SELECT * FROM client
            ORDER BY first_name`);

    return result.rows;
};
exports.getClientList = getClientList;


const getClientById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM client
        WHERE id = $1`,
        [id]);

    const row = result.rows[0];

    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        phoneNumber: row.phone_number,
        allergy: row.allergy,
        isFavorite: row.is_favorite,
        isBlacklisted: row.is_blacklisted
    }
};
exports.getClientById = getClientById;


const getClientByInformations = async (firstName, lastName, phoneNumber) => {
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
exports.getClientByInformations = getClientByInformations;


const insertClient = async (clientInfos) => {
    const result = await pool.query(
        `INSERT INTO client(first_name, last_name, phone_number, allergy, is_favorite, is_blacklisted)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`,
        [clientInfos.firstName, clientInfos.lastName, clientInfos.phoneNumber, clientInfos.allergy, clientInfos.isFavorite, clientInfos.isBlacklisted]);

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

    throw new Error("L'insertion a échoué pour une raison inconnue");
};
exports.insertClient = insertClient;
