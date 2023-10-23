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
            id: row.id,
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

const insertAssignation = async (assignations) => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        let assignationList = [];
        const previousAssignations = await getAssignationsByDate(assignations[0].date)

        if (previousAssignations.length>0) {
            await deleteAssignationsByDateAndShift(assignations[0].date, assignations[0].shift);
        }

        for (const assignation of assignations) {
                const result = await pool.query(
                    `INSERT INTO assignation (employee_number, table_number, date, shift, assignation_is_active)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [assignation.employeeNumber, assignation.tableNumber, assignation.date, assignation.shift, assignation.isActive]
                );
                const row = result.rows[0];

                if (row) {
                    const newAssignation = {
                        id: row.id,
                        employeeNumber: row.employeeNumber,
                        tableNumber: row.tableNumber,
                        date: row.date,
                        shift: row.shift,
                        isActive: row.isActive
                    }
                    assignationList.push(newAssignation)
                }
        };
        client.query('COMMIT');

        return assignationList;

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        throw error;
    } finally {
        client.release();
    }

};
exports.insertAssignation = insertAssignation;

const updateAssignation = async (newAssignation) => {
    const result = await pool.query(
        `UPDATE assignation SET employee_number = $2, table_number = $3, date = $4, shift = $5, assignation_is_active = $6
        WHERE id = $1`,
        [newAssignation.id, newAssignation.employeeNumber, newAssignation.tableNumber, newAssignation.date, newAssignation.shift, newAssignation.isActive]
    );
    if (result.rowCount === 0) {
        return undefined
    }
    return getAssignationsByDate(newAssignation.date);
};
exports.updateAssignation = updateAssignation;

const deleteAssignationsByDateAndShift = async (selectedDate, shift) => {
    const result = await pool.query(
        `DELETE FROM assignation WHERE date = $1 AND shift = $2`,
        [selectedDate, shift]
    )
    if(result.rowCount>0){
        console.info("Suppression réussie")
        return result.rowCount
    }
};
exports.deleteAssignationsByDateAndShift=deleteAssignationsByDateAndShift;