const pool = require('./DBPool');

// const getAssignationsByDate = async (assignationDate) => {
//     const result = await pool.query(
//         `SELECT
//         ass.date, ass.shift, ass.table_number, ass.employee_number, 
//         e.first_name, e.last_name, e.color_hexcode, 
//         ass.assignation_is_active
//         FROM public.assignation AS ass
//         JOIN employee AS e ON e.employee_number = ass.employee_number
//         WHERE ass.date = $1`, [assignationDate]
//     );
//     return result.rows.map(row => {
//         const assignation = {
//             date: row.ass.date,
//             shift: row.ass.shift,
//             tableNumber: row.ass.table_number, 
//             employeeNumber: row.ass.employee_number, 
//             employeeFirstName: row.e.first_name, 
//             employeeLastName: row.e.last_name,
//             employeeColor: row.e.color_hexcode, 
//             isActive: row.ass.assignation_is_active
//         };
//         return assignation;
//     });
// };
// exports.getAssignationsByDate = getAssignationsByDate;
 
const getAllTables = async () => {
    const result = await pool.query(
        `SELECT * FROM "table"`
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
    console.log(result.rowCount)
    const row = result.rows[0];
    if (row) {
        const table = {
            number: row.number,
            capacity: row.capacity,
            isActive: row.is_active
        }
        console.log("table : " + table)
        return table; 
    } 
    return undefined;
};
exports.getTableByNumber=getTableByNumber;
