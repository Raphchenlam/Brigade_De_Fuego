import { reactive } from "vue";

class AuthError extends Error
{
    constructor(status, message)
    {
        super(message);
        this.status = status;
    }
}

const operationSession = reactive({
    isActive: true,
    employee: null,


    initialize()
    {
        if (sessionStorage.employee)
        {
            this.isActive = true;
            this.employee = sessionStorage.employee;
        }
        else
        {
            this.isActive = false;
            this.employee = null;
        }
    },
    unlock(employee)
    {
        this.setCredentials(employee);
        this.isActive = true;
        this.employee = employee;
        return employee;
    },
    setCredentials(employee)
    {
        sessionStorage.employee = employee;
    },
    clearCredentials()
    {
        sessionStorage.removeItem('employee');

    },
    disconnect()
    {
        this.isActive = false;
        this.employee = null;
        this.clearCredentials();
    },
});

export default operationSession;

operationSession.initialize();