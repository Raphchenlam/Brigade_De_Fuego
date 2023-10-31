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
      selectedReservationId: null,
      selectedDate: null,
      selectedShift: null,
      editedFirstName: null,
      refreshWithUpdatedReservation: null
    }
  },
  methods: {
    loadReservationInformations(receivedReservationId) {
      this.selectedReservationId = receivedReservationId;
    },
    editedReservationRefreshAndSearch(refreshingInformations) {
      this.refreshWithUpdatedReservation = refreshingInformations.changeListFilters;

      if (refreshingInformations.changeListFilters) {
        this.editedFirstName = refreshingInformations.firstName;
        this.selectedDate = refreshingInformations.date;
        this.selectedShift = refreshingInformations.shift;
        this.loadReservations(this.selectedDate, this.selectedDate);
      }

      setTimeout(() => this.refreshWithUpdatedReservation = null);
    },
    loadReservations(startDate, endDate) {
      getReservationList(startDate, endDate)
        .then((reservationList) => {
          this.reservations = reservationList.sort((a, b) => {
            const firstNameA = a.clientFirstname.toUpperCase();
            const firstNameB = b.clientFirstname.toUpperCase();

            if (firstNameA < firstNameB) return -1;
            if (firstNameA > firstNameB) return 1;

            return 0;
          });;
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
      editedReservationRefreshAndSearch: this.editedReservationRefreshAndSearch,
      reservations: computed(() => this.reservations),

      editedFirstName: computed(() => this.editedFirstName),
      selectedDate: computed(() => this.selectedDate),
      selectedShift: computed(() => this.selectedShift),
      refreshWithUpdatedReservation: computed(() => this.refreshWithUpdatedReservation),
    };
  },
  mounted() {
    if (!operationSession.isActive) {
      this.$router.push('/operation');
    }
  }
}
</script>