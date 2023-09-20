<template>
  <v-row class="justify-space-between">
    <ReservationList class="h-screen w-50"></ReservationList>
    <ReservationInformation class="h-screen w-50" v-if="selectedReservationId" :reservationId="selectedReservationId"></ReservationInformation>
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