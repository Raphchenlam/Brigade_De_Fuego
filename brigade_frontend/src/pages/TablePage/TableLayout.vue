<template>
    <v-sheet class="ma-2 w-100">
        <v-card >
            <tableIcon class="d-inline" v-for="table in tableWithAssignationList" :key="table.number" :tableNumber="table.number"
                :tableCapacity="table.capacity" :tableIsActive="table.isActive" :isAssign="table.isAssign" :assignation="table.assignation"
                @click="displaySelectedTable(table.number)">
            </tableIcon>
        </v-card>
        <!-- <v-card v-else>
            <tableIcon class="d-inline" v-for="table in tableList" :key="table.number" :tableNumber="table.number"
                :tableCapacity="table.capacity" :tableIsActive="table.isActive" :isAssign="table.isAssign"
                @click="displaySelectedTable(table.number)">
            </tableIcon>
        </v-card> -->
    </v-sheet>
</template>

<script>

import tableIcon from "../tablepage/Table.vue";
import { fetchAssignationByDate } from '../../services/TableService';

export default {
    components: {
        tableIcon
    },
    inject: ['tableList', 'tableWithAssignationList', 'selectedDate', 'selectedShift','displaySelectedTable'],
    data() {
        return {
            // tableWithAssignationList: [],
            // assignationList: [],
            //selectedTable: null,
            //hasReservation: false,
        }
    },
    // provide() {
    //     return {
    //         displaySelectedTable:this.displaySelectedTable 
    //     }
    // },

    methods: {
        // displaySelectedTable(number) {
        //     console.log("DisplaySelectedTable : " + number)
        //     this.selectedTable = this.tableList.find((table) => {
        //         return table.number == number;
        //     })
        //     console.log("DisplaySelectedTable : " + this.selectedTable)

        // },
    //     loadAssignationList(date) {
    //         console.log('Loading assignation list...');
    //         this.assignationList = [];
    //         fetchAssignationByDate(date).then(allAssignations => {
    //             allAssignations.forEach(assignation => {
    //                 this.assignationList.push(assignation);
    //             });
    //         }).catch(err => {
    //             console.error(err);
    //         });
    //         console.log("assignationList: " + this.assignationList.length)
    //     },

    //     updateTableList() {
    //         console.log('tableList:', this.tableList);
    //         console.log('tableList:', this.tableList.length);
    //         // console.log('assignationList:', this.assignationList);
    //         // console.log('assignationList:', this.assignationList.length);
    //         this.tableWithAssignationList = this.tableList.map(table => ({
    //             number: table.number,
    //             capacity: table.capacity,
    //             isActive: table.isActive,
    //             isAssign: false
    //         }));
    //         console.log("tableWithAssi..." + this.tableWithAssignationList.length)
    //     },

    //     updateTableLayout(shift) {

    //         if (this.assignationList.length > 0) {
    //             console.log("Creating new floor plan...")
    //             this.assignationList.forEach(assignation => {
    //                 const table = this.tableList.find(table => {
    //                     return (table.number == assignation.tableNumber) && (assignation.shift == shift)
    //                 });

    //                 if (table) {
    //                     table.isAssign = true;
    //                 }
    //             })
    //         }
    //     }
    // },
    // watch: {
    //     tableList() {
    //         console.log('tableList changed');
    //         this.updateTableList();
    //     },
    //     selectedShift() {
    //         console.log('tableList changed');
    //         this.updateTableLayout(this.selectedShift)
    //     },
    //     selectedDate() {
    //         console.log('selectedDate changed');
    //         this.loadAssignationList(this.selectedDate);
    //     },
    //     tableWithAssignationList() {
    //         console.log('tableWithAssignation changed');
    //         this.updateTableLayout(this.selectedDate);
 }

    // },
    // updated() {
    //     // this.updateTableList();
    //     this.loadAssignationList();
    // }

}
</script>
