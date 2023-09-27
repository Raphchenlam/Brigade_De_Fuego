<template>
    <v-sheet class="px-10 h-15 w-50">
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
                <v-text-field type="date" class="ma-2 pa-4" label="Date Debut" v-model="startDate"
                    @click:clear="resetStartDate" clearable hint="'Clear' réinitialise la date courante" persistent-hint>
                </v-text-field>
                <v-text-field type="date" class="ma-2 pa-4" label="Date Fin" v-model="endDate" @click:clear="resetEndDate"
                    clearable hint="'Clear' réinitialise la date courante" persistent-hint>
                </v-text-field>
            </v-row>
            <v-radio-group v-model="shiftShow">
                <v-row class="pl-5">
                    <v-radio label="Midi" value="Midi"></v-radio>
                    <v-radio label="Soir" value="Soir"></v-radio>
                    <v-radio label="Journee complete" value="all"></v-radio>
                </v-row>
            </v-radio-group>
            <v-list class="v-list" v-model:selected='selected' :items="filteredReservationList" item-title="listInformation"
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
    inject: ['loadReservationInformations'],
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
            refreshWithNewreservation: this.refreshWithNewreservation
        };
    },
    watch: {
        shiftShow() {
            this.filterReservations();
        },
        reservations() {
            this.filterReservations();
        },
        search() {
            this.filterReservations();
        },
        startDate() {
            if (this.startDate == "") {
                this.resetStartDate();
            }

            if (this.startDate != this.endDate) {
                this.loadReservations(this.startDate, this.endDate);
            }
        },
        endDate() {
            if (this.endDate == "") {
                this.resetEndDate();
            }

            if (this.startDate != this.endDate) {
                this.loadReservations(this.startDate, this.endDate);
            }
        },
        selected() {
            this.loadReservationInformations(this.selected[0]);
        },
    },
    methods: {
        refreshWithNewreservation(newReservation) {
            this.loadReservations(this.startDate, this.endDate);
            this.selected = newReservation;
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
        filterReservations() {
            this.filteredReservationList = [];

            this.reservations.forEach(reservation => {
                var reservationtoKeep;

                if (this.shiftShow == "Midi" && parseInt(reservation.startTime.split(':').slice(0)[0]) < 15) {
                    reservationtoKeep = reservation; 
                } else if (this.shiftShow == "Soir" && parseInt(reservation.startTime.split(':').slice(0)[0]) > 15) {
                    reservationtoKeep = reservation;
                } else if (this.shiftShow == "all") {
                    reservationtoKeep = reservation;
                }

                if (reservationtoKeep) {
                    const explodedTime = reservationtoKeep.startTime.split(":");
                    const hour = explodedTime[0];
                    const min = explodedTime[1];
                    const formattedStartTime = hour + "h" + min;

                    const allergies = (reservationtoKeep.clientAllergy) ? " - Allergie(s) : " + reservationtoKeep.clientAllergy : "";

                    const reservationToAdd = {
                        "listInformation":
                            reservationtoKeep.clientFirstname + " " + reservationtoKeep.clientLastname + " (" + reservationtoKeep.clientPhoneNumber + ") - " + reservationtoKeep.peopleCount + " personnes - " + reservationtoKeep.date + " à " + formattedStartTime + allergies,
                        ...reservationtoKeep,
                        props: {
                            color: 'red',
                        },
                    };

                    if (reservationToAdd.listInformation.toUpperCase().indexOf(this.search.toUpperCase()) >= 0) {
                        this.filteredReservationList.push(reservationToAdd);
                    }

                }
            });
        },
        closeNewReservationDialog() {
            this.dialogNewReservation = false;
        },
        resetStartDate() {
            const newDate = new Date().toISOString().split('T')[0];
            this.loadReservations(newDate, this.endDate);
            this.startDate = newDate;
        },
        resetEndDate() {
            const newDate = new Date().toISOString().split('T')[0];
            this.loadReservations(this.startDate, newDate);
            this.endDate = newDate;
        }
    },
    mounted() {
        this.endDate = this.startDate = new Date().toISOString().split('T')[0];
        this.loadReservations(this.startDate, this.endDate);

    }
}
</script>


<style scoped>
.v-btn {
    font-size: xx-large;
}

.v-list {
    height: 600px;
    overflow-y: auto;
}
</style>