<template>
    <v-sheet class="w-100">
        <v-card class="pa-2 ma-2">
            <v-row>
                <v-col class="ma-2 ps-6 d-flex align-center">
                    <h2>Personnel de service</h2>
                </v-col>
                <v-col cols="auto">
                    <v-btn-toggle :v-model="filteredWaiterList" color="grey-darken-2" variant="outline" group>
                        <v-btn value="all">
                            Tous
                        </v-btn>
                        <v-btn value="scheduled">
                            À l'horaire
                        </v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
            <v-row>
                <v-list class="w-100 pa-2 ma-2">
                    <v-list-item v-for="waiter in waitersList" :key="waiter.employeeNumber" :title="waiter.listInformations"
                        v-model:selected="selectedWaiter" :value="waiter.employeeNumber" :color="waiter.waiterColor">
                        <template v-slot:prepend>
                            <v-avatar :color="waiter.waiterColor"></v-avatar>
                        </template>
                    </v-list-item>
                </v-list>
            </v-row>
        </v-card>
    </v-sheet>
</template>

<script>

import { getAllEmployeesByRole } from '../../services/EmployeeService'

export default {
    inject: ['tableWithAssignation'],
    data() {
        return {
            waitersList: [],
            selectedWaiter: '',
            filteredWaiterList: "all"
        }
    },
    methods: {
        getWaitersList() {
            this.waitersList = [];
            getAllEmployeesByRole("Serveur").then(allWaiters => {
                allWaiters.forEach(waiter => {
                    const newWaiter = {
                        listInformations: waiter.employeeNumber + " - " + waiter.firstName + " " + waiter.lastName,
                        employeeNumber: waiter.employeeNumber,
                        waiterColor: waiter.color,
                        isActive: waiter.isActive,
                        props: {
                            color: waiter.color
                        }
                    };
                    this.waitersList.push(newWaiter);
                });
            })
        }
    },
    mounted() {
        this.getWaitersList()
    }

}

</script>