<template>
  <v-row class="pa-2">
    <v-col>
      <ReservationList class="pa-2"></ReservationList>
    </v-col>
    <v-col>
      <ReservationInformation class="pa-2" v-if="selectedReservationId" :reservationId="selectedReservationId">
      </ReservationInformation>
    </v-col>
  </v-row>
</template>
    
<script>
import { computed } from 'vue';
import OperationMenu from '../../components/OperationMenu.vue';
import operationSession from "../../sessions/OperationSession"
import ReservationInformation from './ReservationInformation.vue';
import ReservationList from './ReservationList.vue';
import { getReservationList } from '../../services/ReservationService';


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
      reservations: [],
      selectedReservationId: null
    }
  },
  methods: {
    loadReservationInformations(receivedReservationId) {
      this.selectedReservationId = receivedReservationId;
    },
    loadReservations(startDate, endDate) {
      getReservationList(startDate, endDate)
        .then((reservationList) => {
          this.reservations = reservationList;
        })
        .catch((err) => {
          console.error(err);
          alert(err.message);
        });
    },
  },
  provide() {
    return {
      loadReservationInformations: this.loadReservationInformations,
      loadReservations: this.loadReservations,
      reservations: computed(() => this.reservations),


    };
  },
  mounted() {
    if (!operationSession.isActive) {
      this.$router.push('/operation');
    }
  }
}
</script>