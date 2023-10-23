const pool = require('./DBPool');

const selectLoginByEmployeeNumber = async (employeeNumber, client) =>
{
    const result = await (client || pool).query(
        `SELECT employee_number, first_name, last_name, is_admin, is_super_admin, is_new_employee, is_active, password_salt, password_hash
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
            isAdmin: row.is_admin,
            isSuperAdmin: row.is_super_admin,
            isNewEmployee: row.is_new_employee,
            isActive: row.is_active,
            passwordSalt: row.password_salt,
            passwordHash: row.password_hash
        };
    }
    return undefined;
}
exports.selectLoginByEmployeeNumber = selectLoginByEmployeeNumber;


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
            role: row.role,
            isActive: row.is_active
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
            role: row.role,
            color: row.color_hexcode,
            isActive: row.is_active
        };
        return employee;
    });
};
exports.selectAllEmployeesByRole = selectAllEmployeesByRole;


const insertEmployee = async (newEmployee, passwordSalt, passwordHash, clientParam) =>
{

    const client = clientParam || await pool.connect();

    try
    {
        await client.query('BEGIN');

        const isSuperAdmin = false;
        const isNewEmployee = true;
        const isActive = true;

        const result = await client.query(
            `INSERT INTO employee(
            employee_number, first_name, last_name, role, color_hexcode, hourly_rate, barcode_number, email, phone_number, is_admin, is_super_admin, is_new_employee, is_active, skill_points, password_salt, password_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *;`,
            [newEmployee.employeeNumber, newEmployee.firstName, newEmployee.lastName, newEmployee.role, newEmployee.colorHexCode, newEmployee.hourlyRate, newEmployee.barcodeNumber, newEmployee.email, newEmployee.phoneNumber, newEmployee.isAdmin, isSuperAdmin, isNewEmployee, isActive, newEmployee.skillPoints, passwordSalt, passwordHash]

        );

        const row = result.rows[0];
        if (row)
        {
            const newEmployee = {
                employeeNumber: row.employeeNumber,
                firstName: row.firstName,
                lastName: row.lastName,
                role: row.role,
                colorHexCode: row.colorHexCode,
                hourlyRate: row.hourly_rate,
                barcodeNumber: row.barcodeNumber,
                email: row.email,
                phoneNumber: row.phoneNumber,
                isAdmin: row.is_admin,
                isSuperAdmin: row.is_super_admin,
                isNewEmployee: row.is_new_employee,
                isActive: row.is_active,
                skillPoints: row.skill_points
            };

            client.query('COMMIT');

            return newEmployee;
        }
    } catch (error)
    {
        await client.query("ROLLBACK");
        throw Error;
    } finally
    {
        client.release();
    }
}
exports.insertEmployee = insertEmployee;


const updateEmployee = async (employeeToUpdate, passwordSalt, passwordHash, clientParam) =>
{

    const user = clientParam || await pool.connect();

    if (passwordSalt == "noChange" && passwordHash == "noChange")
    {
        const result = await user.query(
            `UPDATE employee
	        SET first_name=$2, last_name=$3, role=$4, color_hexcode=$5, hourly_rate=$6, barcode_number=$7, email=$8, phone_number=$9, is_admin=$10, is_active=$11, skill_points=$12
	        WHERE employee_number = $1`,
            [employeeToUpdate.employeeNumber, employeeToUpdate.firstName, employeeToUpdate.lastName, employeeToUpdate.role, employeeToUpdate.colorHexCode, employeeToUpdate.hourlyRate, employeeToUpdate.barcodeNumber, employeeToUpdate.email, employeeToUpdate.phoneNumber, employeeToUpdate.isAdmin, employeeToUpdate.isActive, employeeToUpdate.skillPoints]
        );

        if (result.rowCount === 0)
        {
            return undefined;
        }
    } else
    {
        const result = await user.query(
            `UPDATE employee
	        SET first_name=$2, last_name=$3, role=$4, color_hexcode=$5, hourly_rate=$6, barcode_number=$7, email=$8, phone_number=$9, is_admin=$10, is_active=$11, skill_points=$12, password_salt=$13, password_hash=$14
	        WHERE employee_number = $1`,
            [employeeToUpdate.employeeNumber, employeeToUpdate.firstName, employeeToUpdate.lastName, employeeToUpdate.role, employeeToUpdate.colorHexCode, employeeToUpdate.hourlyRate, employeeToUpdate.barcodeNumber, employeeToUpdate.email, employeeToUpdate.phoneNumber, employeeToUpdate.isAdmin, employeeToUpdate.isActive, employeeToUpdate.skillPoints, passwordSalt, passwordHash]
        );

        if (result.rowCount === 0)
        {
            return undefined;
        }

    }
    return selectEmployeeByEmployeeNumber(employeeToUpdate.employeeNumber);
};
exports.updateEmployee = updateEmployee;

const updateEmployeePassword = async (employeeToUpdate, passwordSalt, passwordHash, clientParam) =>
{
    const user = clientParam || await pool.connect();
    const result = await user.query(
        `UPDATE employee
	        SET password_salt=$2, password_hash=$3
	        WHERE employee_number = $1
            RETURNING *`,
        [employeeToUpdate.employeeNumber, passwordSalt, passwordHash]
    );
    if (result.rowCount === 0)
    {
        return undefined;
    }
    return selectUsedEmail(employeeToUpdate.email);
};
exports.updateEmployeePassword = updateEmployeePassword;

const updateEmployeeColorByEmployeeNumber = async (employeeNumber, employeeColor) =>
{

    const result = await pool.query(
        `UPDATE employee SET color_hexcode = $2
            WHERE employee_number = $1`,
        [employeeNumber, employeeColor]
    );
    if (result.rowCount === 0)
    {
        return undefined
    }
    return employeeNumber + employeeColor;
}
exports.updateEmployeeColorByEmployeeNumber = updateEmployeeColorByEmployeeNumber;

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


const selectEmployeeByBarcodeNumber = async (barcodeNumber) =>
{
    const result = await pool.query(
        `SELECT *
        FROM employee
        WHERE barcode_number = $1`,
        [barcodeNumber]
    );

    const row = result.rows[0];
    if (row)
    {
        return {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name,
            role: row.role,
            barcodeNumber: row.barcode_number,
            isAdmin: row.is_admin,
            isSuperAdmin: row.is_super_admin,
        };
    }
    return undefined;
};
exports.selectEmployeeByBarcodeNumber = selectEmployeeByBarcodeNumber;


const selectAssignedColorHexcode = async (colorHexCode) =>
{
    const result = await pool.query(
        `SELECT first_name, last_name, color_hexcode
        FROM employee
        WHERE color_hexcode = $1`,
        [colorHexCode]
    );

    const row = result.rows[0];
    if (row)
    {
        return {
            firstName: row.first_name,
            lastName: row.last_name,
            colorHexcode: row.color_hexcode
        };
    }
    return undefined;
};
exports.selectAssignedColorHexcode = selectAssignedColorHexcode;


const selectUsedPhoneNumber = async (phoneNumber) =>
{
    const result = await pool.query(
        `SELECT first_name, last_name, phone_number
        FROM employee
        WHERE phone_number = $1`,
        [phoneNumber]
    );

    const row = result.rows[0];
    if (row)
    {
        return {
            firstName: row.first_name,
            lastName: row.last_name,
            phoneNumber: row.phone_number
        }

    }
    return undefined;
};
exports.selectUsedPhoneNumber = selectUsedPhoneNumber;


const selectUsedEmail = async (email) =>
{
    const result = await pool.query(
        `SELECT *
        FROM employee
        WHERE email = $1`,
        [email]
    );

    const row = result.rows[0];
    if (row)
    {
        return {
            employeeNumber: row.employee_number,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email
        }
    }
    return undefined;
};

exports.selectUsedEmail = selectUsedEmail;

/////   QUERIES connexes à Employee   /////

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

