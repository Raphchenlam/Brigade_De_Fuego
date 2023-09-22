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

  const convertToAssignation = jsonAssignation => {
    return {
        date: "" + jsonAssignation.date,
        shift: "" + jsonAssignation.shift,
        tableNumber : "" + jsonAssignation.tableNumber,
        employeeNumber: "" + jsonAssignation.employeeNumber,
        employeeFirstName: "" + jsonAssignation.employeeFirstName,
        employeeLastName: "" + jsonAssignation.employeeLastName,
        employeeColor: "" + jsonAssignation.employeeColor,
        isActive: jsonAssignation.isActive
    };
  };

  const convertToTable = jsonTable =>{
    return {
        number: "" + jsonTable.number,
        capacity: Number(jsonTable.capacity),
        isActive: jsonTable.isActive,
        isAssign: false
    }
  }

  ///**************** AssignationS ****************///

  export async function fetchAssignationByDate(date) {
    const response = await fetch(`/api/assignation/${date}`);

    if(response.ok) {
      const respJson = await response.json();
        return respJson.map(assignation => convertToAssignation(assignation));
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
  
