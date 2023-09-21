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
            date:"2023-09-19",
        }
    },
    provide() {
        return {
            employeeColor: computed(() => this.employeeColor),
            hasReservation: computed(() => this.hasReservation),
            //isAssign: computed(() => this.isAssign),
            tableList: computed(()=>this.tableList),
            assignationList: computed(()=>this.assignationList),
        }
    },
    methods: {
        initialLoading(){
            this.loadTableList();
            this.loadAssignationList();
        },
        loadTableList() {
            this.tableList = [];
            fetchAllTables().then(allTables => {
                allTables.forEach(table => {
                    this.tableList.push(table);
                });
            }).catch(err => {
                console.error(err);
            });
        },
        loadAssignationList(){
            this.assignationList = [];
            fetchAssignationByDate(this.date).then(allAssignations => {
                allAssignations.forEach(assignation => {
                    this.assignationList.push(assignation);
                });
            }).catch(err => {
                console.error(err);
            });
        }
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
        this.initialLoading();
    }
}
</script>