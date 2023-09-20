// import session from "./session";

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
    const response = await fetch(`/api/schedule/${scheduleWeekId}`);
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
    const response = await fetch(`/api/schedule/${scheduleWeekId}/employee`);
    if (response.ok)
    {
        const respJson = await response.json();
        return respJson;
    } else
    {
        throw await createServiceError(response);
    }
}
