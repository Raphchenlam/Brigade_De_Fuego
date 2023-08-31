const pool = require("./DBPool");

const getClientById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM client
        WHERE id = $1`,
    [id]);

    return result.rows[0];
};
exports.getClientById = getClientById;


const getClientByInfos = async (firstName, lastName, phoneNumber) => {
    const result = await pool.query(
      `SELECT * FROM client
          WHERE first_name = $1 AND last_name = $2 AND phone_number = $3`,
      [firstName, lastName, phoneNumber]);

      const row = result.rows[0];

        if(row){
            
            const client = {
                firstName: row.firstName,
                lastName: row.lastName,
                phoneNumber: row.phoneNumber,
                allergy: row.allergy,
                isFavorite: row.isFavorite,
                isBlacklisted: row.isBlacklisted
            };
            
            return client;
        }

        return undefined;
  };
exports.getClientByInfos = getClientByInfos;


const insertClient = async (clientInfos) => {
  const result = await pool.query(
    `INSERT INTO client(first_name, last_name, phone_number, allergy, is_favorite, is_blacklisted)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`,
    [clientInfos.firstName, clientInfos.lastName, clientInfos.phoneNumber, clientInfos.allergy, clientInfos.isFavorite, clientInfos.isBlacklisted]);

    const row = result.rows[0];

    if(row){
        return row.id;
    }

    throw new Error("L'insertion a échoué pour une raison inconnue");
};
exports.insertClient = insertClient;
