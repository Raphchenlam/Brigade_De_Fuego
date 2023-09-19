<template>
    <v-sheet v-if="reservationId">
        <v-card class="mr-10 ml-5 h-75">
            <v-dialog v-model="dialogEditReservation" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-space-between">
                        <div>
                            <h1 class="mt-5 ml-10">{{ reservation.firstName + " " + reservation.lastName }}</h1>
                        </div>
                        <div>
                            <h1 class="mt-5 ml-10" :class="{ noTable: !reservation.tableNumber }">{{ reservation.tableNumber
                                ? "Table #" + reservation.tableNumber : "Aucune Table" }}</h1>
                        </div>
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
            console.log("In the res infos watch");
            this.loadReservation(this.reservationId);
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