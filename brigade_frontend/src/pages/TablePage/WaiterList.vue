<template>
    <v-sheet class="w-100">
        <v-card class="pa-2 ma-2">
            <v-row>
                <v-col class=" ps-6 d-flex align-center">
                    <h2>Personnel de service</h2>
                </v-col>
            </v-row>
            <v-row class="ms-2">
                <p v-if="inEditionMode">
                    <v-icon color="warning" icon="mdi-alert" size="large"></v-icon>
                    <strong>Veuillez choisir le serveur et ensuite les tables</strong>
                </p>
                <p v-if="inColorMode">
                    <v-icon color="warning" icon="mdi-alert" size="large"></v-icon>
                    <strong>Veuillez appuyer sur la pastille de couleur</strong>
                </p>
            </v-row>
            <v-row>
                <v-list class="w-100 pa-2 ma-2">
                    <v-list-item v-for="waiter in waitersList" :key="waiter.employeeNumber" :title="waiter.listInformations"
                        :value="waiter.employeeNumber" :color="waiter.waiterColor" @click="selectWaiter(waiter.employeeNumber, waiter.waiterColor)">
                        <template v-slot:prepend>
                            <v-avatar :color="waiter.waiterColor" @click="openColorPicker(waiter)">
                            </v-avatar>
                        </template>
                        <v-dialog v-model="waiter.dialogVisible">
                            <v-color-picker v-model="waiter.waiterColor" hide-canvas hide-inputs hide-sliders
                                show-swatches></v-color-picker>
                        </v-dialog>
                        <template v-slot:subtitle>
                            <v-btn v-if="(inEditionMode)" prepend-icon="mdi-plus" variant="tonal" density="compact"
                                rounded="0" >Assigner la section</v-btn>
                        </template>

                    </v-list-item>
                </v-list>

            </v-row>

            <v-row>
                <v-col v-if="!inColorMode">
                    <BlackButton @click="toggleEditionMode" class="ma-6"
                        :textbutton='inEditionMode ? "Annuler" : "Assigner les sections"'></BlackButton>
                </v-col>  
                <v-col v-if="!inEditionMode"> 
                        <BlackButton @click="toggleColorMode" class="ma-6"
                        :textbutton='inColorMode ? "Annuler" : "Changer les couleurs"'></BlackButton>
                </v-col>
                <v-col>
                    <BlackButton v-if="inEditionMode" @click="" class="ma-6" :textbutton='"Enregistrer les sections"'></BlackButton>
                    <BlackButton v-if="inColorMode" @click="updatecolor()" class="ma-6" :textbutton='"Enregistrer les couleurs"'></BlackButton>
                </v-col>

            </v-row>

        </v-card>
    </v-sheet>
</template>

<script>

import { updateEmployeeColor } from '../../services/EmployeeService';
import { getAllWaitersByDateAndShift } from '../../services/ScheduleService';
import BlackButton from "../../components/Reusable/BlackButton.vue";


export default {
    inject: ['tableWithAssignation', 'selectedDate', 'selectedShift', 'inEditionMode', 'toggleEditionMode',
        'selectedTable', 'selectTableInSection', 'tableInSection', 'selectWaiter', 'localAssignations', 'selectedWaiter'],
    components: {
        BlackButton
    },
    data() {
        return {
            waitersList: [],
            newColor: null,
            inColorMode: false,

        }
    },

    methods: {
        getWaitersList() {
            this.waitersList = [];
            getAllWaitersByDateAndShift(this.selectedDate, this.selectedShift).then(allWaiters => {
                allWaiters.forEach(waiter => {
                    const newWaiter = {
                        listInformations: waiter.waiterNumber + " - " + waiter.waiterName + "  |  " + waiter.shiftTime,
                        employeeNumber: waiter.waiterNumber,
                        waiterColor: waiter.waiterColor,
                        shiftTime: waiter.shiftTime,
                        props: {
                            color: waiter.waiterColor
                        }
                    };
                    this.waitersList.push(newWaiter);
                });
            })
        },
        updatecolor(){
            const employeeList = [];
            this.waitersList.forEach((employee) => {
                const newWaiter={
                employeeNumber: employee.employeeNumber,
                employeeColor: employee.waiterColor
                }
                employeeList.push(newWaiter);
            }
            )
            updateEmployeeColor(employeeList).then(
                this.getWaitersList()
            )
        },
        openColorPicker(waiter) {
            if (this.inColorMode) {
                waiter.dialogVisible = !waiter.dialogVisible;
            }
        },
        toggleColorMode(){
            this.inColorMode=!this.inColorMode;
            if (!this.inColorMode) {
                this.getWaitersList();
            }
        }

    },
    watch: {
        selectedDate() {
            this.getWaitersList();
        },
        selectedShift() {
            this.getWaitersList();
        },

    },

    mounted() {
        this.getWaitersList()
    }

}

</script>