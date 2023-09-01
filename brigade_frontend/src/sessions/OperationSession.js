import { reactive } from "vue";

class AuthError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const operationSession = reactive({
    isActive: true,
    adminNumber: null,


    initialize() {
        if (sessionStorage.adminNumber) {
            this.isActive = true;
        }
    else {
            //this.fetchUser().catch(err => console.error("L'authentification initiale a échouée: ", err));
            this.isActive = true
            this.adminNumber = 3343
        }
    },
    login(user_email, password) {
        this.setCredentials(user_email, password);
        return this.fetchUser();
    },
    setCredentials(user_email, password) {
        this.user_email = user_email;
        sessionStorage.user_email = user_email;
        this.password = password;
        sessionStorage.password = password;
    },
    clearCredentials() {
        this.adminNumber = null;
        sessionStorage.removeItem('adminNumber');

    },
    disconnect() {
        this.isActive = false;
        this.clearCredentials();
    },
    async fetchUser() {
        const response = await fetch("/api/login", {
            method: "GET",
            headers: {
                ... this.getAuthHeaders()
            }
        });

        if (response.ok) {
            const user = await response.json();
            this.user = user;
            return user;
        } else {
            this.user = null;
            if (response.status === 401) {
                throw new AuthError(response.status, "Adresse courriel ou mot de passe incorrect");
            } else {
                throw new AuthError(response.status, "Erreur lors de l'authentification: " + response.status);
            }
        }
    },
    getAuthHeaders() {
        if (this.user_email) {
            return {
                "Authorization": "Basic " + btoa(this.user_email + ":" + this.password),
                "X-Requested-With": "XMLHttpRequest"
            };
        } else {
            return {};
        }
    },
    
});

export default operationSession;

operationSession.initialize();