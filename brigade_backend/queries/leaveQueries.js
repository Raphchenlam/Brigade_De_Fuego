const pool = require('./DBPool');

const selectAllLeaves = async () => {
    const result = await pool.query(
        `SELECT leave.*, employee.first_name, employee.last_name
        FROM leave
        JOIN employee ON employee.employee_number = leave.employee_number
        ORDER BY leave.start_date`
    );

    return result.rows.map(row => {
        const leave = {
            id: row.id,
            employeeNumber: row.employee_number,
            employeeName: row.first_name + " " + row.last_name,
            startDate: row.start_date,
            endDate: row.end_date,
            category: row.category,
            reason: row.reason,
            status: row.status
        };
        return leave;
    });
};
exports.selectAllLeaves = selectAllLeaves;

const selectLeavesByEmployeeNumber  = async (employeeNumber) => {
    const result = await pool.query(
        `SELECT leave.*, employee.first_name, employee.last_name
        FROM leave
        JOIN employee ON employee.employee_number = leave.employee_number
        WHERE leave.employee_number = $1`,
        [employeeNumber]
    );

    return result.rows.map(row => {
        const leave = {
            id: row.id,
            employeeName: row.first_name + " " + row.last_name,
            employeeNumber: row.employee_number,
            startDate: row.start_date,
            endDate: row.end_date,
            category: row.category,
            reason: row.reason,
            status: row.status
        };
        return leave;
    });
};
exports.selectLeavesByEmployeeNumber = selectLeavesByEmployeeNumber;