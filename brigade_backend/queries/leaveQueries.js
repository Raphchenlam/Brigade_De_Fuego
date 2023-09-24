const pool = require('./DBPool');

const selectAllLeaves = async () =>
{
    const result = await pool.query(
        `SELECT leave.*, employee.first_name, employee.last_name
        FROM leave
        JOIN employee ON employee.employee_number = leave.employee_number
        ORDER BY leave.start_date`
    );

    return result.rows.map(row =>
    {
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

const selectAllFilteredLeaves = async (checkboxes) =>
{
    console.log("checkboxes recu", checkboxes)
    const today = new Date().toISOString();

    let query = `SELECT leave.*, employee.first_name, employee.last_name
    FROM leave
    JOIN employee ON employee.employee_number = leave.employee_number`;

    let conditions = [];

    if (checkboxes.accepted) conditions.push(`leave.status = 'Approved'`);
    if (checkboxes.refused) conditions.push(`leave.status = 'Refused'`);
    if (checkboxes.pending) conditions.push(`leave.status = 'Pending'`);
    if (checkboxes.pendingModified) conditions.push(`leave.status = 'PendingModified'`);

    if (conditions.length > 0)
    {
        query += ` WHERE (${conditions.join(' OR ')}`;
        query += `)`;

        if (checkboxes.coming && checkboxes.passed)
        {
            // Aucune condition WHERE nécessaire si les deux cases sont cochées
        } else if (checkboxes.coming)
        {
            query += ` AND leave.start_date >= CURRENT_DATE`;
        } else if (checkboxes.passed)
        {
            query += ` AND leave.start_date <= CURRENT_DATE`;
        }
    } else
    {
        if (checkboxes.coming && checkboxes.passed)
        {
            // Aucune condition WHERE nécessaire si les deux cases sont cochées
        } else if (checkboxes.coming)
        {
            query += ` WHERE leave.start_date >= CURRENT_DATE`;
        } else if (checkboxes.passed)
        {
            query += ` WHERE leave.start_date <= CURRENT_DATE`;
        }
    }

    query += ` ORDER BY leave.start_date`;

    console.log("query", query)
    let result;

    result = await pool.query(query);

    if (!result) return [];

    return result.rows.map(row =>
    {
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
exports.selectAllFilteredLeaves = selectAllFilteredLeaves;


const selectLeavesByEmployeeNumber = async (employeeNumber) =>
{
    const result = await pool.query(
        `SELECT leave.*, employee.first_name, employee.last_name
        FROM leave
        JOIN employee ON employee.employee_number = leave.employee_number
        WHERE leave.employee_number = $1`,
        [employeeNumber]
    );

    return result.rows.map(row =>
    {
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