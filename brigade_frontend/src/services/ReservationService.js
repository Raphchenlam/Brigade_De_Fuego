import session from "../sessions/OperationSession.js";

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
}

export async function createReservation(reservation) {
    const response = await fetch(`/api/reservation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(reservation)
    });

    if (response.ok) {
        return convertToReservation(await response.json());
    } else {
        console.info(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function updateReservation(reservation) {
    const response = await fetch(`/api/reservation`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(reservation)
    });

    if (response.ok) {
        return convertToReservation(await response.json());
    } else {
        console.info(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function getReservationStatusList(startDate, endDate) {
    const response = await fetch(`/api/reservation/statusList`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.info(JSON.stringify(response));
        throw await createServiceError(response);
    }
}


export async function getReservationList(startDate, endDate) {
    const response = await fetch(`/api/reservation/${startDate}/${endDate}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.info(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function getReservationById(reservationId) {
    const response = await fetch(`/api/reservation/${reservationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.info(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function updateTableOnReservationById(id, tableNumber) {
    const response = await fetch(`/api/reservation/${id}/table/${tableNumber}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        }
    })
    if (response.ok) {
        return convertToReservation(await response.json());
      } else {
        console.log(response.status)
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
      }
}

export async function getHowManyPeopleByDateAndShiftName(date, shiftName) {
    const response = await fetch(`/api/reservation/expectedpeople/${date}/${shiftName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}