<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" lg="6">
                    <NextShift />
            </v-col>
            <v-col cols="12" md="6" lg="6">
                
                    <CurrentLeave />

            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import NextShift from './NextShift.vue'
import CurrentLeave from './LeavePeage/CurrentLeave.vue'

export default {
    components: {
        NextShift,
        CurrentLeave
    }
}
</script>