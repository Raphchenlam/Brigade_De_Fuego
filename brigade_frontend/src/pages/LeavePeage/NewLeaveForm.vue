<template>
    <v-form @submit.prevent="createNewLeave" validate-on="blur" ref="newLeaveForm" class="pa-10">
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-if="!employeeNumber" cols="6">
                        <v-text-field disabled v-model="employeeNumber" label="Numero Employé"></v-text-field>
                    </v-col>
                    <v-col v-if="!employeeNumber" cols="6">
                        <BlackButton textbutton="+ employé" width="100%"></BlackButton>
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
</template>

<script>

import BlackButton from '../../components/Reusable/BlackButton.vue';
import { createLeave, getAllLeavesCategory } from '../../services/LeaveService.js'

export default {
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
                startDateIsValid: () => this.startDateValid || "Date non valide\n\t- Doit etre minimum dans 2 semaines",
                endDateIsValid: () => this.endDateValid || "Date non valide\n\t- Ne doit pas être avant la date de départ",
                fieldLength255: value => ((value) ? !(value.length > 254) : true) || "255 caractères maximum.",
            },
            dialogOKLeave: false
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
            }).catch(err =>
            {
                console.error(err);
            });
            setTimeout(this.closeDialogs, 2000)
        },
        isMinimumTwoWeeks(startDate)
        {
            const dateStr = startDate;
            var dateParts = dateStr.split('-');
            var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            var today = new Date();
            var futureDate = new Date(today);
            futureDate.setDate(today.getDate() + 14);
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
    },
    watch: {
        startDate()
        {
            this.startDateValid = !this.isMinimumTwoWeeks(this.startDate);
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
    components: { BlackButton }
}

</script>