<template>
    <v-form @submit.prevent="createNewLeave" validate-on="blur" ref="newLeaveForm" class="pa-10">
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-if="!employeeNumber || $route.fullPath.split('/').slice(0)[2] == 'leave'" cols="6">
                        <v-text-field disabled v-model="employeeNumber" label="Numero Employé"></v-text-field>
                    </v-col>
                    <v-col v-if="!employeeNumber || $route.fullPath.split('/').slice(0)[2] == 'leave'" cols="6">
                        <BlackButton v-if="!employeeNumber" @click="dialogAddEmployeeToLeave = true" textbutton="Choisir Employé" width="100%">
                        </BlackButton>
                        <BlackButton v-else @click="dialogAddEmployeeToLeave = true" textbutton="Changer Employé" width="100%">
                        </BlackButton>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field type="date" v-model="startDate" label="Date debut"
                            :rules="[rules.required, rules.startDateIsValid]"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field type="date" v-model="endDate" label="Date fin"
                            :rules="[rules.required, rules.endDateIsValid]"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select :items="leaveCategory" id="" label="Categorie" v-model.trim="category"
                            :rules="[rules.required]"></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field counter="255" v-model="reason" label="Raison"
                            :rules="[rules.required, rules.fieldLength255]"></v-text-field>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDialogs">
                Cancel
            </v-btn>
            <v-btn type="submit" color="blue-darken-1" variant="text">
                Save
            </v-btn>
        </v-card-actions>
    </v-form>
    <v-dialog v-model="dialogOKLeave" width="50%" persistent>
        <v-card height="100px">
            <v-card-title>
                Confirmation de demande du congé
            </v-card-title>
            <v-card-text>
                <v-row class="justify-center">
                    <p>La demande de congé a bien été
                        envoyée.</p>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAddEmployeeToLeave" width="75%" persistent>
        <v-card class="pa-5" height="500">
            <v-card-title>
                Ajouter un employé au congé en cours
            </v-card-title>
            <v-row class="justify-center">
                <EmployeeList class="mr-5" width="90%"></EmployeeList>
            </v-row>
            <v-row class="justify-end">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="dialogAddEmployeeToLeave = false"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Ajouter" :disabled="!selectedEmployeeNumber" @click="addEmployeeToLeave"></DarkRedButton>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script>

import BlackButton from '../../components/Reusable/BlackButton.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue'

import EmployeeList from '../EmployeePage/EmployeeList.vue'

import { createLeave, getAllLeavesCategory } from '../../services/LeaveService.js'

export default {
    components: {
        EmployeeList,
        BlackButton,
        DarkRedButton
    },
    inject: ['closeNewLeaveDialog', 'spliceDate', 'loadLeaves'],
    props: {
        employeeNumberReceived: Number
    },
    data()
    {
        return {
            employeeNumber: null,
            startDate: null,
            endDate: null,
            startDateValid: true,
            endDateValid: true,
            category: null,
            reason: null,
            leaveCategory: [],
            rules: {
                required: value => !!value || "Le champ est requis",
                startDateIsValid: () => this.startDateValid || "Date non valide\n\t- Doit etre minimum le lundi 1 semaine à l'avance",
                endDateIsValid: () => this.endDateValid || "Date non valide\n\t- Ne doit pas être avant la date de départ",
                fieldLength255: value => ((value) ? !(value.length > 254) : true) || "255 caractères maximum.",
            },
            dialogOKLeave: false,
            dialogAddEmployeeToLeave: false,
            selectedEmployeeNumber: null,
        };
    },
    methods: {
        loadLeavesCategory()
        {
            getAllLeavesCategory().then(leaveCategoryList =>
            {
                leaveCategoryList.forEach(leaveCategory =>
                {
                    this.leaveCategory.push(leaveCategory.name);
                });
            }).catch(err =>
            {
                console.log(err);
            });
        },
        createNewLeave()
        {
            const newLeave = {
                employeeNumber: this.employeeNumber,
                startDate: this.startDate,
                endDate: this.endDate,
                category: this.category,
                reason: this.reason,
            }

            createLeave(newLeave).then(result =>
            {
                console.log("result", result)
                this.dialogOKLeave = true;
                this.loadLeaves();
                setTimeout(this.closeDialogs, 2000)
            }).catch(err =>
            {
                console.error(err);
            });
        },
        isMinimumOneWeek(startDate)
        {
            const dateStr = startDate;
            var dateParts = dateStr.split('-');
            var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            var today = new Date();
            var futureDate = new Date(today);
            futureDate.setDate(today.getDate() + 7);
            var dayOfWeek = futureDate.getDay();
            var daysToAdd = 1 - dayOfWeek;
            futureDate.setDate(futureDate.getDate() + daysToAdd);
            console.log("date", date);
            console.log("today", today);
            console.log("futureDate", futureDate);
            if (date.getFullYear() < futureDate.getFullYear())
            {
                return true;
            }
            else if (date.getFullYear() == futureDate.getFullYear() && date.getMonth() < futureDate.getMonth())
            {
                return true;
            }
            else if (date.getFullYear() == futureDate.getFullYear() && date.getMonth() == futureDate.getMonth())
            {
                if (date.getDate() < futureDate.getDate())
                {
                    return true;
                }
                else if (date.getDate() == futureDate.getDate())
                {
                    if (date.getHours() < futureDate.getHours())
                    {
                        return true;
                    }
                    else if (date.getHours() == futureDate.getHours() && date.getMinutes() <= futureDate.getMinutes())
                    {
                        return true;
                    }
                }
            }
            return false;
        },
        closeDialogs()
        {
            this.dialogOKLeave = false;
            this.closeNewLeaveDialog();
        },
        loadEmployeeNumber(employeeNumber) {
            this.selectedEmployeeNumber = employeeNumber
        },
        addEmployeeToLeave()
        {
            this.employeeNumber = this.selectedEmployeeNumber;
            this.dialogAddEmployeeToLeave = false;
            this.selectedEmployeeNumber = null;
        }
    },
    provide() {
        return {
            loadEmployeeNumber: this.loadEmployeeNumber,
        };
    },
    watch: {
        startDate()
        {
            this.startDateValid = !this.isMinimumOneWeek(this.startDate);
            this.endDateValid = !(this.endDate < this.startDate);
        },
        endDate()
        {
            this.endDateValid = !(this.endDate < this.startDate);
        }
    },
    mounted()
    {
        if (this.employeeNumberReceived)
            this.employeeNumber = this.employeeNumberReceived;
        this.loadLeavesCategory();
    },
}

</script>