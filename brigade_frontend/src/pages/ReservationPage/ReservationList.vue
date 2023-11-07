<template>
    <v-sheet width="100%">
        <v-card class="ma-2">
            <v-row class="mb-0">
                <v-text-field @input="" v-model="search" hide-details placeholder="Rechercher une réservation..."
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
            <v-row v-if='$route.path == "/operation/reservation"'>
                <v-text-field type="date" class="ma-2 pa-4" label="Date Debut" v-model="startDate"
                    @click:clear="resetStartDate" clearable hint="Le 'X' réinitialise la date à celle d'aujourd'hui"
                    persistent-hint>
                </v-text-field>
                <v-text-field type="date" class="ma-2 pa-4" label="Date Fin" v-model="endDate" @click:clear="resetEndDate"
                    clearable hint="Le 'X' réinitialise la date à celle d'aujourd'hui" persistent-hint>
                </v-text-field>
            </v-row>
            <v-radio-group v-model="shiftShow" v-if='$route.path == "/operation/reservation"'>
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
import { computed } from "vue";
import { VDataTable } from 'vuetify/labs/VDataTable'
import NewReservationForm from "../ReservationPage/NewReservationForm.vue"
import BlackButton from '../../components/Reusable/BlackButton.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';

export default {
    inject: ['loadReservationInformations', 'selectedDate', 'selectedShift', 'editedFirstName', 'toLocale', 'loadDate', 'reservations', 
        'loadReservations', 'refreshWithUpdatedReservation', 'selectedReservationId', 'tableIsInactiveToday'],
    components: {
        VDataTable,
        NewReservationForm,
        BlackButton,
        DarkRedButton
    },
    data() {
        return {
            todayDate: null,
            startDate: null,
            endDate: null,
            search: (!!this.editedFirstName) ? this.editedFirstName : "",
            shiftShow: (!!this.selectedShift) ? this.selectedShift : "all",
            modal: false,
            selected: [],
            filteredReservationList: [],
            dialogNewReservation: false,
            hasNewReservation: false,
        };
    },
    provide() {
        return {
            closeNewReservationDialog: this.closeNewReservationDialog,
            refreshWithNewreservation: this.refreshWithNewreservation,
            hasNewReservation: computed(() => this.hasNewReservation)
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
            if (this.startDate != this.endDate) {
                if (this.startDate == "") this.resetStartDate();

                const startDateObj = this.toLocale(this.startDate);
                const endDateObj = this.toLocale(this.endDate);

                if (startDateObj.date.year > endDateObj.date.year) {
                    this.endDate = this.startDate;

                } else if (startDateObj.date.year >= endDateObj.date.year
                    && startDateObj.date.month > endDateObj.date.month) {
                    this.endDate = this.startDate;

                } else if (startDateObj.date.year >= endDateObj.date.year
                    && startDateObj.date.month >= endDateObj.date.month
                    && startDateObj.date.day >= endDateObj.date.day) {
                    this.endDate = this.startDate;
                }

                this.loadReservations(this.startDate, this.endDate);
            }
        },
        endDate() {
            if (this.startDate != this.endDate) {
                if (this.endDate == "") this.resetEndDate();

                const startDateObj = this.toLocale(this.startDate);
                const endDateObj = this.toLocale(this.endDate);

                if (startDateObj.date.year > endDateObj.date.year) {
                    this.startDate = this.endDate;

                } else if (startDateObj.date.year >= endDateObj.date.year
                    && startDateObj.date.month > endDateObj.date.month) {
                    this.startDate = this.endDate;

                } else if (startDateObj.date.year >= endDateObj.date.year
                    && startDateObj.date.month >= endDateObj.date.month
                    && startDateObj.date.day >= endDateObj.date.day) {
                    this.startDate = this.endDate;
                }

                this.loadReservations(this.startDate, this.endDate);
            }

        },
        'selected': {
            handler: function () {
                this.loadReservationInformations(this.selected[0]);
            },
            deep: true
        },
        selectedDate() {
            this.endDate = this.startDate = this.selectedDate;
            this.loadReservations(this.selectedDate, this.selectedDate);
        },
        selectedShift() {
            this.shiftShow = this.selectedShift;
            this.loadReservations(this.selectedDate, this.selectedDate);
        },
        hasNewReservation() {
            if (this.hasNewReservation) {
                (this.selectedDate) ? this.loadReservations(this.selectedDate, this.selectedDate) : this.loadReservations(this.startDate, this.endDate);
                this.hasNewReservation = false;
            }
        },
        tableIsInactiveToday() {
            if (this.tableIsInactiveToday) {
                this.loadReservations(this.selectedDate, this.selectedDate);
            }
        },
        selectedReservationId() {
            if (this.selectedReservationId != null) {
                this.selected[0] = this.selectedReservationId;
            } else {
                this.selected = [];
            }
        },
        editedFirstName() {
            this.search = this.editedFirstName;
        },
        refreshWithUpdatedReservation(){
            if(this.refreshWithUpdatedReservation === false) this.loadReservations(this.startDate, this.endDate);
        }
    },
    methods: {
        refreshWithNewreservation(newReservation) {
            // garder l'ordre comme ceci, sinon ça ne fonctionne pas avec les méthodes asynchrones
            const newReservationShift = newReservation[3];
            this.shiftShow = newReservationShift;

            const dateOnlyOfNewReservation = newReservation[1].split("T")[0];
            this.startDate = dateOnlyOfNewReservation;
            this.endDate = this.startDate;

            (this.selectedDate) ? this.loadDate(dateOnlyOfNewReservation, newReservationShift) : this.loadReservations(this.startDate, this.endDate);

            this.selected[0] = newReservation[0];
            this.search = newReservation[2];
        },
        filterReservations() {
            this.filteredReservationList = [];

            this.reservations.forEach(reservation => {
                var reservationtoKeep;

                if (this.shiftShow == "Midi" && parseInt(reservation.startTime.split(':').slice(0)[0]) <= 15) {
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
                    const clientsFullNameTemp = reservationtoKeep.clientFirstname + " " + reservationtoKeep.clientLastname;
                    const clientsFullName = (clientsFullNameTemp.length <= 25) ? clientsFullNameTemp : clientsFullNameTemp.substring(0, 25) + "...";

                    let listInformationConcatenation = "";
                    listInformationConcatenation += reservationtoKeep.tableNumber ? "#" + reservationtoKeep.tableNumber : "N/A";
                    listInformationConcatenation += " - ";
                    listInformationConcatenation += clientsFullName;
                    listInformationConcatenation += " (" + reservationtoKeep.clientPhoneNumber + ") - ";
                    listInformationConcatenation += reservationtoKeep.peopleCount + " personnes - ";
                    listInformationConcatenation += reservationtoKeep.date + " à " + formattedStartTime;
                    listInformationConcatenation += allergies;



                    const reservationToAdd = {
                        "listInformation": listInformationConcatenation,
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
            const newDate = this.todayDate;
            this.loadReservations(newDate, this.endDate);
            this.startDate = newDate;
        },
        resetEndDate() {
            const newDate = this.todayDate;
            this.loadReservations(this.startDate, newDate);
            this.endDate = newDate;
        }
    },
    mounted() {
        if (!(!!this.selectedDate)) {
            this.todayDate = this.toLocale(new Date().toLocaleDateString("en-GB")).date.fullDate;
            this.endDate = this.startDate = this.todayDate;
            this.loadReservations(this.startDate, this.endDate);
        } else {
            this.loadReservations(this.selectedDate, this.selectedDate);
        }
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

