const pool = require('./DBPool');

const formatDate = dateTime => {
    return new Date(dateTime).toISOString().split('T')[0];
}

const getAssignationsByDate = async (assignationDate) => {
    const result = await pool.query(
        `SELECT
        ass.id, ass.date, ass.shift, ass.table_number, ass.employee_number, 
        e.first_name, e.last_name, e.color_hexcode, 
        ass.assignation_is_active
        FROM public.assignation AS ass
        JOIN employee AS e ON e.employee_number = ass.employee_number
        WHERE ass.date = $1`, [assignationDate]
    );
    return result.rows.map(row => {
        
        const assignation = {
            id:row.id,
            date: formatDate(row.date),
            shift: row.shift,
            tableNumber: row.table_number, 
            employeeNumber: row.employee_number, 
            employeeFirstName: row.first_name, 
            employeeLastName: row.last_name,
            employeeColor: row.color_hexcode, 
            isActive: row.assignation_is_active
        };
        return assignation;
    });
};
exports.getAssignationsByDate = getAssignationsByDate;

const insertAssignation = async (assignation) =>{
    const result = await pool.query(
        `INSERT INTO assignation (employee_number, table_number, date, shift, assignation_is_active)
            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [assignation.employeeNumber, assignation.tableNumber, assignation.date, assignation.shift, assignation.isActive]
    );
    const row = result.rows[0];

    if (row) {
        return row.id;
    }

    throw new Error("L'insertion a échoué pour une raison inconnue"); 
};
exports.insertAssignation = insertAssignation;

const updateAssignation = async (newAssignation) => {
    const result = await pool.query(
        `UPDATE assignation SET employee_number = $2, table_number = $3, date = $4, shift = $5, assignation_is_active = $6
        WHERE id = $1`,
        [newAssignation.id, newAssignation.employeeNumber, newAssignation.tableNumber, newAssignation.date, newAssignation.shift, newAssignation.isActive]
    );
    if (result.rowCount === 0){
        return undefined
    }
    return getAssignationsByDate(newAssignation.date);
};
exports.updateAssignation = updateAssignation;