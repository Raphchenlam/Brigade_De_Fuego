import session from '../sessions/UserSession'
import OpSession from '../sessions/OperationSession'

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


export async function getAllEmployees() {
    const response = await fetch(`/api/employee`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getAllEmployeesByRole(role) {
    const response = await fetch(`/api/employee/role/${role}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function getEmployeeByEmployeeNumber(employeeNumber) {
    const response = await fetch(`/api/employee/${employeeNumber}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw Error(response);
    }
}

export async function getEmployeeByBarcodeNumber(barcodeNumber) {
    const response = await fetch(`/api/employee/barcode/${barcodeNumber}`);

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}
export async function getEmployeeByEmail(email) {
    const response = await fetch(`/api/employee/email/${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw await createServiceError(response);
    }
}

export async function getAllRoles() {
    const response = await fetch(`/api/employee/role`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
    });

    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        throw await createServiceError(response);
    }
}

export async function createEmployee(employee) {
    const response = await fetch(`/api/employee`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(employee)
    });
    if (response.ok)
    {
        return convertToEmployee(await response.json());
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

const convertToEmployee = jsonEmployee => {
    return {
        employeeNumber: "" + jsonEmployee.employeeNumber,
        firstName: "" + jsonEmployee.firstName,
        lastName: "" + jsonEmployee.lastName,
        role: "" + jsonEmployee.role,
        colorHexCode: "" + jsonEmployee.colorHexCode,
        hourlyRate: "" + jsonEmployee.hourlyRate,
        barcodeNumber: "" + jsonEmployee.barcodeNumber,
        email: "" + jsonEmployee.email,
        phoneNumber: "" + jsonEmployee.phoneNumber,
        isAdmin: "" + jsonEmployee.isAdmin,
        isSuperAdmin: "" + jsonEmployee.isSuperAdmin,
        isNewEmployee: "" + jsonEmployee.isNewEmployee,
        isActive: "" + jsonEmployee.isActive,
        skillPoints: "" + jsonEmployee.skillPoints
    };
};

export async function updateEmployeeByAdmin(employee) {
    const response = await fetch(`/api/employee`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(employee)
    });

    if (response.ok) {
        return convertToEmployee(await response.json());
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function updateEmployeeColor(employeeNumber, employeeColor) {
    const response = await fetch(`/api/employee/employeeColor/${employeeNumber}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            //...session.getAuthHeaders(),
        },
        body: JSON.stringify({ employeeColor: employeeColor }),
    });
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}
export async function resetPassword(employeeNumber) {
    const response = await fetch(`/api/employee/lostpassword/${employeeNumber}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const respJson = await response.json();
        return respJson;
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function changeNewEmployeePassword(employeeNumber, newPassword){
    const response = await fetch(`/api/employee/newPassword/${employeeNumber}`, {
        method:"PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify({ password: newPassword})
    });

    if(response.ok){
        const respJson = await response.json();
        return respJson;
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

export async function updateEmployeeByEmployeeProfile(employee, employeeNumber) {
    const response = await fetch(`/api/employee/${employeeNumber}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(employee)
    });

    if (response.ok) {
        return convertToEmployee(await response.json());
    } else {
        console.log(JSON.stringify(response));
        throw await createServiceError(response);
    }
}

