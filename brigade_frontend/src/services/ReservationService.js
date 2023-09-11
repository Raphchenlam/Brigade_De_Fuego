// import session from "./session";

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

const convertToReservation = jsonReservation => {
    return {
        id: jsonReservation.id,
        clientId: jsonReservation.clientId,
        tableNumber: jsonReservation.tableNumber,
        statusCode: jsonReservation.statusCode,
        peopleCount: "" + jsonReservation.peopleCount,
        date: jsonReservation.date,
        startTime: jsonReservation.startTime,
        endTime: jsonReservation.endTime,
        mention: jsonReservation.mention,
        hasMinor: jsonReservation.hasMinor,
        takenBy: jsonReservation.takenBy
    };
};

export async function createReservation(reservation) {
    const response = await fetch(`/api/reservation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // ...session.getAuthHeaders()
        },
        body: JSON.stringify(reservation)
    });

    if (response.ok) {
        return convertToReservation(await response.json());
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}