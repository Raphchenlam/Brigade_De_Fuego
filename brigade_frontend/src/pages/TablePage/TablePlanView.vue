<template>
    <v-sheet width="100%" class="pa-2">

        <v-row>
            <v-col>

                <v-row>
                    <TableLayout class="pa-2"></TableLayout>
                </v-row>
                <v-row>
                    <TableInformation class="pa-2" v-if="selectedTable && !selectedReservationId"></TableInformation>
                    <ReservationInformation class="pa-2" v-if="selectedReservationId"
                        :reservationId="selectedReservationId"></ReservationInformation>
                </v-row>
            </v-col>
            <v-col cols="5">
                <v-row class="d-flex ms-2">
                    <!-- Ajouter :min="selectedDate" -->
                    <v-text-field class="ma-2" type="date" label="Sélectionner une date" density="compact"
                        v-model="selectedDate">
                    </v-text-field>
                    <v-radio-group class="d-flex justify-start align-center" :inline=true v-model="selectedShift">
                        <v-radio label="Midi" value="Midi"></v-radio>
                        <v-radio label="Soir" value="Soir"></v-radio>
                    </v-radio-group>
                </v-row>
                <v-row class="ma-2">
                    <h2 class="ma-2">Liste des réservations</h2>
                    <ReservationList class="pa-2"></ReservationList>
                </v-row>
            </v-col>
        </v-row>
    </v-sheet>
</template>


<script>
import { computed } from "vue";
import BlackButton from "../../components/Reusable/BlackButton.vue";
import OperationMenu from '../../components/OperationMenu.vue';
import operationSession from "../../sessions/OperationSession"
import ReservationList from '../ReservationPage/ReservationList.vue';
import ReservationInformation from '../ReservationPage/ReservationInformation.vue';
import TableLayout from './TableLayout.vue';
import TableInformation from './TableInformation.vue';
import { fetchAllTables, fetchAssignationByDate } from '../../services/TableService';

export default {
    name: 'TablePlanView',
    components: {
        OperationMenu,
        ReservationList,
        ReservationInformation,
        TableLayout,
        TableInformation,
        BlackButton
    },
    data() {
        return {
            operationSession: operationSession,
            tableList: [],
            assignationList: [],
            tableWithAssignationList: [],
            selectedDate: null,
            selectedShift: "Midi",
            selectedTable: null,
            selectedReservationId: null,


            ////////////TEMPORAIRE/////////
            hasReservation: true,

        }
    },
    provide() {
        return {
            tableList: computed(() => this.tableList),
            assignationList: computed(() => this.assignationList),
            tableWithAssignationList: computed(() => this.tableWithAssignationList),
            selectedDate: computed(() => this.selectedDate),
            selectedShift: computed(() => this.selectedShift),
            selectedTable: computed(() => this.selectedTable),
            displaySelectedTable: this.displaySelectedTable,
            loadReservationInformations: this.loadReservationInformations,


            ////////////TEMPORAIRE/////////
            hasReservation: computed(() => this.hasReservation),
        }
    },
    methods: {
       
        loadDate() {
            //************************/
            //***A remettre en place**/
            //************************/
            const todayDate = new Date().toISOString().split('T')[0];
            this.selectedDate = todayDate;
        },
        loadTableList() {
            console.log('Loading table list...');
            this.tableList = [];
            fetchAllTables().then(allTables => {
                allTables.forEach(table => {
                    this.tableList.push(table);
                });
            }).catch(err => {
                console.error(err);
            });
        },
        loadAssignationList(date, shift) {
            console.log('Loading assignation list...');
            this.assignationList = [];
            this.tableWithAssignationList = [];
            fetchAssignationByDate(date).then(allAssignations => {
                allAssignations.forEach(assignation => {
                    if (assignation.shift == shift) {
                        this.assignationList.push(assignation);
                    }
                });
                this.updateTableLayout();
            }).catch(err => {
                console.error(err);
            });
            console.log("assignationList: " + this.assignationList.length)
        },
        updateTableLayout() {
            this.tableWithAssignationList = [];
            console.log('tableList:', this.tableList);
            console.log('tableList:', this.tableList.length);
            console.log('assignationList:', this.assignationList);
            console.log('assignationList:', this.assignationList.length);

            this.tableWithAssignationList = this.tableList.map(table => {
                return {
                    number: table.number,
                    capacity: table.capacity,
                    isActive: table.isActive,
                    isAssign: false,
                    assignation: null,
                }
            });
            console.log("tableWithAssi... : " +this.tableWithAssignationList.length);

            if (this.assignationList.length > 0) {
                this.assignationList.forEach(assignation => {

                    const table = this.tableWithAssignationList.find(table => {
                        return (table.number == assignation.tableNumber)
                    })
                    if (table.isActive) {
                        table.isAssign = true;
                        table.assignation = assignation;
                    } else {
                        console.error(`La table ${table.number} est inactive`);
                        assignation.isActive = false;
                    }
                }
                );
            }
        },
        loadReservationInformations(receivedReservationId) {
            this.selectedReservationId = receivedReservationId;
        },
        
        displaySelectedTable(number) {
            console.log("DisplaySelectedTable : " + number)
            this.selectedTable = this.tableWithAssignationList.find((table) => {
                return table.number == number;
            })
            console.log("DisplaySelectedTable : " + this.selectedTable)
        },
    },
    watch: {
        selectedDate() {
            console.log('selectedDate changed');
            this.loadAssignationList(this.selectedDate, this.selectedShift);
        },
        selectedShift() {
            console.log('tableList changed');
            this.loadAssignationList(this.selectedDate, this.selectedShift);
        },
    },

    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
        this.loadDate();
        this.loadTableList();
        this.loadAssignationList();

    }
}
</script>