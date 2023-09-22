<template>
    <v-sheet class="ma-2 w-100">
        <v-card height="75dvh">
            <tableIcon class="d-inline" v-for="table in tableList" :key="table.number"
                :tableNumber="table.number" :tableCapacity="table.capacity" :tableIsActive="table.isActive"
                :isAssign="table.isAssign">
            </tableIcon>

        </v-card>
    </v-sheet>
</template>

<script>

import tableIcon from "../tablepage/Table.vue"

export default {
    components: {
        tableIcon
    },
    inject: ['tableList', 'assignationList'],
    data() {
        return {
            tableWithAssignationList: []
            //hasReservation: false,
        }
    },

    methods: {
        updateTableLayout() {
            // console.log('tableList:', this.tableList);
            // console.log('tableList:', this.tableList.length);
            // console.log('assignationList:', this.assignationList);
            // console.log('assignationList:', this.assignationList.length);
            // this.tableWithAssignationList = this.tableList.map(table => ({
            //     number: table.number,
            //     capacity: table.capacity,
            //     isActive: table.isActive,
            //     isAssign: false
            // }));
            // console.log("tableWithAssi..."+ this.tableWithAssignationList)
            

            this.tableList.forEach(table => {
                const assignation = this.assignationList.find(assignation => table.number === assignation.tableNumber);
                if (assignation) {
                    table.isAssign = true;
                }
            });
        }
    },
    watch:{
        async tableList(){
            console.log("tableList updated...")
            this.updateTableLayout();
        },
        async assignationList(){
            console.log("assignationList updated...")
            this.updateTableLayout();
        }
    },
    updated(){this.updateTableLayout();},
    async mounted() {
        this.updateTableLayout();
    }
    // computed: {
    //     isAssign() {
    //         if (this.assignationList.find(a => a.tableNumber === this.key)) {
    //             console.log("key : " + this.key)
    //             return this.isAssign =true;
    //         }
    //     }
    // }

}
</script>
