import session from '../sessions/UserSession';

class ServiceError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

async function getResponseMessage(response) {
    try {
        const obj = await response.json();
        return obj.message ? obj.message : "Erreur inconnue";
    } catch (err) {
        return "" + err;
    }
}

async function createServiceError(response) {
    return new ServiceError(response.status, await getResponseMessage(response));
}


export async function getAllEmployees() {
    const response = await fetch(`/api/employee`);

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getAllEmployeesByRole(role) {
    const response = await fetch(`/api/employee/role/${role}`);
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getEmployeeByEmployeeNumber(employeeNumber) {
    const response = await fetch(`/api/employee/${employeeNumber}`);
console.log("response:",response)
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw Error(response);
    }
}
export async function getEmployeeByBarcodeNumber(barcodeNumber) {
    const response = await fetch(`/api/employee/${barcodeNumber}`);

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw Error(response);
    }
}

export async function getAllRoles() {
    const response = await fetch(`/api/employee/role`);

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function createEmployee(employee) {
    const response = await fetch(`/api/employee`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // ...session.getAuthHeaders()
        },
        body: JSON.stringify(employee)
    });

    console.log('FETCH RESPONSE', response);

    if (response.ok) {
        return convertToEmployee(await response.json());
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

const convertToEmployee = jsonEmployee => {
    return {
        employeeNumber: "" + jsonEmployee.employeeNumber,
        firstName: "" + jsonEmployee.firstName,
        lastName: "" + jsonEmployee.lastName,
        role: "" + jsonEmployee.role,
        colorHexCode: "" + jsonEmployee.colorHexCode,
        hourlyRate: "" + jsonEmployee.hourlyRate,
        barcodeNumber: "" + jsonEmployee.barcodeNumber,
        email: "" + jsonEmployee.email,
        phoneNumber: "" + jsonEmployee.phoneNumber,
        isAdmin: "" + jsonEmployee.isAdmin,
        isSuperAdmin: "" + jsonEmployee.isSuperAdmin,
        isNewEmployee: "" + jsonEmployee.isNewEmployee,
        isActive: "" + jsonEmployee.isActive,
        skillPoints: "" + jsonEmployee.skillPoints
    };
};