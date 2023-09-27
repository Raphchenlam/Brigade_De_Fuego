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
    isReady: false,
    isActive: true,
    barcodeNumber: null,
    employee: null,

    initialize()
    {
        this.isReady = false;
        if (sessionStorage.barcodeNumber)
        {
            this.barcodeNumber = sessionStorage.barcodeNumber;
            this.fetchEmployeeByCodebarNumber(this.barcodeNumber).then((employee) =>
            {
                console.log("Ici2")
                if (employee) this.isReady = true;
            });
        }
        else
        {
            this.isActive = false;
            this.barcodeNumber = null;
            this.employee = null;
        }
    },
    unlock(employee)
    {
        this.setCredentials(employee);
        this.isActive = true;
        this.barcodeNumber = employee.barcodeNumber;
        this.employee = employee;
        return employee;
    },
    setCredentials(employee)
    {
        sessionStorage.barcodeNumber = employee.barcodeNumber;
    },
    clearCredentials()
    {
        sessionStorage.removeItem('barcodeNumber');

    },
    disconnect()
    {
        this.isActive = false;
        this.barcodeNumber = null;
        this.employee = null;
        this.clearCredentials();
    },
    async fetchEmployeeByCodebarNumber(barcodeNumber)
    {
        const response = await fetch(`/api/employee/barcode/${barcodeNumber}`);
        if (response.ok)
        {
            const employee = await response.json();
            if (!employee.isAdmin) { throw new AuthError(response.status, "Gestionnaire seulement autorisé"); }
            this.employee = employee;
            console.log("Ici1")
            this.isActive = true;
            return employee;
        } else
        {
            throw await createServiceError(response);
        }
    },
});

export default operationSession;

operationSession.initialize();