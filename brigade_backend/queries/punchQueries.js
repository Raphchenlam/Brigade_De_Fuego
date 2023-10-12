const pool = require('./DBPool');

const selectLastPunchOfEmployee = async (employeeNumber) => {
    const result = await pool.query(
        `SELECT *
        FROM punch
        WHERE employee_number = $1
        ORDER BY id DESC
        LIMIT 1;`,
        [employeeNumber]
    );

    const row = result.rows[0];
    if (row) {
        return {
            employeeNumber: row.employee_number,
            dateIn: row.date_in,
            startTime: row.punch_in,
            dateOut: row.date_out,
            endTime: row.punch_out
        };
    }
    return {
        noShift: "Pas encore de quart(s) de travail à son actif"
    };
};
exports.selectLastPunchOfEmployee = selectLastPunchOfEmployee;



const insertEmployeePunchIn = async (punchIn) => {
    const result = await pool.query(
        `INSERT INTO punch(employee_number, date_in, punch_in)
            VALUES ($1, $2, $3)
            RETURNING *;`,
        [punchIn.employeeNumber, punchIn.dateIn, punchIn.startTime]
    );

    const row = result.rows[0];
    if (row) {
        const newEmployeePunchIn = {
            employeeNumber: row.employee_number,
            dateIn: row.date_in,
            startTime: row.punch_in,
            dateOut: row.date_out,
            endTime: row.punch_out
        };

        return newEmployeePunchIn;
    }
    return undefined
}
exports.insertEmployeePunchIn = insertEmployeePunchIn;

const updateEmployeePunchOut = async (punchOut) => {
    const result = await pool.query(
        `UPDATE punch
        SET date_out=$4, punch_out=$5
        WHERE employee_number=$1 AND date_in=$2 AND punch_in=$3
        RETURNING*;`,
        [punchOut.employeeNumber, punchOut.dateIn, punchOut.startTime, punchOut.dateOut, punchOut.endTime]
    );

    const row = result.rows[0];
    if (row) {
        const newEmployeePunchOut = {
            employeeNumber: row.employee_number,
            dateIn: row.date_in,
            startTime: row.punch_in,
            dateOut: row.date_out,
            endTime: row.punch_out
        };

        return newEmployeePunchOut;
    }
    return undefined;
}

exports.updateEmployeePunchOut = updateEmployeePunchOut;
