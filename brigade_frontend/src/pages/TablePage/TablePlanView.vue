<template>
    <v-sheet width="100%" class="pa-2">

        <v-row>
            <v-col>
                <v-row class="d-flex ms-2">
                    <!-- Ajouter :min="selectedDate" -->
                    <v-text-field type="date" label="Sélectionner une date" v-model="selectedDate">
                    </v-text-field>
                    <v-radio-group class="d-flex justify-start ma-2" :inline=true v-model="selectedShift">
                        <v-radio label="Midi" value="Midi"></v-radio>
                        <v-radio label="Soir" value="Soir"></v-radio>
                    </v-radio-group>
                </v-row>
                <v-row>
                    <TableLayout class="pa-2"></TableLayout>
                </v-row>
                <v-row>
                    <TableInformation class="pa-2"></TableInformation>
                    <ReservationInformation class="pa-2" v-if="selectedReservationId" :reservationId="selectedReservationId"></ReservationInformation>
                </v-row>
                <v-row>
                    <v-card class="pa-2 ma-4 w-100">
                        <BlackButton class="ma-2" textbutton="Changer le status"></BlackButton>
                        <BlackButton class="ma-2" textbutton="Attribuer une table"></BlackButton>
                        <BlackButton class="ma-2" textbutton="Attribuer une table"></BlackButton>
                        <BlackButton class="ma-2" textbutton="Attribuer une table"></BlackButton>
                        <p class="ma-2 text-red-lighten-1">Les bouttons vont changer selon ce qui a été selectionné</p>
                        
                    </v-card>
                </v-row>
            </v-col>
            <v-col cols="4">
                <v-row>
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
    inject:['selectedReservationId'],
    data() {
        return {
            operationSession: operationSession,
            employeeColor: "#8b0000",
            hasReservation: true,
            //isAssign: false,
            tableList: [],
            //assignationList: [],
            //tableWithAssignationList: [],
            selectedDate: null,
            selectedShift: "Midi",
            needUpdate:false
        }
    },
    provide() {
        return {
            employeeColor: computed(() => this.employeeColor),
            hasReservation: computed(() => this.hasReservation),
            //isAssign: computed(() => this.isAssign),
            tableList: computed(() => this.tableList),
            //assignationList: computed(() => this.assignationList),
            //tableWithAssignationList: computed(() => this.tableWithAssignationList),
            selectedDate: computed(()=>this.selectedDate),
            selectedShift: computed(()=>this.selectedShift),
            //needUpdate: computed(()=>this.needUpdate)
            //updateTableLayout: this.updateTableLayout
        }
    },
    methods: {
        // initialLoading() {
        //     this.loadTableList();
        //     // this.loadAssignationList();
        // },
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
        
        loadDate() {
            //************************/
            //***A remettre en place**/
            //************************/
            const todayDate = new Date().toISOString().split('T')[0];
            this.selectedDate = todayDate;

            //this.selectedDate="2023-09-19"

        }
        // updateTableLayout() {

        //     console.log('tableList:', this.tableList);
        //     console.log('tableList:', this.tableList.length);
        //     console.log('assignationList:', this.assignationList);
        //     console.log('assignationList:', this.assignationList.length);
        //     if ((this.tableList.length>0) && (this.assignationList.length>0)) {
        //         console.log("yeesssss")
        //         const tempTable = this.tableList.map(table => {
        //             return {
        //                 number: table.number,
        //                 capacity: table.capacity,
        //                 isActive: table.isActive,
        //                 isAssign: false
        //             }
        //         });
        //         console.log("tableWithAssi..." + tempTable + this.tableWithAssignationList)

        //         this.assignationList.forEach(assignation => {
        //             const table = this.tableWithAssignationList.find(table => table.number === assignation.tableNumber);
        //             if (table) {
        //                 table.isAssign = true;
        //             }
        //         });
        //     }else{console.log("NONONNONNOOOOO")}
        // }
    },
 
    watch: {

        // tableList(){
        //     console.log('tableList changed');
        //     this.needUpdate = true;
        // }
    },
    beforeMount() {
        this.loadTableList();
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
        this.loadDate()

    }
}
</script>