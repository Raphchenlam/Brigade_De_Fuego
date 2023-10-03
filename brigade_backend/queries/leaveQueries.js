const pool = require('./DBPool');
/*
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
*/

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

    const resultNbPending = await pool.query(`SELECT COUNT(*) AS nb_pending
    FROM leave
    JOIN employee ON employee.employee_number = leave.employee_number
    WHERE leave.status = 'Pending' OR leave.status = 'PendingModified'`)

    nbPending = resultNbPending.rows[0].nb_pending;

    let resultFinal = result.rows.map(row =>
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
    resultFinal.push({nbPending: parseInt(nbPending)});
    return resultFinal;
};
exports.selectAllFilteredLeaves = selectAllFilteredLeaves;


const selectLeavesByEmployeeNumber = async (employeeNumber) =>
{
    const result = await pool.query(
        `SELECT leave.*, employee.first_name, employee.last_name
        FROM leave
        JOIN employee ON employee.employee_number = leave.employee_number
        WHERE leave.employee_number = $1
        AND leave.start_date >= CURRENT_DATE`,
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

const selectAllLeavesCategory = async () =>
{
    const result = await pool.query(
        `SELECT *
        FROM leave_category
        ORDER BY name ASC`
    );

    return result.rows.map(row =>
    {
        const leaveCategory = {
            name: row.name,
        };
        return leaveCategory;
    });
};
exports.selectAllLeavesCategory = selectAllLeavesCategory;



const insertLeave = async (newLeave) => {
    const result = await pool.query(
        `INSERT INTO leave
        (employee_number, "start_date", end_date, category, reason, "status")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [newLeave.employeeNumber, newLeave.startDate, newLeave.endDate, newLeave.category, newLeave.reason, newLeave.status]);

    const row = result.rows[0];

    if (row) {

        const reservation = {
            employeeNumber: row.employee_number,
            startDate: row.start_date,
            endDate: row.end_date,
            category: row.category,
            reason: row.reason,
            status: 'Pending'
        };

        return reservation;
    }

    throw new Error("L'insertion a échoué pour une raison inconnue");
};
exports.insertLeave = insertLeave;