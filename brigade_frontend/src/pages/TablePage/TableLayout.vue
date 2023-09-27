<template>
    <v-sheet class="ma-2 w-100">
        <v-card>
            <tableIcon class="d-inline" v-for="table in tableWithAssignationList" :key="table.number"
                :tableNumber="table.number" :tableCapacity="table.capacity" :tableIsActive="table.isActive"
                :isAssign="table.isAssign" :assignation="table.assignation" @click="displaySelectedTable(table.number)">
            </tableIcon>
        </v-card>
    </v-sheet>
</template>

<script>

import tableIcon from "../tablepage/Table.vue";
import { fetchAssignationByDate } from '../../services/TableService';

export default {
    components: {
        tableIcon
    },
    inject: ['tableWithAssignationList', 'selectedDate', 'selectedShift', 'displaySelectedTable'],
    data() {
        return {

        }
    },


    methods: {

    }

}
</script>
