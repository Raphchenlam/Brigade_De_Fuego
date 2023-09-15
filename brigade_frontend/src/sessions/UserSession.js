import { reactive } from "vue";

class AuthError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const session = reactive({
    employee: null,
    employeeNumber: null,
    password: null,

    initialize() {
        if (sessionStorage.employeeNumber) {
            this.employeeNumber = sessionStorage.employeeNumber;
        }
        if (sessionStorage.password) {
            this.password = sessionStorage.password;
        }
        if (this.employee == null && this.employeeNumber != null) {
            this.fetchEmployee().catch(err => console.error("L'authentification initiale a échouée: ", err));
        }
    },
    login(employeeNumber, password) {
        this.setCredentials(employeeNumber, password);
        return this.fetchEmployee();
    },
    setCredentials(employeeNumber, password) {
        this.employeeNumber = employeeNumber;
        sessionStorage.employeeNumber = employeeNumber;
        this.password = password;
        sessionStorage.password = password;
    },
    clearCredentials() {
        this.employeeNumber = null;
        sessionStorage.removeItem('employeeNumber');
        this.password = null;
        sessionStorage.removeItem('password');
    },
    disconnect() {
        this.employee = null;
        this.clearCredentials();
    },
    async fetchEmployee() {
        const response = await fetch("/api/login", {
            method: "GET",
            headers: {
                ... this.getAuthHeaders()
            }
        });

        if (response.ok) {
            const employee = await response.json();
            this.employee = employee;
            return employee;
        } else {
            this.employee = null;
            if (response.status === 401) {
                throw new AuthError(response.status, "Numéro d'employé ou mot de passe incorrect");
            } else {
                throw new AuthError(response.status, "Erreur lors de l'authentification: " + response.status);
            }
        }
    },
    getAuthHeaders() {
        if (this.employeeNumber) {
            return {
                "Authorization": "Basic " + btoa(this.employeeNumber + ":" + this.password),
                "X-Requested-With": "XMLHttpRequest"
            };
        } else {
            return {};
        }
    }
});

export default session;

session.initialize();