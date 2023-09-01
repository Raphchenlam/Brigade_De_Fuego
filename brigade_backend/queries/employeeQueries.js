const pool = require('./DBPool');
const HttpError = require('../HttpError');

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

const insertEmployee = async(employeeNumber, firstName, lastName, role, hourlyRate, barcodeNumber, employeeEmail, phoneNumber, isAdmin, skillPoints, passwordSalt, passwordHash, clientParam) => {
    const client = clientParam || await pool.connect();

    try {
        if(!clientParam){
            await client.query("BEGIN")
        }
        await client.query(
            `INSERT INTO employee(
                employee_number, first_name, last_name, role, color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_points, password_salt, password_hash)
                VALUES ($1, $2, $3, $4, #ffffff, $6, $7, $8, $9, $10, false, true, true, $11, $12, $13)`,
                [employeeNumber, firstName, lastName, role, hourlyRate, barcodeNumber, employeeEmail, phoneNumber, isAdmin, skillPoints, passwordSalt, passwordHash]
        );

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
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
        };
    }
    return undefined;
};

exports.selectEmployeeByEmployeeNumber = selectEmployeeByEmployeeNumber