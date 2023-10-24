const pool = require('./DBPool');

const selectAllFilteredLeaves = async (checkboxes) =>
{
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
            query += ` AND (leave.start_date >= CURRENT_DATE OR leave.end_date >= CURRENT_DATE)`;
        } else if (checkboxes.passed)
        {
            query += ` AND (leave.start_date < CURRENT_DATE AND leave.end_date <= CURRENT_DATE)`;
        }
    } else
    {
        if (checkboxes.coming && checkboxes.passed)
        {
            // Aucune condition WHERE nécessaire si les deux cases sont cochées
        } else if (checkboxes.coming)
        {
            query += ` WHERE (leave.start_date >= CURRENT_DATE OR leave.end_date >= CURRENT_DATE)`;
        } else if (checkboxes.passed)
        {
            query += ` WHERE (leave.start_date < CURRENT_DATE AND leave.end_date <= CURRENT_DATE)`;
        }
    }

    query += ` ORDER BY leave.start_date`;

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
    resultFinal.push({ nbPending: parseInt(nbPending) });
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
        AND (leave.start_date >= CURRENT_DATE OR leave.end_date >= CURRENT_DATE)
        ORDER BY leave.start_date`,
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

const selectApprovedLeavesByEmployeeNumberAndDate = async (employeeNumber,date) =>
{
    const result = await pool.query(
        `SELECT *
        FROM leave
        WHERE leave.employee_number = $1
        AND leave.start_date <= $2
        AND leave.end_date >= $2
        AND status = 'Approved'`,
        [employeeNumber,date]
    );

    const row = result.rows[0];

    if (!row) return [];

    return result.rows.map(row =>
    {
        const leave = {
            id: row.id,
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
exports.selectApprovedLeavesByEmployeeNumberAndDate = selectApprovedLeavesByEmployeeNumberAndDate;


const selectCurrentLeaveByEmployeeNumber = async (employeeNumber) =>
{
    const result = await pool.query(
        `SELECT * FROM leave
        WHERE employee_number = $1
        AND start_date <= CURRENT_DATE
        AND end_date >= CURRENT_DATE
        AND status = 'Approved'
        ORDER BY start_date
        LIMIT 1`,
        [employeeNumber]
    );
    const row = result.rows[0];
    if (row)
    {
        const leave = {
            id: row.id,
            employeeNumber: row.employee_number,
            startDate: row.start_date,
            endDate: row.end_date,
            category: row.category,
            reason: row.reason,
            status: row.status
        };
        return leave;
    }
    return undefined
    
};
exports.selectCurrentLeaveByEmployeeNumber = selectCurrentLeaveByEmployeeNumber;

const selectLeaveByID = async (leaveID) =>
{
    const result = await pool.query(
        `SELECT *
        FROM leave
        WHERE id = $1`,
        [leaveID]
    );
    const row = result.rows[0];
    if (row)
    {
        const leave = {
            id: row.id,
            employeeNumber: row.employee_number,
            startDate: row.start_date,
            endDate: row.end_date,
            category: row.category,
            reason: row.reason,
            status: row.status
        };
        return leave;
    }
    return undefined
    
};
exports.selectLeaveByID = selectLeaveByID;


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



const insertLeave = async (newLeave) =>
{
    const result = await pool.query(
        `INSERT INTO leave
        (employee_number, "start_date", end_date, category, reason, "status")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [newLeave.employeeNumber, newLeave.startDate, newLeave.endDate, newLeave.category, newLeave.reason, newLeave.status]);

    const row = result.rows[0];

    if (row)
    {

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


const updateLeave = async (leave) =>
{
    const result = await pool.query(
        `UPDATE leave
	        SET start_date=$2, end_date=$3, category=$4, reason=$5, status=$6 
	        WHERE id = $1
            RETURNING *`,
        [leave.id, leave.startDate, leave.endDate, leave.category, leave.reason, leave.status]
    );

    if (result.rowCount === 0)
    {
        return undefined;
    }
    return result.rows[0];
};
exports.updateLeave = updateLeave;