<template>
    <div class="ma-2" width="auto">
        <v-form @submit.prevent="verifyReservation" class="pa-10" validate-on="blur" ref="editReservationForm">
            <v-row class="justify-center">
                <h2>Client : {{ reservation.firstName + " " + reservation.lastName }}</h2>
            </v-row>
            <v-row class="justify-center">
                <v-col cols="4">
                    <v-text-field class="ma-2 pre-wrap" v-model="editedFullDate" type="datetime-local"
                        label="Date de la reservation" @click:clear="resetDate" clearable persistent-clear
                        hint="Le 'X' réinitialise ce champ à la valeur initial" persistent-hint
                        :rules="[rules.required, rules.dateIsValid]">
                    </v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field class="shrink ma-2" v-model="editedPeopleCount" width="10px" type="number"
                        onkeydown="return event.keyCode !== 69" :min="1" :max="12" label="Nombre de personnes" clearable
                        @click:clear="resetPeopleCount" persistent-clear
                        hint="Le 'X' réinitialise ce champ à la valeur initial" persistent-hint
                        :rules="[rules.required, rules.reservationMinimum, rules.reservationMaximum]">
                    </v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-select v-if="reservation.statusCode != 8" class="shrink ma-2" label="Select"
                        :items="reservationStatusList" v-model="editedStatusCode" item-title="name"
                        item-value="code"></v-select>
                    <v-select v-if="reservation.statusCode == 8" class="shrink ma-2" label="Select"
                        :items="reservationStatusList" v-model="editedStatusCode" item-title="name" item-value="code"
                        disabled></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2" no-gutters>
                    <v-checkbox class="pb-2" v-model="editedHasMinor" label="Mineur sur place"
                        hide-details="auto"></v-checkbox>
                </v-col>
                <v-col cols="auto" offset="2" no-gutters>
                    <h3 class="pl-4 table" v-if="table.number">Table #{{ table.number }}, capacité : {{ table.capacity }}
                    </h3>
                    <h3 class="pl-4 table noTable" v-if="!table.number">Aucune table</h3>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-textarea v-model="editedMention" label="Mentions speciales" :rules="[rules.fieldLength255]"></v-textarea>
            </v-row>
            <v-row class="justify-space-between">
                <cols>
                    <SmallBlackButton class="mx-5" width="200px" textbutton="No Show"
                        :disabled="reservation.statusCode == 8" @click="applyNoShowStatus()">
                    </SmallBlackButton>
                </cols>
                <cols>
                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                    <DarkRedButton class="mx-5" textbutton="Sauvegarder"
                        @click="viewEditedReservation = false, sendUpdate()" :disabled="saveButtonDisabled"></DarkRedButton>
                    <DarkRedButton class="mx-5" textbutton="Sauvegarder et Visualisé"
                        @click="viewEditedReservation = true, sendUpdate()" :disabled="saveButtonDisabled"></DarkRedButton>
                </cols>
            </v-row>
            <v-dialog v-model="dialogOKReservation" width="50%">
                <v-card class="ma-2 pa-2 text-center">
                    <v-card-title class="justify-center">
                        Confirmation
                    </v-card-title>
                    <v-card-text>
                        <v-row class="ma-2 justify-center">
                            <p>La reservation a bien été enregistré.</p>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogTablePasOk" width="50%">
                <v-card class="ma-2 pa-2 text-center">
                    <v-card-title class="justify-center">
                        CAPACITÉ DE LA TABLE EXCÉDÉ
                    </v-card-title>
                    <v-card-text>
                        <v-row class="ma-2 justify-center">
                            <p>Le nombre de personne(s) fournis ({{ this.editedPeopleCount }}) est supérieur à la capacité
                                de
                                la table #{{ this.table.number }} ({{ this.table.capacity }})</p>
                        </v-row>
                        <v-row>
                            <SmallBlackButton class="mx-5" width="200px" textbutton="Annulé"
                                @click="dialogTablePasOk = false">
                            </SmallBlackButton>
                            <SmallBlackButton class="mx-5" width="200px" textbutton="Enlevé table"
                                @click="removeTableAndSend()">
                            </SmallBlackButton>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogReservationNonModidier" width="50%">
                <v-card class="ma-2 pa-2 text-center">
                    <v-card-title class="justify-center">
                        Aucune modification n'a été apporté à la réservation
                    </v-card-title>
                    <v-card-text>
                        <v-row class="ma-2 justify-center">
                            <p>La reservation n'a pas été enregistré.</p>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import SmallBlackButton from '../../components/Reusable/SmallBlackButton.vue';
import { getReservationById, updateReservation, getReservationStatusList } from '../../services/ReservationService';
import { fetchTableByNumber } from '../../services/TableService';

export default {
    inject: ['closeEditReservationDialog', 'toLocale', 'isBeforeToday', 'loadReservationInformations', 'editedReservationRefreshAndSearch'],
    props: {
        reservationId: Number
    },
    data() {
        return {
            reservationStatusList: [],
            reservation: {},
            table: {},
            tableWasRemoved: false,
            editedDate: null,
            dialogOKReservation: false,
            dialogTablePasOk: false,
            dialogReservationNonModidier: false,
            editedStartTime: null,
            editedEndTime: null,
            editedFullDate: null,
            editedPeopleCount: null,
            editedMention: null,
            editedHasMinor: false,
            editedStatusCode: null,
            editedTableNumber: null,
            viewEditedReservation: false,
            peopleCountValid: true,
            dateValid: true,
            rules: {
                required: value => !!value || "Le champ est requis",
                dateIsValid: () => this.dateValid || "Date non valide\n\t- Ne doit pas etre avant la date d'aujourd'hui\n\t- Ni avant 11h ou apres 23h",
                reservationMinimum: value => (value >= 1) || "Le nombre de personnes minimum est de 1 pour une seule réservation.",
                reservationMaximum: value => (value <= 12) || "Le nombre de personnes maximum est de 12 pour une seule réservation.",
                fieldLength255: value => ((value) ? !(value.length > 254) : true) || "255 caractères maximum.",
            },
            formValid: true
        }
    },
    components: {
        DarkRedButton,
        SmallBlackButton
    },
    watch: {
        dialogOKReservation() {
            if (!this.dialogOKReservation) {
                this.closeAllDialog();
            }
        },
        dateValid() {
            if (this.editedDate == this.reservation.date && this.editedStartTime == this.reservation.startTime) {
                this.dateValid = true;
            }
        },
        editedFullDate() {
            this.dateValid = true;

            //Date management
            const reservationDateObject = this.toLocale(this.editedFullDate);
            this.editedFullDate = reservationDateObject.fullDate + " " + reservationDateObject.fullTime;
            this.editedDate = reservationDateObject.fullDate;

            // //Start time management
            this.editedStartTime = reservationDateObject.time.fullTime;

            // //End time management
            let endHour = reservationDateObject.time.hours + 3;
            let endMinute = reservationDateObject.time.minutes;
            if (endHour >= 24) {
                endHour = 23;
                endMinute = 59;
            }
            const endTimeHours = (endHour < 10) ? "0" + endHour : "" + endHour;
            const endTimeMinutes = (endMinute < 10) ? "0" + endMinute : "" + endMinute;
            this.editedEndTime = endTimeHours + ":" + endTimeMinutes;

            //Date validation
            if (this.editedDate != this.reservation.date || this.editedStartTime != this.reservation.startTime) {
                this.dateValid = !this.isBeforeToday(this.editedFullDate);
            } else {
                this.dateValid = true;
            }

            if (reservationDateObject.time.hour < 11 || reservationDateObject.time.hour >= 23) {
                this.dateValid = false;
            }

        },
    },
    methods: {
        loadReservation(receivedReservationId) {
            if (receivedReservationId) {
                getReservationById(receivedReservationId)
                    .then(reservation => {
                        this.editedDate = reservation.date;
                        this.editedFullDate = reservation.date + " " + reservation.startTime; // editedStartTime se regle dans le watch d editedFullDate
                        this.editedPeopleCount = reservation.peopleCount;
                        this.editedMention = reservation.mention;
                        this.editedHasMinor = reservation.hasMinor;
                        this.editedStatusCode = reservation.statusCode;
                        this.editedTableNumber = reservation.tableNumber;

                        this.reservation = {
                            ...reservation,
                            fullDate: this.editedFullDate
                        };

                        if (this.reservation.tableNumber) {
                            fetchTableByNumber(this.reservation.tableNumber)
                                .then(table => {
                                    if (table) {
                                        this.table = table;
                                    } else {
                                        alert(`${this.reservation.tableNumber} n'est pas trouvable`)
                                    }
                                })
                                .catch(err => {
                                    console.error(err);
                                    alert(err.message);
                                });
                        }
                    }).catch(err => {
                        console.error(err);
                    })
            }
            else {
                this.reservation = {};
            }
        },
        loadStatusList() {
            getReservationStatusList().then(statusListResponse => {
                if (statusListResponse) {
                    this.reservationStatusList = statusListResponse;
                }
            }).catch(err => {
                console.error(err);
                alert(err.message);
            })
        },
        closeDialog() {
            this.closeEditReservationDialog();
        },
        sendUpdate() {
            let updatedReservationInformations = { id: this.reservationId }

            if (this.dateValid && this.editedDate != this.reservation.date) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    date: this.editedDate
                }
            }

            if (this.editedStartTime != this.reservation.startTime) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    startTime: this.editedStartTime,
                    endTime: this.editedEndTime
                }
            }

            if (this.editedPeopleCount != this.reservation.peopleCount) {
                if (this.table.capacity < this.editedPeopleCount) {
                    if (!this.tableWasRemoved) {
                        this.dialogTablePasOk = true;
                    }

                    if (!this.editedTableNumber) {
                        updatedReservationInformations = {
                            ...updatedReservationInformations,
                            tableNumber: null,
                            peopleCount: this.editedPeopleCount
                        }
                    }
                } else {
                    updatedReservationInformations = {
                        ...updatedReservationInformations,
                        peopleCount: this.editedPeopleCount,
                        tableNumber: this.reservation.tableNumber
                    }
                }
            }

            if (this.editedMention != this.reservation.mention) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    mention: this.editedMention
                }
            }

            if (this.editedHasMinor != this.reservation.hasMinor) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    hasMinor: this.editedHasMinor
                }
            }

            if (this.editedStatusCode != this.reservation.statusCode) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    statusCode: this.editedStatusCode
                }
            }

            if (Object.keys(updatedReservationInformations).length > 1) {

                updateReservation(updatedReservationInformations)
                    .then(result => {
                        if (result) {
                            this.dialogOKReservation = true;
                            setTimeout(this.closeAllDialog, 1000);

                            const startTimeHour = this.toLocale(result.startTime).time.hours;
                            const shiftFilter = startTimeHour <= 15 ? 'Midi' : 'Soir';

                            const refreshingInformations = {
                                firstName: this.reservation.firstName,
                                date: result.date,
                                shift: shiftFilter,
                                changeListFilters: this.viewEditedReservation
                            }

                            this.editedReservationRefreshAndSearch(refreshingInformations);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        alert(err.message);
                    });


            } else if (this.dialogTablePasOk != true) {
                this.dialogReservationNonModidier = true;
                setTimeout(() => this.dialogReservationNonModidier = false, 2000);
            }
        },
        applyNoShowStatus() {
            this.editedStatusCode = 6;
            this.sendUpdate();
        },
        closeAllDialog() {
            this.dialogOKReservation = false;
            this.closeEditReservationDialog();
        },
        resetDate() {
            this.editedFullDate = this.reservation.fullDate;
        },
        resetPeopleCount() {
            this.editedPeopleCount = this.reservation.peopleCount;
        },
        removeTableAndSend() {
            this.editedTableNumber = null;
            this.dialogTablePasOk = false;
            this.tableWasRemoved = true;
            this.sendUpdate();
        }

    },
    computed: {
        saveButtonDisabled() {
            this.peopleCountValid = true;
            if (this.editedPeopleCount < 1 || this.editedPeopleCount > 12) this.peopleCountValid = false;

            return !(this.dateValid && this.peopleCountValid);
        }
    },
    mounted() {
        console.clear();
        this.loadReservation(this.reservationId);
        this.loadStatusList();
    }
}
</script>

<style scoped>
.pre-wrap {
    white-space: pre-wrap;
}

.noTable {
    color: orange
}

.table {
    font-size: 1.5em;
}

.capacity {
    font-size: 1em;
}

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