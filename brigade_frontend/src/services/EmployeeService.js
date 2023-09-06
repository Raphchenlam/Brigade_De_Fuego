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

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}