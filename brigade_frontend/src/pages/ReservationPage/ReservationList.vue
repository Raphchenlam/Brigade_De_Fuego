<template>
    <v-sheet class="px-10 h-75 w-50">
        <v-card class="h-75">
            <v-row class="mb-0">
                <v-text-field @input="" v-model="search" hide-details placeholder="Search name..."
                    class="ma-2"></v-text-field>
                <v-dialog v-model="dialogNewReservation" width="100%">
                    <template v-slot:activator="{ props }">
                        <div class="ma-2 text-center">
                            <BlackButton class="h-100 w-100" v-bind="props" textbutton="+">
                            </BlackButton>
                        </div>
                    </template>
                    <v-card>
                        <v-card-title>
                            Creer une nouvelle reservation
                        </v-card-title>
                        <NewReservationForm></NewReservationForm>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-row>
                <v-text-field type="date" class="ma-2" label="Date Debut" v-model="startDate" clearable>
                </v-text-field>
                <v-text-field type="date" class="ma-2" label="Date Fin" v-model="endDate" clearable>
                </v-text-field>
            </v-row>
            <v-radio-group v-model="shiftShow">
                <v-row class="pl-5">
                    <v-radio label="Midi" value="lunch"></v-radio>
                    <v-radio label="Soir" value="dinner"></v-radio>
                    <v-radio label="Journee complete" value="all"></v-radio>
                </v-row>
            </v-radio-group>
            <v-list v-model:selected='selected' :items="filteredReservationList" item-title="listInformation"
                item-value="id">
            </v-list>
        </v-card>
    </v-sheet>
    <p></p>
</template>


<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import NewReservationForm from "../reservationpage/NewReservationForm.vue"
import BlackButton from '../../components/Reusable/BlackButton.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { getReservationList } from '../../services/ReservationService';

export default {
    inject: [ 'loadReservation' ],
    components: {
        VDataTable,
        NewReservationForm,
        BlackButton,
        DarkRedButton
    },
    data() {
        return {
            startDate: null,
            endDate: null,
            search: "",
            shiftShow: "all",
            modal: false,
            selected: [],
            reservations: [],
            filteredReservationList: [],
            dialogNewReservation: false,
        };
    },
    provide() {
        return {
            closeNewReservationDialog: this.closeNewReservationDialog,
        };
    },
    watch: {
        shiftShow() {
            this.filterReservations();
        },
        startDate(){
            this.loadReservations(this.startDate, this.endDate);
        },
        endDate(){
            this.loadReservations(this.startDate, this.endDate);
        },
        reservations(){
            this.filterReservations();
        },
        selected(){
            this.loadReservation(this.selected[0]);
        }
    },
    methods: {
        loadReservations(startDate, endDate) {
            getReservationList(startDate, endDate)
                .then((reservationList) => {
                    this.reservations = reservationList;
                })
                .catch((err) => {
                    console.log(err);
                    alert(err.message);
                });
        },
        filterReservations() {
            this.filteredReservationList = [];

            this.reservations.forEach(reservation => {
                var reservationtoKeep;
                if (this.shiftShow == "lunch" && parseInt(reservation.startTime.split(':').slice(0)[0]) < 15) {
                    reservationtoKeep = reservation;
                } else if (this.shiftShow == "dinner" && parseInt(reservation.startTime.split(':').slice(0)[0]) > 15) {
                    reservationtoKeep = reservation;
                } else if (this.shiftShow == "all") {
                    reservationtoKeep = reservation;
                }

                if (reservationtoKeep) {
                    // const allergies = (reservationtoKeep.clientAllergy) ?  ", Allergie(s) : " + reservationtoKeep.clientAllergy : " aucune";
                    const allergies = (reservationtoKeep.clientAllergy) ?  reservationtoKeep.clientAllergy : " - ";
                    const reservationToAdd = {
                        "listInformation": 
                        reservationtoKeep.clientFirstname + " " + reservationtoKeep.clientLastname + " (" + reservationtoKeep.clientPhoneNumber + ") - " + reservationtoKeep.peopleCount + " personnes - " + reservationtoKeep.date + " à " + reservationtoKeep.startTime + ", Allergie(s) : " + allergies,
                        ...reservationtoKeep,
                        props: {
                            color: 'red',
                        },
                    };

                    this.filteredReservationList.push(reservationToAdd);
                }
            });
        },
        closeNewReservationDialog() {
            this.dialogNewReservation = false;
        },
    },
    mounted() {
        this.endDate = this.startDate = new Date().toISOString().split('T')[0];
    }
}
</script>


<style scoped>
.v-btn {
    font-size: xx-large;
}
</style>