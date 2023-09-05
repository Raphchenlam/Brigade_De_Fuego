const pool = require('./DBPool');

const selectAllEmployees = async () => {
    const result = await pool.query(
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

const insertEmployee = async (employeeNumber, firstName, lastName, role, colorHexCode, hourlyRate, barcodeNumber, employeeEmail, phoneNumber, isAdmin, skillPoints, passwordSalt, passwordHash, clientParam) => {
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
    if (row) {
        return {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name,
            role: row.role,
            colorHexCode: row.color_hexcode,
            hourlyRate: row.hourly_rate,
            barcodeNumber: row.barcode_number,
            employeeEmail: row.email,
            phoneNumber: row.phone_number,
            isAdmin: row.is_admin,
            isSuperAdmin: row.is_super_admin,
            isNewEmployee: row.is_new_employee,
            isActive: row.is_active,
            skillPoints: row.skill_points
        };
    }
    return undefined;
};
exports.selectEmployeeByEmployeeNumber = selectEmployeeByEmployeeNumber;

//const getLoginByEmployeeNumber (se référer à getLoginByUserAccountEmail de recettesRodrigo)

//const getEmployeeNumber (verif dans employeeRouter) PAS FAIT

const selectAssignedHexcode = async (colorHexCode) => {
    const result = await pool.query(
        `SELECT color_hexcode
        FROM employee
        WHERE color_hexcode = $1`,
        [colorHexCode]
    );

    const row = result.rows[0];
    if(row){
        return {
            colorHexcode: row.color_hexcode
        };
    }
    return undefined;
};
exports.selectAssignedHexcode = selectAssignedHexcode;

/////   QUERIES connexes à Employee   /////

const selectRoleByName = async (roleName) => {
    const result = await pool.query(
        `SELECT name, team
        'FROM role
        WHERE name = $1`,
        [roleName]
    );

    const row = result.rows[0];
    if(row){
        const roleInfo = {
            roleName: row.name,
            team: row.team
        };
        return roleInfo;
    }
    return undefined;
}
exports.selectRoleByName = selectRoleByName;

// const selectAllRoles = async () => {
//     const result = await pool.query(
//         `SELECT *
//         FROM role`,
//         [roleName]
//     );
//     return result.rows.map(row => {
//         const roleInfo = {
//             role: row.name,
//             team: row.team
//         };
//     });
// }
// exports.selectAllRoles = selectAllRoles;

