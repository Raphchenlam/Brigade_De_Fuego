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


export async function getScheduleWeekInfoByID(scheduleWeekId)
{
    const response = await fetch(`/api/schedule/${scheduleWeekId}`, {
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

export async function getEmployeeScheduleByScheduleWeekId(scheduleWeekId)
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

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}