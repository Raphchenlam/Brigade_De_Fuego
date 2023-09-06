<template>
        <v-row class="justify-center">
                <v-sheet width="45rem" height="auto" class="ma-2">
                        <v-card class="pa-5" height="auto">
                                <v-row class="mb-5 justify-center">
                                        <h1>{{ employee.firstName + " " + employee.lastName }}</h1>
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
                                <!-- A FAIRE S ON A LE TEMPS -->
                                <v-card v-if="false" elevation="3" class="pa-5 my-5" height="75">
                                        <v-row>
                                                <p>Nombre d'heures travaillés depuis le début de la semaine : </p>
                                                <span v-if="hoursDifference < 4" style='color:red'> {{
                                                        employee.actualWorkedHours
                                                }}</span>
                                                <span v-else-if="hoursDifference < 8" style="color:rgb(226, 226, 6)"> {{
                                                        employee.actualWorkedHours }}</span>
                                                <span v-else style='color:rgb(3, 211, 3)'> {{ employee.actualWorkedHours
                                                }}</span>
                                        </v-row>
                                        <v-row>
                                                <p>Nombre d'heures prévus à l'horaire : {{ employee.scheduledHours }}</p>
                                        </v-row>
                                </v-card>
                                <!-- -->
                                <LeaveList :employeeNumber="employeeNumber" height="175px"></LeaveList>
                                <v-dialog v-model="dialogEditEmployee" width="50%">
                                        <template v-slot:activator="{ props }">
                                                <v-row class="justify-space-around">
                                                        <BlackButton class="my-5" v-bind="props" textbutton="Modifier">
                                                        </BlackButton>
                                                        <BlackButton class="my-5" textbutton="Voir horaire personnel">
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
        </v-row>
</template>

<script>
import BlackButton from '../../components/Reusable/BlackButton.vue';
import LeaveList from '../LeavePeage/LeaveList.vue';
import EditEmployeeForm from './EditEmployeeForm.vue';

import { getEmployeeByEmployeeNumber } from '../../services/EmployeeService'

export default {
        components: { LeaveList, BlackButton, EditEmployeeForm },
        props: {
                employeeNumber: Number
        },
        data()
        {
                return {
                        employee: {
                        },
                        dialogEditEmployee: false
                };
        },
        computed: {
                hoursDifference()
                {
                        return this.employee.scheduledHours - this.employee.actualWorkedHours;
                }
        },
        methods: {
                loadEmployeeByNumber(employeeNumber)
                {
                        if (employeeNumber)
                        {
                                console.log("FETCH ICI")
                                getEmployeeByEmployeeNumber(employeeNumber).then(employee =>
                                {
                                        employee.scheduledHours = 0,
                                                employee.actualWorkedHours = 0;
                                        this.employee = employee
                                }).catch(err =>
                                {
                                        console.error(err);
                                })
                        }
                        else
                        {
                                console.log("RESET ICI")
                                this.employee = {};
                        }
                },
                closeEditEmployeeDialog()
                {
                        this.dialogEditEmployee = false;
                }
        },
        watch: {
                employeeNumber()
                {
                        console.log("Watch4");
                        this.loadEmployeeByNumber(this.employeeNumber);
                }
        },
        provide()
        {
                return {
                        closeEditEmployeeDialog: this.closeEditEmployeeDialog
                };
        },
        mounted()
        {
                console.log("Watch5");
                if (this.employeeNumber)
                {
                        console.log("Watch6");
                        this.loadEmployeeByNumber(this.employeeNumber);
                }
        }

}

</script>