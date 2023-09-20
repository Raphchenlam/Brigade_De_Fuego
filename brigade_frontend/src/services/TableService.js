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

  const convertToSection = jsonSection => {
    return {
        date: "" + jsonSection.date,
        shift: "" + jsonSection.shift,
        tableNumber : Number(jsonSection.tableNumber),
        employeeNumber: "" + jsonSection.employeeNumber,
        employeeFirstName: "" + jsonSection.employeeFirstName,
        employeeLastName: "" + jsonSection.employeeLastName,
        employeeColor: "" + jsonSection.employeeColor,
        isActive: jsonSection.isActive
    };
  };

  const convertToTable = jsonTable =>{
    return {
        number: Number(jsonTable.number),
        capacity: Number(jsonTable.capacity),
        isActive: jsonTable.isActive
    }
  }

  ///**************** SECTIONS ****************///

  export async function fetchSectionByDate(date) {
    const response = await fetch(`/api/section/${date}`);

    if(response.ok) {
        return convertToSection(await response.json());
    }else{
        throw await createServiceError(response);
    }
  }

  ///**************** TABLES ****************///

  export async function fetchAllTables() {
    const response = await fetch(`/api/table/`);

    if(response.ok) {
        const respJson = await response.json();
        return respJson.map(table => convertToTable(table));
    }else{
        throw await createServiceError(response);
    }
  }

  export async function fetchTableByNumber(tableNumber) {
    const response = await fetch(`/api/table/${tableNumber}`);

    if(response.ok) {
        return convertToTable(await response.json());
    }else{
        throw await createServiceError(response);
    }
  }
  
