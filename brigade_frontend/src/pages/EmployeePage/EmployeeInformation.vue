<template>
        <v-sheet v-if="employee.employeeNumber || userSession.employeeNumber" class="px-10 py-3">
                <v-dialog v-model="dialogEditEmployee" width="50%" persistent>
                        <template v-slot:activator="{ props }">
                                <v-row class="justify-space-between">
                                        <div>
                                                <h1 class="mt-5 ml-10">{{ employee.firstName + " " + employee.lastName }}</h1>
                                        </div>
                                        <EditBlackButton class="ma-5" v-bind="props"></EditBlackButton>
                                </v-row>
                        </template>
                        <v-card>
                                <v-card-title>
                                        Éditer les informations de l'employé(e)
                                </v-card-title>
                                <EditEmployeeForm :employeeNumber="employeeNumber"></EditEmployeeForm>
                        </v-card>
                </v-dialog>
                <v-divider :thickness="2" class="border-opacity-50"></v-divider>
                <v-row class="ma-5 justify-space-between">
                        <p>Numéro Employé : {{ employee.employeeNumber }}</p>
                        <p>Poste : {{ employee.role }}</p>
                </v-row>
                <v-row class="ma-5 justify-space-between">
                        <p>Numéro de téléphone : {{ employee.phoneNumber }}</p>
                        <p>Adresse Courriel : {{ employee.email }}</p>
                </v-row>
                <v-row class="ma-5 justify-space-between">
                        <p>Taux horaire : {{ employee.hourlyRate }}</p>
                        <p>Numéro carte : {{ employee.barcodeNumber }}</p>
                </v-row>
                <v-row class="ma-5 justify-space-between">
                        <p>Statut :
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
                <v-row v-if="!this.$route.fullPath.split('/').slice(1)[2]" height="100">
                        <LeaveList :employeeNumber="employeeNumber"></LeaveList>
                </v-row>
        </v-sheet>
</template>

<script>
import BlackButton from '../../components/Reusable/BlackButton.vue';
import LeaveList from '../LeavePeage/LeaveList.vue';
import EditEmployeeForm from './EditEmployeeForm.vue';

import { getEmployeeByEmployeeNumber } from '../../services/EmployeeService'
import EditBlackButton from '../../components/Reusable/EditBlackButton.vue';
import CalendarButton from '../../components/Reusable/CalendarButton.vue';
import userSession from "../../sessions/UserSession"

export default {
        components: { LeaveList, BlackButton, EditEmployeeForm, EditBlackButton, CalendarButton },
        props: {
                employeeNumber: Number
        },
        data()
        {
                return {
                        userSession: userSession,
                        employee: {
                                employeeNumber: this.employeeNumber,
                                firstName: "",
                                lastName: "",
                                role: "",
                                colorHexCode: "",
                                hourlyRate: null,
                                barcodeNumber: "",
                                email: "",
                                phoneNumber: "",
                                isAdmin: false,
                                isActive: true,
                                skillPoints: null
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
                        this.loadEmployeeByNumber(this.employeeNumber);
                }
        },
        provide()
        {
                return {
                        closeEditEmployeeDialog: this.closeEditEmployeeDialog,
                        loadEmployeeByNumber: this.loadEmployeeByNumber
                };
        },
        created()
        {
                if (!userSession.employeeNumber && !userSession.password)
                {
                        this.$router.push('/espace/');
                }
        },
        mounted()
        {

                if (this.employeeNumber)
                {
                        this.loadEmployeeByNumber(this.employeeNumber);
                }
        }
}

</script>

<style scoped></style>