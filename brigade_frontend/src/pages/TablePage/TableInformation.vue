<template>
    <v-card>
        <v-row v-if="!tableInformation.tableIsActive"> <h3 color="red">Table INACTIVE</h3> </v-row>
        <v-row>
            <v-col><h2>Table # </h2></v-col>
            <v-col><h2>{{ tableInformation.tableNumber }}</h2></v-col>
        </v-row>
        <v-row>
            <v-col><h4></h4></v-col>
            <v-col></v-col>
        </v-row>
        <v-row>
            <v-col><h4></h4></v-col>
            <v-col></v-col>
        </v-row>
        <p> </p>
        <p>Capacity: {{ tableInformation.tableCapacity }}</p>
        <p>Active: {{ tableInformation.tableIsActive }}</p>
        <p>Assignee: {{ tableInformation.tableIsAssign }}</p>


    </v-card>
</template>

<script>

export default {
    inject: ['selectedTable'],
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