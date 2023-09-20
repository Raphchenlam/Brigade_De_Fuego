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
                <ReservationList class="pa-2" ></ReservationList>
            </v-row>
            <v-row>
                <ReservationInformation class="pa-2" ></ReservationInformation>
            </v-row>
            
        </v-col>
    </v-row>
</v-sheet>
</template>


<script>
import OperationMenu from '../../components/OperationMenu.vue';
import operationSession from "../../sessions/OperationSession"
import ReservationList from '../ReservationPage/ReservationList.vue';
import ReservationInformation from '../ReservationPage/ReservationInformation.vue';
import TableLayout from './TableLayout.vue';
import TableInformation from './TableInformation.vue';

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
            operationSession: operationSession
        }
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
    }
}
</script>