<template>
    <div class="ma-2" width="auto">
        <v-form @submit.prevent="verifyReservation" class="pa-10" validate-on="blur" ref="createReservationForm">
            <v-row>
                <v-col cols="6">
                    <v-row class="justify-center">
                        <p v-if="!clientIdValid" class="error-message">Un client doit etre selectionner
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
                        <v-text-field v-model="reservation.peopleCount" width="10px" type="number" :min="1" :max="30" class="shrink ma-2 h-25 w-25"
                            label="Nombre de personnes" :rules="[rules.required, rules.reservationMaximum, rules.reservationMinimum]">
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
    inject: ['closeNewReservationDialog', 'spliceDate'],
    components: {
        DarkRedButton,
        ClientList,
        BlackButton
    },
    data() {
        return {
            dateValid: false,
            clientIdValid: false,
            takenByNumberValid: false,
            dialogConfirmReservation: false,
            dialogOKReservation: false,
            reservationFullDate: null,
            selectedClientId: null,
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
                reservationMaximum: value => (value >= 1) || "Le nombre de personnes minimum est de 1 pour une seule réservation.",
                reservationMinimum: value => (value <= 30) || "Le nombre de personnes maximum est de 30 pour une seule réservation.",
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
            if (!this.reservation.clientId) {
                this.clientIdValid = false;
            }
            await this.$refs.createReservationForm
                .validate().then(formValid => {
                    if (!formValid.valid || !this.clientIdValid) {
                        this.dialogConfirmReservation = false;
                    }
                }
                );
        },
        loadClientId(clientId) {
            this.selectedClientId = clientId;
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
                    setTimeout(this.closeAllDialog, 2000);
                }
            }).catch(err => {
                console.error(err);
                alert(err.message);
                this.dialogConfirmReservation = false;   
            });
        },
        isBeforeToday(fullDate) {
            const date = this.spliceDate(fullDate)
            var today = new Date();

            if (date.year < today.getFullYear()) {
                return true;
            }
            else if (date.year == today.getFullYear() && date.month < today.getMonth() + 1) {
                return true;
            }
            else if (date.year == today.getFullYear() && date.month == today.getMonth() + 1) {
                if (date.day < today.getDate()) {
                    return true;
                }
                else if (date.day == today.getDate()) {
                    if (date.hour < today.getHours()) {
                        return true;
                    }
                    else if (date.hour == today.getHours() && date.minute <= today.getMinutes()) {
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

            const reservationDate = this.spliceDate(this.reservationFullDate);
            const month = (reservationDate.month < 10 ) ? "0" + reservationDate.month : reservationDate.month;
            const day = (reservationDate.day < 10 ) ? "0" + reservationDate.day : reservationDate.day;
            this.reservation.date = reservationDate.year + "-" + month + "-" + day;
            this.reservation.startTime = reservationDate.hour + ":" + reservationDate.minute;
            let endHour = reservationDate.hour + 3;
            let endMinute = reservationDate.minute;
            console.log("endMinute", endMinute); //verifier pour 00 a 09 car pourrait etre problematique ( affiche 5:2 au lieu de 5:02)
            if (endHour >= 24) {
                endHour = 23;
                endMinute = 59;
            }
            this.reservation.endTime = endHour.toString() + ":" + endMinute.toString();

            this.dateValid = !this.isBeforeToday(this.reservationFullDate);
            if (reservationDate.hour < 11 || reservationDate.hour >= 23) {
                this.dateValid = false;
            }

        },
        selectedClientId() {
            this.reservation.clientId = this.selectedClientId
            this.clientIdValid = true;
        }
    },
    provide() {
        return {
            loadClientId: this.loadClientId
        };
    },
    computed: {
        createButtonDisabled() {
            return !(this.dateValid
                && this.clientIdValid
                && !!this.reservationFullDate
                && !!this.reservation.clientId
                && !!this.reservation.peopleCount
                && !!this.reservation.date
                && !!this.reservation.startTime
                && !!this.reservation.endTime);
        }
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

.pre-wrap {
    white-space: pre-wrap;
}
</style>