<template>
    <v-sheet width="100%" class="pa-2" v-if="reservationId">
        <v-card >
            <v-dialog v-model="dialogEditReservation" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-space-between">
                        <v-col>
                            <h1 class="mt-5 ml-10">{{ reservation.firstName + " " + reservation.lastName }}</h1>
                        </v-col>
                        <v-col>
                            <h1 class="mt-5 ml-10" 
                            :class="{ noTable: !reservation.tableNumber }">
                            {{ reservation.tableNumber ? "Table #" + reservation.tableNumber : "Aucune Table" }}</h1>
                        </v-col>
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
            <v-row>
                <v-col class="ma-5 justify-space-between">
                    <p :class="{ green: reservation.status == 'Confirmé' }">Status : {{ reservation.status }}</p>
                    <p>Numero reservation : {{ reservation.id }}</p>
                    <p>Nombre de personne: {{ reservation.peopleCount }}</p>
                    <p v-if="reservation.hasMinor"><strong>Mineur sur place !</strong></p>
                    <p v-if="reservation.isFavorite"><strong>Est un client favoris !</strong></p>
                </v-col>
                <v-col class="ma-5 justify-space-between">
                    <p>Date: {{ reservation.date }}</p>
                    <p>Heure : {{ reservation.startTime }}</p>
                    <p v-if="reservation.mention">Mention: {{ reservation.mention }}</p>
                    <p v-if="reservation.allergy">Allergy: {{ reservation.allergy }}</p>
                </v-col>
            </v-row>
            <v-card class="ma-5 justify-space-between" color="#36454f">
                <v-card-title v-if="reservation.isBlacklisted" class="red ma-2">
                    <strong>BLACKLISTED!</strong>
                </v-card-title>
            </v-card>
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
        };
    },
    watch: {
        reservationId() {
            this.loadReservation(this.reservationId);
        }
    },
    methods: {
        loadReservation(selectedReservationId) {
            if (selectedReservationId) {
                getReservationById(selectedReservationId)
                .then(reservation => {
                    this.reservation = reservation;
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
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
        if (this.reservationId) {
            this.loadReservation(this.reservationId);
        }
    }
}

</script>

<style scoped>
.noTable {
    color: orange
}

.red {
    color: red;
    font-size: 2em;
    text-align: center
}

.green {
    color: green
}
</style>