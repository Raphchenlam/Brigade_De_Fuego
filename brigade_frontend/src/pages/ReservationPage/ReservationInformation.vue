<template>
    <v-sheet width="100%" class="pa-2" v-if="reservationId">
        <v-card>
            <v-dialog v-model="dialogEditReservation" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-space-between">
                        <v-col>
                            <h1 class="mt-5 ml-10">{{ reservation.firstName + " " + reservation.lastName }}</h1>
                        </v-col>
                        <v-col>
                            <h1 class="mt-5 ml-10" :class="{ noTable: !reservation.tableNumber }">
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
                    <p :class="{ green: reservation.status == 'Confirmé', red: reservation.status == 'Blacklisted', redStatus: reservation.status == 'En retard' }">Status : {{ reservation.status }}</p>
                    <p>Numero reservation : {{ reservation.id }}</p>
                    <p>Nombre de personne: {{ reservation.peopleCount }}</p>
                    <p v-if="reservation.hasMinor"><strong>Mineur sur place !</strong></p>
                    <p v-if="reservation.isFavorite"><strong>Est un client favoris !</strong></p>
                </v-col>
                <v-col class="ma-5 justify-space-between">
                    <p>Date: {{ reservation.date }}</p>
                    <p>Heure : {{ reservation.startTime }}</p>
                    <p v-if="reservation.allergy">Allergy: {{ reservation.allergy }}</p>
                </v-col>
            </v-row>
            <v-card class="ma-4 pl-4 pb-4 pr-4 elevation-4" v-if="reservation.mention">
                <v-card-title><strong>Mention: </strong></v-card-title>
                <p>{{ reservation.mention }}</p>
            </v-card>
            <v-card class="ma-5 justify-space-between" color="#36454f">
                <v-card-title v-if="reservation.isBlacklisted" class="red2 ma-2">
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
    inject: ['selectedTable', 'refreshWithUpdatedReservation','reservationInformations'],
    data() {
        return {
            dialogEditReservation: false,
            reservation: {},
        };
    },
    watch: {
        reservationId() {
            this.loadReservation(this.reservationId);
        },
        refreshWithUpdatedReservation(){
            this.loadReservation(this.reservationId);
        },
        'reservationInformations':{
            handler: function () {
                if(this.reservationInformations) this.reservation = this.reservationInformations;
            },
            deep: true
        },
    },
    methods: {
        async loadReservation(selectedReservationId) {
            if (selectedReservationId) {
                try {
                    this.reservation = await getReservationById(selectedReservationId)
                } catch (err) {
                    console.error(err);
                }
            }
            else {
                this.reservation = {};
            }
        },
        closeEditReservationDialog() {
            this.dialogEditReservation = false;
        },
        toggleReservation() {
            if (!!this.reservation.tableNumber) {
                this.reservation.tableNumber = null;
            } else if (this.reservation.tableNumber == null && this.selectedTable != null) {
                this.reservation.tableNumber = this.selectedTable.number;
            }
        }
    },
    provide() {
        return {
            closeEditReservationDialog: this.closeEditReservationDialog
        };
    },
    mounted() {
        console.clear();
        if (this.reservationId) {
            this.loadReservation(this.reservationId);
        }
    }
}

</script>

<style scoped>
p {
    word-break: break-all;
    white-space: normal;
}

.noTable {
    color: orange
}

.red {
    color: red;
    font-size: 1.5em;
    text-align: left
}
.red2 {
    color: red;
    font-size: 1.5em;
    text-align: center
}
.redStatus {
    color: red
}
.green {
    color: green
}
</style>