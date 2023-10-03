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


export async function createLeave(leave) {
    const response = await fetch(`/api/leave`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
             ...session.getAuthHeaders()
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

export async function getAllLeaves() {
    const response = await fetch(`/api/leave`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getAllFilteredLeaves(checkboxes)
{
    const queryString = `?data=${encodeURIComponent(JSON.stringify(checkboxes))}`;
    const url = '/api/leave/filter/' + queryString;
    console.log("url2",url)
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getleavesByEmployeeNumber(employeeNumber)
{

    const response = await fetch(`/api/leave/employee/${employeeNumber}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    });

    if (response.ok) {
        
       const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}



export async function getAllLeavesCategory() {
    const response = await fetch(`/api/leave/category`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}