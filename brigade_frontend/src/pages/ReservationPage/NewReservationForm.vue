<template>
    <div class="ma-2" width="auto">
        <v-form @submit.prevent="verifyReservation" class="pa-10" validate-on="blur" ref="createReservationForm">
            <v-row>
                <v-col cols="6">
                    <v-row class="justify-center">
                        <p v-if="!clientIdValid" class="error-message">Un client (non-Blacklisted) doit etre selectionner
                        </p>
                    </v-row>
                    <ClientList class="mt-5"></ClientList>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-if="false" v-model="reservation.clientId" class="ma-2" :rules="[rules.required]">
                    </v-text-field>
                    <v-row class="justify-center">
                        <v-text-field type="datetime-local" v-model="reservationFullDate" class="ma-2 pre-wrap h-25 w-25"
                            label="Date de la reservation" :rules="[rules.required, rules.dateIsValid]">
                        </v-text-field>
                        <v-text-field v-model="reservation.peopleCount" width="10px" type="number" :min="1" :max="30"
                            class="shrink ma-2 h-25 w-25" label="Nombre de personnes"
                            :rules="[rules.required, rules.reservationMaximum, rules.reservationMinimum]">
                        </v-text-field>
                    </v-row>
                    <v-textarea class="my-5" v-model="reservation.mention" height="200px" no-resize rows="8"
                        label="Mentions speciales" :rules="[rules.fieldLength255]"></v-textarea>
                    <v-checkbox v-model="reservation.hasMinor" label="Mineur sur place"></v-checkbox>
                    <v-dialog v-model="dialogConfirmReservation" width="100%">
                        <template v-slot:activator="{ props }">
                            <div class="ma-2 text-center">
                                <v-row class="justify-end">
                                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                                    <DarkRedButton class="mx-5" type="submit" v-bind="props"
                                        textbutton="Creer la reservation" :disabled="createButtonDisabled"></DarkRedButton>
                                </v-row>
                            </div>
                        </template>
                        <v-card>
                            <v-card-title>
                                Confirmer la reservation
                            </v-card-title>
                            <v-card-text>
                                <p>Veuillez scanner votre carte employe</p>
                                <v-form @submit.prevent="submitNewReservation" class="pa-10" validate-on="submit lazy"
                                    ref="confirmReservationForm">
                                    <v-row class="justify-center">
                                        <p v-if="!takenByNumberValid" class="error-message">Le numero doit comporter 16
                                            chiffres
                                        </p>
                                    </v-row>
                                    <v-row class="justify-center">
                                        <v-text-field :counter="16" autofocus type="number" v-model="reservation.takenBy"
                                            label="Numero de la carte employe" :rules="[rules.required]"></v-text-field>
                                    </v-row>
                                    <p>6547598653454321</p>
                                    <v-dialog v-model="dialogOKReservation" width="50%" persistent>
                                        <template v-slot:activator="{ props }">
                                            <v-sheet class="ma-2 text-center">
                                                <v-row class="justify-center">
                                                    <v-row class="justify-center">
                                                        <BlackButton :disabled="reservation.takenBy.length != 16"
                                                            type="submit" textbutton="Confirmer" v-bind="props">
                                                        </BlackButton>
                                                    </v-row>
                                                </v-row>
                                            </v-sheet>
                                        </template>
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
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import BlackButton from '../../components/Reusable/BlackButton.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import ClientList from '../ClientPage/ClientList.vue';

import { createReservation } from '../../services/ReservationService'

export default {
    inject: ['closeNewReservationDialog', 'spliceDate', 'refreshWithNewreservation', 'toLocale'],
    components: {
        DarkRedButton,
        ClientList,
        BlackButton
    },
    data() {
        return {
            dateValid: false,
            clientIdValid: false,
            clientFirstName: null,
            takenByNumberValid: false,
            dialogConfirmReservation: false,
            dialogOKReservation: false,
            reservationFullDate: null,
            selectedClientId: null,
            selectedClientIsBlacklisted: false,
            reservation: {
                tableNumber: null,
                clientId: null,
                statusCode: 1,
                peopleCount: null,
                date: null,
                startTime: null,
                endTime: null,
                mention: null,
                hasMinor: false,
                takenBy: ""
            },
            rules: {
                required: value => !!value || "Le champ est requis",
                dateIsValid: () => this.dateValid || "Date non valide\n\t- Ne doit pas etre avant la date d'aujourd'hui\n\t- Ni avant 11h ou apres 23h",
                reservationMinimum: value => (value >= 1) || "Le nombre de personnes minimum est de 1 pour une seule réservation.",
                reservationMaximum: value => (value <= 30) || "Le nombre de personnes maximum est de 30 pour une seule réservation.",
                fieldLength255: value => ((value) ? !(value.length > 254) : true) || "255 caractères maximum.",
            },
            formValid: true
        }
    },
    methods: {
        closeAllDialog() {
            this.dialogOKReservation = false;
            this.dialogConfirmReservation = false;
            this.closeDialog();
        },
        closeDialog() {
            this.closeNewReservationDialog();
        },
        async verifyReservation() {
            this.clientIdValid = true;
            if (!this.reservation.clientId || this.selectedClientIsBlacklisted) {
                this.clientIdValid = false;
            }
            await this.$refs.createReservationForm
                .validate().then(formValid => {
                    if (!formValid.valid || !this.clientIdValid) {
                        this.formValid = false;
                        this.dialogConfirmReservation = false;
                    }
                }
                );
        },
        loadClientInformations(clientInformations) {
            this.selectedClientId = clientInformations[0];
            this.selectedClientIsBlacklisted = clientInformations[1];
            this.clientFirstName = clientInformations[2];
        },
        submitNewReservation() {
            this.dialogOKReservation = false;
            if (this.reservation.takenBy.length != 16) {
                this.dialogOKReservation = false;
                this.takenByNumberValid = false;
                return;
            }
            this.takenByNumberValid = true;

            createReservation(this.reservation).then(result => {
                if (result) {
                    this.dialogOKReservation = true;
                    if (this.dialogOKReservation) {

                        const startTimeObj = this.toLocale(this.reservation.startTime);
                        console.log("startTimeObj : ");
                        console.log(startTimeObj);
                        console.log("startTimeObj.time.hours : ");
                        console.log(startTimeObj.time.hours);
                        console.log("startTimeObj.time.hours < 15: ");
                        console.log(startTimeObj.time.hours < 15);
                        var newReservationShift;
                        if (startTimeObj.time.hours < 15){
                            newReservationShift = "Midi";
                        }else{
                            newReservationShift = "Soir";
                        }


                        this.refreshWithNewreservation([result.id, this.reservationFullDate, this.clientFirstName, newReservationShift]);
                    }
                    setTimeout(this.closeAllDialog, 2000);
                }
            }).catch(err => {
                console.error(err);
                alert(err.message);
                this.dialogConfirmReservation = false;
            });
        },
        isBeforeToday(fullDate) {
            const dateToVerify = this.toLocale(fullDate)
            var today = this.toLocale(new Date().toLocaleString());

            if (dateToVerify.date.year < today.date.year) {
                return true;
            }
            else if (dateToVerify.date.year == today.date.year && dateToVerify.date.month < today.date.month) {
                return true;
            }
            else if (dateToVerify.date.year == today.date.year && dateToVerify.date.month == today.date.month) {
                if (dateToVerify.date.day < today.date.day) {
                    return true;
                }
                else if (dateToVerify.date.day == today.date.day) {
                    if (dateToVerify.time.hours < today.time.hours) {
                        return true;
                    }
                    else if (dateToVerify.time.hours == today.time.hours && dateToVerify.date.minutes <= today.date.minutes) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    watch: {
        reservationFullDate() {
            this.dateValid = true;

            //Date management
            const reservationDateObject = this.toLocale(this.reservationFullDate);
            this.reservation.date = reservationDateObject.date.fullDate;

            // //Start time management
            this.reservation.startTime = reservationDateObject.time.fullTime;

            // //End time management
            let endHour = reservationDateObject.time.hours + 3;
            let endMinute = reservationDateObject.time.minutes;
            if (endHour >= 24) {
                endHour = 23;
                endMinute = 59;
            }
            const endTimeHours = (endHour < 10) ? "0" + endHour : "" + endHour;
            const endTimeMinutes = (endMinute < 10) ? "0" + endMinute : "" + endMinute;
            this.reservation.endTime = endTimeHours + ":" + endTimeMinutes;

            //Date validation
            this.dateValid = !this.isBeforeToday(this.reservationFullDate);
            if (reservationDateObject.time.hour < 11 || reservationDateObject.time.hour >= 23) {
                this.dateValid = false;
            }

        },
        selectedClientId() {
            if (this.selectedClientId) {
                this.reservation.clientId = this.selectedClientId

                if (this.selectedClientIsBlacklisted) {
                    this.clientIdValid = false;
                } else {
                    this.clientIdValid = true;
                }
            } else {
                this.clientIdValid = false;
                this.selectedClientIsBlacklisted = false;
            }
        }
    },
    provide() {
        return {
            loadClientInformations: this.loadClientInformations
        };
    },
    computed: {
        createButtonDisabled() {
            var peopleCountValid = true;
            if (this.reservation.peopleCount < 1 || this.reservation.peopleCount > 30) {
                peopleCountValid = false;
            }

            return !(this.dateValid
                && this.clientIdValid
                && !!this.reservationFullDate
                && !!this.reservation.clientId
                && !!this.reservation.peopleCount
                && peopleCountValid
                && !!this.reservation.date
                && !!this.reservation.startTime
                && !!this.reservation.endTime);
        }
    },
    mounted() {
        const today = this.toLocale(new Date().toLocaleString());
        today.time.minutes += 5;

        if (today.time.minutes >= 60) today.time.minutes -= 60, today.time.hours += 1;

        // set time to 11:00
        today.time.minutes = (today.time.hours < 11) ? 0 : today.time.minutes;
        today.time.hours = (today.time.hours < 11) ? 11 : today.time.hours;

        const secondesStr = (today.time.secondes > 10) ? "" + today.time.secondes : "0" + today.time.secondes;
        const minutesStr = (today.time.minutes > 10) ? "" + today.time.minutes : "0" + today.time.minutes;
        const hoursStr = (today.time.hours > 10) ? "" + today.time.hours : "0" + today.time.hours;

        today.time.fullTime = hoursStr + ":" + minutesStr + ":" + secondesStr;

        this.reservationFullDate = today.date.fullDate + "T" + today.time.fullTime;

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

.error-message {
    color: red
}
</style>