//import session from "./session";

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

const convertToEvent = jsonEvent => {
  return {
    id: + jsonEvent.id,
    name: "" + jsonEvent.name,
    eventType: "" + jsonEvent.eventType,
    impact: jsonEvent.impact,
    isActive: jsonEvent.isActive
  };
};

const convertEventType = jsonEventType => {
  return jsonEventType.name;
}

export async function fetchAllEvents() {
  const response = await fetch("/api/event");

  if (response.ok) {
    const responseJson = await response.json();
    return responseJson.map(event => convertToEvent(event));
  } else {
    throw await createServiceError(response);
  }
};

export async function fetchEventByName(eventName) {
  const response = await fetch(`/api/event/${eventName}`);

  if (response.ok) {
    if (response.status == 206) {
      return undefined
    } else {
      return convertToEvent(await response.json());
    }
  } else {
    throw await createServiceError(response);
  }
}


export async function fetchAllEventType() {

  try {
    const response = await fetch(`/api/event/eventType`, {
      method: "GET",
      headers: {
        // ...session.getAuthHeaders()
      }
    });

    if (response.ok) {
      const respJson = await response.json();
      return respJson.map(e => convertEventType(e));
    } else {
      throw await createServiceError(response);
    }
  } catch (err) {
    console.log(err)
  }

};

export async function createEvent(event) {

  const existingEvent = fetchEventByName(event.name);

  if (existingEvent) {
    return existingEvent;
  } else {
    const response = await fetch(`/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //...session.getAuthHeaders()
      },
      body: JSON.stringify(event)
    });

    if (response.ok) {
      return convertToEvent(await response.json());
    } else {
      throw await createServiceError(response);
    }
  }

}

// export async function createEvent(event) {

//   const response = fetch(`/api/event`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       //...session.getAuthHeaders()
//     },
//     body: JSON.stringify(event)
//   });

//   if (response.ok) {
//     return convertToEvent(await response.json());
//   } else {
//     throw await createServiceError(response);
//   }

// }