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
            this.employee = sessionStorage.employeeNumber;
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
        return this.fetchUser();
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
            this.user = null;
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
    // async createUserAccount(userAccountEmail, userFullName, password) {
    //     const response = await fetch("/api/login", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             courrielUtilisateur: userAccountEmail,
    //             nomComplet: userFullName,
    //             password: password
    //         })
    //     });

    //     if (response.ok) {
    //         const user = await response.json();
    //         return user;
    //     } else {
    //         this.user = null;
    //         if (response.status === 409) {
    //             const respBody = await response.json();
    //             if (respBody && respBody.message) {
    //                 throw new AuthError(response.status, respBody.message);
    //             }
    //             throw new AuthError(response.status, "Erreur lors de la création du compte");
    //         } else {
    //             throw new AuthError(response.status, "Erreur lors de la création du compte: " + response.status);
    //         }
    //     }
    // },
});

export default session;

session.initialize();