const pool = require('./DBPool');
const HttpError = require('../HttpError');

const getAllEmployees = async() => {
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
exports.getAllEmployees = getAllEmployees;

const createEmployee = async(firstName, lastName, role, employeeEmail, skillpoint) => {
    const client = await pool.connect();

    try {
        const existingEmployee = await getLoginByEmployeeEmail(employeeEmail)
    } catch (error) {
        
    } finally {
        client.release();
    }
    
}