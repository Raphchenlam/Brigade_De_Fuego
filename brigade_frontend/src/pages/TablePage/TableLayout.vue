<template>
    <v-sheet class="ma-2 w-100">
        <v-card v-if="!inEditionMode">
            <tableIcon class="d-inline" v-for="table in tableWithAssignationList" :key="table.number"
                :tableNumber="table.number" :tableCapacity="table.capacity" :tableIsActive="table.isActive"
                :isAssign="table.isAssign" :assignation="table.assignation" :hasReservation="table.hasReservation" :reservation="table.reservation">
            </tableIcon>
        </v-card>
        <v-card v-if="inEditionMode">
            <tableIcon class="d-inline" v-for="table in localAssignations" :key="table.number"
                :tableNumber="table.number" :tableCapacity="table.capacity" :tableIsActive="table.isActive"
                :isAssign="table.isAssign" :assignation="table.assignation" :hasReservation="table.hasReservation" :reservation="table.reservation">
            </tableIcon>
        </v-card>
    </v-sheet>
</template>

<script>

import tableIcon from "../tablepage/Table.vue";

export default {
    components: {
        tableIcon
    },
    inject: ['tableWithAssignationList', 'inEditionMode', 'localAssignations'],
    data() {
        return {

        }
    },

}
</script>
