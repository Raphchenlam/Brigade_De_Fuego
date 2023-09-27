<template>
    <v-sheet class="w-100">
        <v-card class="pa-2 ma-2">
            <v-row>

            </v-row>
            <v-row>
                <v-col>
                    <h2>Table # {{ tableInformation.number }}</h2>
                    <p><strong>Capacité: </strong>{{ tableInformation.capacity }}</p>
                </v-col>
                <v-col cols="auto"
                    v-if="tableInformation.assignation != null && tableInformation.assignation.employeeNumber != null">
                    <h2>Responsable: {{ tableInformation.assignation.employeeFirstName }} {{
                        tableInformation.assignation.employeeLastName
                    }}</h2>
                </v-col>
                <v-col cols="auto" v-if="!tableInformation.isActive">
                    <h2 class="text-red-lighten-1">Table INACTIVE</h2>
                </v-col>
            </v-row>
            <v-row>
                <v-card class="pa-2 ma-4 w-100">
                    <BlackButton v-if="tableInformation.isAssign" class="ma-2" textbutton="Changer le responsable">
                    </BlackButton>
                    <BlackButton v-if="!tableInformation.isAssign && tableInformation.isActive" class="ma-2"
                        textbutton="Assigner un responsable"></BlackButton>
                    <BlackButton v-if="tableInformation.isAssign" class="ma-2" textbutton="Assigner une réservation">
                    </BlackButton>
                    <BlackButton v-if="!tableInformation.isActive" class="ma-2" textbutton="Réactiver la table">
                    </BlackButton>
                    <BlackButton v-if="tableInformation.isActive" class="ma-2" textbutton="Désactiver la table">
                    </BlackButton>
                </v-card>
            </v-row>

        </v-card>
    </v-sheet>
</template>

<script>
import BlackButton from "../../components/Reusable/BlackButton.vue";

export default {
    inject: ['selectedTable', 'tableWithAssignationList'],
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