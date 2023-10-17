<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="editReservationForm">
            <v-row class="justify-center">
                <p>Client : {{ reservation.firstName + " " + reservation.lastName }}</p>
            </v-row>
            <v-row class="justify-center">
                <v-text-field v-model="reservation.fullDate" type="datetime-local" class="ma-2"
                    label="Date de la reservation" clearable>
                </v-text-field>
                <v-text-field v-model="reservation.peopleCount" width="10px" type="number" class="shrink ma-2"
                    label="Nombre de personnes" clearable>
                </v-text-field>
            </v-row>
            <v-textarea v-model="reservation.mention" label="Mentions speciales"></v-textarea>
            <v-checkbox v-model="reservation.hasMinor" label="Mineur sur place"></v-checkbox>
            <v-row class="justify-space-between">
                <cols>
                    <SmallBlackButton class="mx-5" width="auto" textbutton="No Show"></SmallBlackButton>
                </cols>
                <cols>
                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                    <DarkRedButton class="mx-5" textbutton="Sauvegarder"></DarkRedButton>
                </cols>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import SmallBlackButton from '../../components/Reusable/SmallBlackButton.vue';
import { getReservationById } from '../../services/ReservationService';

export default {
    inject: ['closeEditReservationDialog'],
    props: {
        reservationId: Number
    },
    data() {
        return {
            reservation: {},
            // id: null,
            // tableNumber: null,
            // clientId: null,
            // clientName: null,
            // statusCode: null,
            // peopleCount: null,
            // date: null,
            // startTime: null,
            // // fullDate: "2023-10-15 18:00", //FAIRE BIEN ATTENTENTION A CE FORMAT... C'EST CELUI UTILISER PAR LE V-TEXT-FIELD
            // fullDate: null, //FAIRE BIEN ATTENTENTION A CE FORMAT... C'EST CELUI UTILISER PAR LE V-TEXT-FIELD
            // endTime: null,
            // mention: null,
            // hasMinor: false,
            // takenBy: null

        }
    },
    components: {
        DarkRedButton,
        SmallBlackButton
    },
    methods: {
        loadReservation(receivedReservationId) {
            if (receivedReservationId) {
                getReservationById(receivedReservationId)
                    .then(reservation => {
                        this.reservation = {
                            ...reservation,
                            fullDate: reservation.date + " " + reservation.startTime
                        };
                    }).catch(err => {
                        console.error(err);
                    })
            }
            else {
                this.reservation = {};
            }
        },
        closeDialog() {
            this.closeEditReservationDialog();
        }
    },
    mounted() {
        this.loadReservation(this.reservationId);
    }
}
</script>

<style scoped>
.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 80%;
    max-width: 80rem;
}
</style>