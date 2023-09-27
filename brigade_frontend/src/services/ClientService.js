import session from '../sessions/OperationSession'

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

const convertToClient = jsonClient => {
    return {
        id: jsonClient.id,
        firstName: jsonClient.firstName,
        lastName: jsonClient.lastName,
        phoneNumber: "" + jsonClient.phoneNumber,
        allergy: jsonClient.allergy,
        isFavorite: jsonClient.isFavorite,
        isBlacklisted: jsonClient.isBlacklisted
    };
};

export async function getClientById(id) {
    const response = await fetch(`/api/client/${id}`);
    if (response.ok) {
        return await response.json();
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function getClientList()
{

    const queryString = `?data=${encodeURIComponent(JSON.stringify(session.employee))}`;
    const url = '/api/client/' + queryString;
    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function createClient(client) {
    const response = await fetch(`/api/client`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // ...session.getAuthHeaders()
        },
        body: JSON.stringify(client)
    });

    if (response.ok) {
        return convertToClient(await response.json());
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}