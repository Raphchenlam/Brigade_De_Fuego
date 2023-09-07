const pool = require('./DBPool');

const selectAllEmployees = async () =>
{
    const result = await pool.query(
        `SELECT * from employee
        ORDER BY first_name`
    );

    return result.rows.map(row =>
    {
        const employee = {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name,
            role: row.role
        };
        return employee;
    });
};
exports.selectAllEmployees = selectAllEmployees;

const selectAllEmployeesByRole = async (role) =>
{
    const result = await pool.query(
        `SELECT * from employee
        WHERE role = $1
        ORDER BY first_name`,
        [role]
    );

    return result.rows.map(row =>
    {
        const employee = {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name,
            role: row.role
        };
        return employee;
    });
};
exports.selectAllEmployeesByRole = selectAllEmployeesByRole;

const insertEmployee = async (newEmployee, clientParam) =>
{
    const client = clientParam || await pool.connect();

    const isSuperAdmin = false;
    const isNewEmployee = true;
    const isActive = true;

    await client.query(
        `INSERT INTO employee(
            employee_number, first_name, last_name, role, color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_points, password_salt, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [newEmployee.employeeNumber, newEmployee.firstName, newEmployee.lastName, newEmployee.role, newEmployee.colorHexCode, newEmployee.hourlyRate, newEmployee.barcodeNumber, newEmployee.employeeEmail, newEmployee.phoneNumber, newEmployee.isAdmin, isSuperAdmin, isNewEmployee, isActive, newEmployee.skillPoints, newEmployee.passwordSalt, newEmployee.passwordHash]
    );
};

exports.insertEmployee = insertEmployee;

const selectEmployeeByEmployeeNumber = async (employeeNumber) =>
{
    const result = await pool.query(
        `SELECT *
        FROM employee
        WHERE employee_number = $1`,
        [employeeNumber]
    );

    const row = result.rows[0];
    if (row)
    {
        return {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name,
            role: row.role,
            colorHexCode: row.color_hexcode,
            hourlyRate: row.hourly_rate,
            barcodeNumber: row.barcode_number,
            email: row.email,
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

const selectAssignedColorHexcode = async (colorHexCode) =>
{
    const result = await pool.query(
        `SELECT color_hexcode
        FROM employee
        WHERE color_hexcode = $1`,
        [colorHexCode]
    );

    const row = result.rows[0];
    if (row)
    {
        return {
            colorHexcode: row.color_hexcode
        };
    }
    return undefined;
};
exports.selectAssignedColorHexcode = selectAssignedColorHexcode;

/////   QUERIES connexes à Employee   /////

// Cette querie sert a quoi exactement ?
const selectRoleByName = async (roleName) =>
{
    const result = await pool.query(
        `SELECT name, team
        FROM role
        WHERE name = $1`,
        [roleName]
    );

    const row = result.rows[0];
    if (row)
    {
        const roleInfo = {
            roleName: row.name,
            team: row.team
        };
        return roleInfo;
    }
    return undefined;
}
exports.selectRoleByName = selectRoleByName;

const selectAllRoles = async () =>
{
    const result = await pool.query(
        `SELECT *
         FROM role`,
    );
    return result.rows.map(row =>
    {
        const roleInfo = {
            name: row.name,
            team: row.team
        };
        return roleInfo;
    });
}
exports.selectAllRoles = selectAllRoles;

