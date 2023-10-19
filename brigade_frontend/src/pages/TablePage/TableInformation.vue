<template>
    <v-sheet class="w-100">
        <v-card class="pa-2 ma-2"
            :color="tableInformation.isAssign ? `${tableInformation.assignation.employeeColor}` : (!tableInformation.isActive ? 'grey':'white')">
            <v-row>
                <v-col>
                    <h1>Table # {{ tableInformation.number }}</h1>
                    <h3>Capacité: {{ tableInformation.capacity }}</h3>
                    <h3>Réservation(s): </h3>
                </v-col>

                <v-col cols="auto">
                    <h2 v-if="!tableInformation.isActive" class="text-no-wrap bg-black text-red-lighten-1">Table INACTIVE</h2>
                    <h2 v-if="!tableInformation.isAssign && tableInformation.isActive">Non assigné</h2>
                    <h2 v-if="tableInformation.isAssign && tableInformation.isActive"> Responsable: {{ tableInformation.assignation.employeeFirstName }} {{
                        tableInformation.assignation.employeeLastName
                    }}</h2>
                </v-col>
            </v-row>
            <v-row class="ma-2">
                <v-col class="py-0 ps-0">
                    <v-card class="pa-2 ma-4 w-100">
                        <BlackButton v-if="tableInformation.isAssign" class="ma-2" textbutton="Assigner une réservation">
                        </BlackButton>
                        <BlackButton v-if="!tableInformation.isActive" class="ma-2" textbutton="Réactiver la table">
                        </BlackButton>
                        <BlackButton v-if="tableInformation.isActive" class="ma-2" textbutton="Désactiver la table">
                        </BlackButton>
                    </v-card>
                </v-col>
                <v-col cols="auto" class="py-0 pe-0 ps-6 d-flex align-center">
                    <v-card class="pa-2">
                    <BlackButton class="ma-2" textbutton="RETOUR" @click="toggleSelectedTable">
                    </BlackButton>
                </v-card>
                </v-col>
            </v-row>

        </v-card>
    </v-sheet>
</template>

<script>
import BlackButton from "../../components/Reusable/BlackButton.vue";

export default {
    inject: ['selectedTable', 'tableWithAssignationList', 'toggleSelectedTable'],
    components: {
        BlackButton
    },
    data() {
        return {
            tableInformation: {},

        }
    },
    methods: {
        getTableInformation() {
            this.tableInformation = this.tableWithAssignationList.find(table => {
                return table.number == this.selectedTable.number;
            })
        }
    },
    watch: {
        selectedTable() {
            this.getTableInformation();
        },
        tableWithAssignationList() {
            this.getTableInformation();
        }
    },
    mounted() {
        this.getTableInformation();
    }

}
</script>