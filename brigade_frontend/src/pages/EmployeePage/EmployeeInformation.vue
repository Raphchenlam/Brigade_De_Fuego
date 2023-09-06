<template>
        <v-sheet width="65%" height="auto" class="ma-2">
                <v-card class="pa-5" height="auto">
                        <v-row class="mb-5 justify-center">
                                <h2>Maxime Marchand</h2>
                        </v-row>
                        <v-divider :thickness="2" class="border-opacity-50"></v-divider>
                        <v-row class="ma-5 justify-space-between">
                                <p>Numero employé : {{ employee.employeeNumber }}</p>
                                <p>Poste : {{ employee.role }}</p>
                        </v-row>
                        <v-row class="ma-5 justify-space-between">
                                <p>Numero de telephone : {{ employee.phoneNumber }}</p>
                                <p>Courriel : {{ employee.email }}</p>
                        </v-row>
                        <v-row class="ma-5 justify-space-between">
                                <p>Taux horaire : {{ employee.hourlyRate }}</p>
                                <p>Numero carte : {{ employee.barcodeNumber }}</p>
                        </v-row>
                        <v-row class="ma-5 justify-space-between">
                                <p>Status :
                                        <span v-if="employee.isActive" style='color:rgb(3, 211, 3)'>ACTIF</span>
                                        <span v-else style='color:red'>INACTIF</span>
                                </p>
                                <p>Gestionnaire :
                                        <span v-if="employee.isAdmin" style='color:rgb(3, 211, 3)'>OUI</span>
                                        <span v-else style='color:red'>NON</span>
                                </p>
                        </v-row>
                        <v-card elevation="3" class="pa-5 my-5" height="75">
                                <v-row>
                                        <p>Nombre d'heures travaillés depuis le début de la semaine : </p>
                                        <span v-if="hoursDifference < 4" style='color:red'> {{ employee.actualWorkedHours
                                        }}</span>
                                        <span v-else-if="hoursDifference < 8" style="color:rgb(226, 226, 6)"> {{
                                                employee.actualWorkedHours }}</span>
                                        <span v-else style='color:rgb(3, 211, 3)'> {{ employee.actualWorkedHours }}</span>
                                </v-row>
                                <v-row>
                                        <p>Nombre d'heures prévus à l'horaire : {{ employee.scheduledHours }}</p>
                                </v-row>
                        </v-card>
                        Conges:
                        <v-card elevation="3" class="mb-2" height="175">
                                <LeaveList height="175px"></LeaveList>
                        </v-card>
                        <v-dialog v-model="dialogEditEmployee" width="50%">
                                <template v-slot:activator="{ props }">
                                        <v-row class="justify-space-around">
                                                <BlackButton class="my-5" v-bind="props" textbutton="Modifier cet employe">
                                                </BlackButton>
                                                <BlackButton class="my-5" textbutton="Voir son horaire personnel">
                                                </BlackButton>
                                        </v-row>
                                </template>
                                <v-card>
                                        <v-card-title>
                                                Editer les informations de l'employé
                                        </v-card-title>
                                        <EditEmployeeForm :employeeNumber="2222"></EditEmployeeForm>
                                </v-card>
                        </v-dialog>
                </v-card>
        </v-sheet>
</template>

<script>
import BlackButton from '../../components/Reusable/BlackButton.vue';
import LeaveList from '../LeavePeage/LeaveList.vue';
import EditEmployeeForm from './EditEmployeeForm.vue';


export default {
        components: { LeaveList, BlackButton, EditEmployeeForm },
        provide: {
                // a regarder ici si on envoie seulement le employeeNumber pour ensuite faire un fetch ou si on y envoie un object employee deja remplis
        },
        data()
        {
                return {
                        employee: {
                                employeeNumber: 1111,
                                firstName: "Maxime",
                                lastName: "Marchand",
                                role: "Serveur",
                                phoneNumber: "555-555-5555",
                                email: "max@marchand.com",
                                barcodeNumber: "7776655443344556",
                                hourlyRate: 13.45,
                                isAdmin: false,
                                skillPoints: 6,
                                isActive: true,
                                scheduledHours: 35,
                                actualWorkedHours: 14
                        },
                        dialogEditEmployee : false
                };
        },
        computed: {
                hoursDifference()
                {
                        return this.employee.scheduledHours - this.employee.actualWorkedHours;
                }
        },
        methods: {
        closeEditEmployeeDialog()
        {
            this.dialogEditEmployee = false;
        }
    },
    provide()
    {
        return {
                closeEditEmployeeDialog: this.closeEditEmployeeDialog
        };
    },

}

</script>