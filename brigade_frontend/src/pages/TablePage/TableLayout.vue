<template>
    <v-sheet class="ma-2 w-100">
        <v-card height="75dvh">
            <tableIcon class="d-inline" v-for="table in tableList" :key="table.number" :tableNumber="table.number"
                :tableCapacity="table.capacity" :tableIsActive="table.isActive" :isAssign="isAssign">
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
            key: null,
            //hasReservation: false,
            isAssign: false
        }
    },
    computed: {
        isAssign() {
            if (this.assignationList.find(a => a.tableNumber === this.key)) {
                console.log("key : " + this.key)
                return this.isAssign =true;
            }
        }
    }

}
</script>
