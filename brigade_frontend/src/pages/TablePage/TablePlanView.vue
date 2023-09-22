<template>
    <v-sheet width="100%" class="pa-2">
        <v-row>
            <v-col>
                <v-row>
                    <TableLayout class="pa-2"></TableLayout>
                </v-row>
                <v-row>
                    <TableInformation class="pa-2"></TableInformation>
                </v-row>
            </v-col>
            <v-col cols="4">
                <v-row>
                    <ReservationList class="pa-2"></ReservationList>
                </v-row>
                <v-row>
                    <ReservationInformation class="pa-2"></ReservationInformation>
                </v-row>

            </v-col>
        </v-row>
    </v-sheet>
</template>


<script>
import { computed } from "vue";
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
        TableInformation
    },
    data() {
        return {
            operationSession: operationSession,
            employeeColor: "#8b0000",
            hasReservation: true,
            //isAssign: false,
            tableList: [],
            assignationList: [],
            //tableWithAssignationList: [],
            date: "2023-09-19",
        }
    },
    provide() {
        return {
            employeeColor: computed(() => this.employeeColor),
            hasReservation: computed(() => this.hasReservation),
            //isAssign: computed(() => this.isAssign),
            tableList: computed(() => this.tableList),
            assignationList: computed(() => this.assignationList),
            tableWithAssignationList: computed(() => this.tableWithAssignationList),
            //updateTableLayout: this.updateTableLayout
        }
    },
    methods: {
        initialLoading() {
            this.loadTableList();
            this.loadAssignationList();
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
        loadAssignationList() {
            console.log('Loading assignation list...');
            this.assignationList = [];
            fetchAssignationByDate(this.date).then(allAssignations => {
                allAssignations.forEach(assignation => {
                    this.assignationList.push(assignation);
                });
            }).catch(err => {
                console.error(err);
            });
        },
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
    // watch: {
    //     assignationList() {
    //         console.log('assignationList changed');
    //         this.updateTableLayout();
    //     },
    //     tableList(){
    //         console.log('tableList changed');
    //         this.updateTableLayout();
    //     }
    // },
    async created(){
        await this.initialLoading();
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
       
    }
}
</script>