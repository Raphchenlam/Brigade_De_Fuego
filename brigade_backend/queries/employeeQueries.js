const pool = require('./DBPool');

const selectAllEmployees = async() => {
    const result = await pool.query (
        `SELECT * from employee
        ORDER BY first_name`
    );

    return result.rows.map(row => {
        const employee = {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name
        };
        return employee;
    });
};
exports.selectAllEmployees = selectAllEmployees;

const insertEmployee = async(employeeNumber, firstName, lastName, role, colorHexCode, hourlyRate, barcodeNumber, employeeEmail, phoneNumber, isAdmin, skillPoints, passwordSalt, passwordHash, clientParam) => {
    const client = clientParam || await pool.connect();

    await client.query(
        `INSERT INTO employee(
            employee_number, first_name, last_name, role, color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_points, password_salt, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false, true, true, $11, $12, $13)`,
            [employeeNumber, firstName, lastName, role, colorHexCode, hourlyRate, barcodeNumber, employeeEmail, phoneNumber, isAdmin, skillPoints, passwordSalt, passwordHash]
    );
};

exports.insertEmployee = insertEmployee;

const selectEmployeeByEmployeeNumber = async (employeeNumber) => {
    const result = await pool.query(
        `SELECT employee_number, first_name, last_name, barcode_number
        FROM employee
        WHERE employee_number = $1`,
        [employeeNumber]
    );

    const row = result.rows[0];
    if (row){
        return {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name,
            barcodeNumber: row.barcode_number
            //mettre tous les infos
        };
    }
    return undefined;
};

//const getLoginByEmployeeNumber (se référer à getLoginByUserAccountEmail de recettesRodrigo)

exports.selectEmployeeByEmployeeNumber = selectEmployeeByEmployeeNumber