const pool = require('./DBPool');

const changeDateFormat = dateTime => {
    const tempFormat = new Date(dateTime).toLocaleDateString('en-GB');
    const parts = tempFormat.split('/');
    if(parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
    } else {
        throw new Error('Invalid date format. Expected format: dd-mm-yyyy');
    }
};

const explodingTime = time => {
    return {
        hour: parseInt(time.split(':').slice(0)[0]),
        minute: parseInt(time.split(':').slice(0)[1])
    }
}
exports.explodingTime = explodingTime;


const explodingDate = date => {
    return {
        year: parseInt(date.split('-').slice(0)[0]),
        month: parseInt(date.split('-').slice(0)[1]),
        day: parseInt(date.split('-').slice(0)[2])
    }
}
exports.explodingDate = explodingDate;


// const selectAllPunchs = async () => {
//     const result = await pool.query (
//         `SELECT *
//         FROM punch
//         ORDER BY date_in DESC`
//     );

//     if(result){
//        return result.rows.map((row) => {
//             const employeePunch = {
//                 id: row.id,
//                 employeeNumber: row.employee_number,
//                 dateIn: truncateDate(row.date_in),
//                 startTime: row.punch_in,
//                 dateOut: truncateDate(row.date_out),
//                 endTime: row.punch_out
//             };
//             return employeePunch;
//         });
//     }
//     return undefined;
// }
// exports.selectAllPunchs = selectAllPunchs;

const selectAllPunchsFromDateIn = async(dateIn) => {
    const result = await pool.query(
        `SELECT punch.*, employee.first_name, employee.last_name
        FROM punch
        JOIN employee ON employee.employee_number = punch.employee_number 
        WHERE date_in = $1`,
        [dateIn]
    );

    if(result){
        return result.rows.map((row) => {
            
            let dateOut = row.date_out;
            if(row.date_out){
                dateOut = changeDateFormat(row.date_out);
            }

             const employeePunch = {
                 id: row.id,
                 employeeNumber: row.employee_number,
                 employeeFullName: row.first_name + " " + row.last_name,
                 dateIn: changeDateFormat(row.date_in),
                 startTime: row.punch_in,
                 dateOut: dateOut,
                 endTime: row.punch_out
             };
             return employeePunch;
         });
     }
     return ({message: 'Aucun employé s\'est punché à cette date-ci'});
}

exports.selectAllPunchsFromDateIn = selectAllPunchsFromDateIn;

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
            dateIn: truncateDate(row.date_in),
            startTime: row.punch_in,
            dateOut: truncateDate(row.date_out),
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
