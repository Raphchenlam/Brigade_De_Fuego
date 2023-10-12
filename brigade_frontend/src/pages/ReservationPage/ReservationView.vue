<template>
  <v-row class="pa-2">
    <v-col>
      <ReservationList class="pa-2"></ReservationList>
    </v-col>
    <v-col>
      <ReservationInformation class="pa-2" v-if="selectedReservationId" 
      :reservationId="selectedReservationId"></ReservationInformation>
    </v-col>
  </v-row>
</template>
    
<script>
import OperationMenu from '../../components/OperationMenu.vue';
import operationSession from "../../sessions/OperationSession"
import ReservationInformation from './ReservationInformation.vue';
import ReservationList from './ReservationList.vue';

export default {
  name: 'ReservationView',
  components: {
    OperationMenu,
    ReservationList,
    ReservationInformation
  },
  data() {
    return {
      operationSession: operationSession,
      selectedReservationId: null
    }
  },
  methods: {
    loadReservationInformations(receivedReservationId) {
      this.selectedReservationId = receivedReservationId;
    }
  },
  provide() {
    return {
      loadReservationInformations: this.loadReservationInformations
    };
  },
  mounted() {
    if (!operationSession.isActive) {
      this.$router.push('/operation');
    }
  }
}
</script>