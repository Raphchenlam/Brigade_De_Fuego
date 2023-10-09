import operationSession from '../sessions/OperationSession';
import userSession from '../sessions/UserSession';

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


export async function punchInEmployee(punch) {
    const response = await fetch(`/api/punch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...operationSession.getAuthHeaders()
        },
        body: JSON.stringify(punch)
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function punchOutEmployee(punch) {
    const response = await fetch(`/api/punch`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...operationSession.getAuthHeaders()
        },
        body: JSON.stringify(leave)
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function getAllPunchs() {
    const response = await fetch(`/api/punch`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...userSession.getAuthHeaders()
        }
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getPunchListByDate(date) {
    const response = await fetch(`/api/punch/${date}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...userSession.getAuthHeaders()
        }
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getPunchListByEmployeeNumber(employeeNumber) {
    const response = await fetch(`/api/punch/${employeeNumber}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...userSession.getAuthHeaders()
        }
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

