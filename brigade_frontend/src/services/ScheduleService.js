import session from '../sessions/UserSession'

class ServiceError extends Error
{
    constructor(status, message)
    {
        super(message);
        this.status = status;
    }
}

async function getResponseMessage(response)
{
    try
    {
        const obj = await response.json();
        return obj.message ? obj.message : "Erreur inconnue";
    } catch (err)
    {
        return "" + err;
    }
}

async function createServiceError(response)
{
    return new ServiceError(response.status, await getResponseMessage(response));
}

export async function getAllWaitersByDateAndShift(date, shift){
    const response = await fetch(`/api/schedule/${date}/${shift}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            //...session.getAuthHeaders()
        },
    });
    if (response.ok)
    {
        const respJson = await response.json();
        return respJson;
    } else
    {
        throw await createServiceError(response);
    }
}

export async function getScheduleWeekInfoByID(scheduleWeekId)
{
    const response = await fetch(`/api/schedule/${scheduleWeekId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (response.ok)
    {
        const respJson = await response.json();
        return respJson;
    } else
    {
        throw await createServiceError(response);
    }
}

export async function getAllEmployeeScheduleByScheduleWeekId(scheduleWeekId)
{
    const response = await fetch(`/api/schedule/${scheduleWeekId}/employee`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });
    if (response.ok)
    {
        const respJson = await response.json();
        return respJson;
    } else
    {
        throw await createServiceError(response);
    }
}


export async function getAllEventByScheduleWeekId(scheduleWeekId)
{
    const response = await fetch(`/api/schedule/${scheduleWeekId}/event`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });
    if (response.ok)
    {
        const respJson = await response.json();
        return respJson;
    } else
    {
        throw await createServiceError(response);
    }
}

export async function getScheduleForOneEmployeeByEmployeeNumberAndScheduleWeekId(employeeNumber, scheduleWeekId)
{
    const response = await fetch(`/api/schedule/employee/${employeeNumber}/${scheduleWeekId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });
    if (response.ok)
    {
        const respJson = await response.json();
        return respJson;
    } else
    {
        throw await createServiceError(response);
    }
}

export async function updateSchedule(scheduleInformations)
{
    const response = await fetch(`/api/schedule`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(scheduleInformations)
    });

    if (response.ok)
    {
        return await response.json();
    } else
    {
        throw await createServiceError(response);
    }
}