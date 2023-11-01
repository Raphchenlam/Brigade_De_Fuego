const pool = require('./DBPool');

const getAllTables = async () => {
    const result = await pool.query(
        `SELECT * FROM "table" ORDER BY number`
    );
    return result.rows.map(row => {
        const table = {
            number: row.number,
            capacity: row.capacity,
            isActive: row.is_active
        }
        return table;
    })
};
exports.getAllTables = getAllTables;

const getTableByNumber = async (tableNumber) => {
    const result = await pool.query(
        `SELECT * FROM "table" WHERE number = $1`, [tableNumber]
    );
    const row = result.rows[0];
    if (row) {
        const table = {
            number: row.number,
            capacity: row.capacity,
            isActive: row.is_active
        }
        return table;
    }
    return undefined;
};
exports.getTableByNumber = getTableByNumber;

const updateTableStatus = async (tableNumber, status) => {
    const result = await pool.query(
        `UPDATE "table" SET is_active = $1 WHERE number = $2`, [status, tableNumber]
    );
    if (result.rowCount === 0) {
        return undefined
    }
    return getTableByNumber(tableNumber);
};
exports.updateTableStatus = updateTableStatus;
