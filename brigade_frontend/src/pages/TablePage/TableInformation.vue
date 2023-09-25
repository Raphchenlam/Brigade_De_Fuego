<template>
    <v-card>
        <p>Numero: {{ tableInformation.tableNumber }}</p>
        <p>Capacity: {{ tableInformation.tablecapacity }}</p>
        <p>Active: {{ tableInformation.tableIsActive }}</p>
        <p>Assignee: {{ tableInformation.tableIsAssign }}</p>


    </v-card>
</template>

<script>
inject: ['selectedTable']
export default {
    data() {
        return {
            tableInformation: {},

        }
    },
    watch:{
        selectedTable(){
            const tempTable={
                tableNumber:this.selectedTable.number,
                tableCapacity:this.selectedTable.capacity,
                tableIsActive:this.selectedTable.isActive,
                tableIsAssign:this.selectedTable.isAssign
            }
            this.tableInformation = tempTable;
        }
    }

}
</script>