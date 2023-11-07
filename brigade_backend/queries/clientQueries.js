const pool = require("./DBPool");

const constructClient = function (row) {
    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        phoneNumber: row.phone_number,
        allergy: row.allergy,
        isFavorite: row.is_favorite,
        isBlacklisted: row.is_blacklisted
    }
}

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
    if (row) {
        return {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            phoneNumber: row.phone_number,
            allergy: row.allergy,
            isFavorite: row.is_favorite,
            isBlacklisted: row.is_blacklisted
        }
    }

    return undefined;
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


const updateClient = async (newClientInformations) => {

    let UPDATEquery = `UPDATE client `;
    let newInformation = [];
    let changedFields = [];
    let counter = 1;

    if (newClientInformations.firstName) changedFields.push(`first_name = $${counter}`), newInformation.push(newClientInformations.firstName), counter++;
    if (newClientInformations.lastName) changedFields.push(`last_name = $${counter}`), newInformation.push(newClientInformations.lastName), counter++;
    if (newClientInformations.phoneNumber) changedFields.push(`phone_number = $${counter}`), newInformation.push(newClientInformations.phoneNumber), counter++;
    if (newClientInformations.allergy) changedFields.push(`allergy = $${counter}`), newInformation.push(newClientInformations.allergy), counter++;
    if (newClientInformations.isFavorite === true
        || newClientInformations.isFavorite === false) changedFields.push(`is_favorite = $${counter}`), newInformation.push(newClientInformations.isFavorite), counter++;

    if (newClientInformations.isBlacklisted === true
        || newClientInformations.isBlacklisted === false) changedFields.push(`is_blacklisted = $${counter}`), newInformation.push(newClientInformations.isBlacklisted), counter++;

    const client = await pool.connect();
    try {

        await client.query('BEGIN');

        if (newClientInformations.isBlacklisted === true) {
            changeStatusOfAllIncomingReservationsById(40, 1, 8, client);
        } else if (newClientInformations.isBlacklisted === false) {
            changeStatusOfAllIncomingReservationsById(40, 8, 1, client);
        }


        if (changedFields.length > 0) {
            UPDATEquery += `SET ${changedFields.join(', ')}`;
            UPDATEquery += ` WHERE client.id = $${counter} RETURNING *`;
            newInformation.push(newClientInformations.id);

            const result = await client.query(UPDATEquery, newInformation);
            const row = result.rows[0];

            client.query('COMMIT');
            
            if (row) return constructClient(row);
        }

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        throw error;
    } finally {
        client.release();
    }

    return undefined;
};
exports.updateClient = updateClient;

const changeStatusOfAllIncomingReservationsById = async (clientId, oldStatus, newStatus, client) => {
    await (client || pool).query(
        `UPDATE public.reservation
                SET status_code = $3
                WHERE client_id = $1 AND status_code = $2 AND date >= CURRENT_DATE
                RETURNING *`,
        [clientId, oldStatus, newStatus]
    )

    return;
};