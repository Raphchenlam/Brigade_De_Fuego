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
                        <v-text-field type="datetime-local" v-model="reservationFullDate" class="ma-2"
                            label="Date de la reservation" :rules="[rules.required, rules.dateIsValid]">
                        </v-text-field>
                        <v-text-field v-model="reservation.peopleCount" width="10px" type="number" class="shrink ma-2"
                            label="Nombre de personnes" :rules="[rules.required]">
                        </v-text-field>
                    </v-row>
                    <v-textarea class="my-5" v-model="reservation.mention" height="200px" no-resize rows="8"
                        label="Mentions speciales"></v-textarea>
                    <v-checkbox v-model="reservation.hasMinor" label="Mineur sur place"></v-checkbox>
                    <v-dialog v-model="dialogConfirmReservation" width="100%">
                        <template v-slot:activator="{ props }">
                            <div class="ma-2 text-center">
                                <v-row class="justify-end">
                                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                                    <DarkRedButton class="mx-5" type="submit" v-bind="props"
                                        textbutton="Creer la reservation"></DarkRedButton>
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
                                        <v-card height="200px">
                                            <v-card-title>
                                                Confirmation
                                            </v-card-title>
                                            <v-card-text>
                                                <v-row class="justify-center">
                                                    <p>La reservation a bien ete enregistrer.</p>
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
    inject: ['closeNewReservationDialog'],
    components: {
        DarkRedButton,
        ClientList,
        BlackButton
    },
    data()
    {
        return {
            dateValid: true,
            clientIdValid: true,
            takenByNumberValid: true,
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
                dateIsValid: () => this.dateValid || "Date non valide(Ne doit pas etre avant presentement, ni avant 11h ou apres 23h)",
            },
            formValid: true
        }
    },
    methods: {
        closeAllDialog()
        {
            this.dialogOKReservation = false;
            this.dialogConfirmReservation = false;
            this.closeDialog();
        },
        closeDialog()
        {
            this.closeNewReservationDialog();
        },
        verifyReservation()
        {
            this.clientIdValid = true;
            if (!this.reservation.clientId)
            {
                this.clientIdValid = false;
            }
            this.$refs.createReservationForm.validate().then(formValid =>
            {
                if (!formValid.valid || !this.clientIdValid || !this.dateValid)
            {
                this.dialogConfirmReservation = false;
            } 
            });
        },
        loadClientId(clientId)
        {
            this.selectedClientId = clientId;
        },
        submitNewReservation()
        {
            this.dialogOKReservation = false;
            if (this.reservation.takenBy.length != 16)
            {
                this.dialogOKReservation = false;
                this.takenByNumberValid = false;
                return;
            }

            createReservation(this.reservation).then(result =>
            {
                this.dialogOKReservation = true;
                setTimeout(this.closeAllDialog, 2000);
            }).catch(err =>
            {
                console.error(err);
            });
        },
        isBeforeToday(fullDate)
        {
            let date = fullDate.split('T').slice(0)[0];
            let fulltime = fullDate.split('T').slice(0)[1];

            let year = parseInt(date.split('-').slice(0)[0]);
            let month = parseInt(date.split('-').slice(0)[1]);
            let day = parseInt(date.split('-').slice(0)[2]);
            let hour = parseInt(fulltime.split(':').slice(0)[0]);
            let minute = parseInt(fulltime.split(':').slice(0)[1]);

            var today = new Date();

            if (year < today.getFullYear())
            {
                return true;
            }
            else if (year == today.getFullYear() && month < today.getMonth() + 1)
            {
                return true;
            }
            else if (year == today.getFullYear() && month == today.getMonth() + 1)
            {
                if (day < today.getDate())
                {
                    return true;
                }
                else if (day == today.getDate())
                {
                    if (hour < today.getHours())
                    {
                        return true;
                    }
                    else if (hour == today.getHours() && minute <= today.getMinutes())
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    watch: {
        reservationFullDate()
        {
            this.dateValid = true;
            this.reservation.date = this.reservationFullDate.split('T').slice(0)[0];
            this.reservation.startTime = this.reservationFullDate.split('T').slice(0)[1];

            let startHour = parseInt(this.reservation.startTime.split(':').slice(0)[0])
            let endHour = startHour + 3;
            let endMinute = parseInt(this.reservation.startTime.split(':').slice(0)[1]);
            console.log("startHour", startHour)

            console.log("endHour", endHour)
            console.log("endMinute", endMinute); //verifier pour 00 a 09 car pourrait etre problematique ( affiche 5:2 au lieu de 5:02)
            if (endHour >= 24)
            {
                endHour = 23;
                endMinute = 59;
            }
            this.reservation.endTime = endHour.toString() + ":" + endMinute.toString();

            this.dateValid = !this.isBeforeToday(this.reservationFullDate);
            if (startHour < 11 || startHour >= 23)
            {
                this.dateValid = false;
            }

        },
        selectedClientId()
        {
            this.reservation.clientId = this.selectedClientId
            this.clientIdValid = true;
        }
    },
    provide()
    {
        return {
            loadClientId: this.loadClientId
        };
    },
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