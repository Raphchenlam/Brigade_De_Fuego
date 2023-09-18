<template>
    <v-sheet v-if="reservationId">
        <v-card class="mr-10 ml-5 h-75">
            <v-dialog v-model="dialogEditReservation" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-end">
                        <EditBlackButton class="ma-2" v-bind="props"></EditBlackButton>
                    </v-row>
                    <v-divider class="my-5"></v-divider>
                </template>
                <v-card>
                    <v-card-title>
                        Modifier la reservation
                    </v-card-title>
                    <EditReservationForm :reservationId="reservation.id"></EditReservationForm>
                </v-card>
            </v-dialog>
            <p>Numero reservation : {{ reservation.id }}</p>
            <p>Nom client : {{ reservation.id }}</p>
            <p>Date: {{ reservation.id }}</p>
            <p>Heure : {{ reservation.id }}</p>
            <p>Nombre de personne: {{ reservation.id }}</p>
            <p>Table : {{ reservation.id }}</p>
            <p>Mention: {{ reservation.id }}</p>
            <p>Allergy: {{ reservation.id }}</p>
            <p>Mineur sur place ? {{ reservation.id }}</p>
            <p></p>
        </v-card>
    </v-sheet>
</template>

<script>
import EditBlackButton from '../../components/Reusable/EditBlackButton.vue';
import BlackButton from '../../components/Reusable/BlackButton.vue';
import EditReservationForm from './EditReservationForm.vue'
import { getReservationById } from '../../services/ReservationService';

export default {
    props: {
        reservationId: Number
    },
    components: {
        EditReservationForm,
        BlackButton,
        EditBlackButton
    },
    data() {
        return {
            dialogEditReservation: false,
            reservation: {},
            receivedId: {}
        };
    },
    watch: {
        receivedId() {
            console.log("In the res infos watch");
            this.loadReservation(this.receivedId);
        }
    },
    methods: {
        loadReservation(selectedReservationId) {
            console.log("dans le loadReservation");
            console.log("selectedReservationId " + selectedReservationId);
            if (selectedReservationId) {
                console.log("FETCH ICI")

                getReservationById(selectedReservationId).then(reservation => {
                    console.log("getReservationById" + this.reservation);
                    this.reservation = reservation;
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
                console.log("RESET ICI")
                this.reservation = {};
            }
        },
        closeEditReservationDialog() {
            this.dialogEditReservation = false;
        }
    },
    provide() {
        return {
            closeEditReservationDialog: this.closeEditReservationDialog
        };
    },
    mounted() {
        console.log("mounted");
        console.log("this.reservationId " + this.reservationId);

        if (this.reservationId) {
            console.log("inside mounted if");
            this.loadReservation(this.reservationId);
        }
    }
}

</script>