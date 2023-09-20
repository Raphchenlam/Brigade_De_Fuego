const pool = require('./DBPool');

const formatDate = dateTime => {
    return new Date(dateTime).toISOString().split('T')[0];
}

const getAssignationsByDate = async (assignationDate) => {
    const result = await pool.query(
        `SELECT
        ass.date, ass.shift, ass.table_number, ass.employee_number, 
        e.first_name, e.last_name, e.color_hexcode, 
        ass.assignation_is_active
        FROM public.assignation AS ass
        JOIN employee AS e ON e.employee_number = ass.employee_number
        WHERE ass.date = $1`, [assignationDate]
    );
    return result.rows.map(row => {
        
        const assignation = {
            date: formatDate(row.date),
            shift: row.shift,
            tableNumber: row.table_number, 
            employeeNumber: row.employee_number, 
            employeeFirstName: row.first_name, 
            employeeLastName: row.last_name,
            employeeColor: row.color_hexcode, 
            isActive: row.assignation_is_active
        };
        console.log(assignation);
        return assignation;
    });
};
exports.getAssignationsByDate = getAssignationsByDate;