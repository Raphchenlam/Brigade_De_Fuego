<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="editReservationForm">
            <v-row class="justify-center">
                <p>Client : {{ reservation.firstName + " " + reservation.lastName }}</p>
            </v-row>
            <v-row class="justify-center">
                <v-text-field v-model="editedFullDate" type="datetime-local" class="ma-2" label="Date de la reservation"
                    clearable>
                </v-text-field>
                <v-text-field v-model="editedPeopleCount" width="10px" type="number" class="shrink ma-2"
                    label="Nombre de personnes" clearable>
                </v-text-field>
            </v-row>
            <v-textarea v-model="editedMention" label="Mentions speciales"></v-textarea>
            <v-checkbox v-model="editedHasMinor" label="Mineur sur place"></v-checkbox>
            <v-row class="justify-space-between">
                <cols>
                    <SmallBlackButton class="mx-5" width="auto" textbutton="No Show" @click="applyNoShowStatus()"></SmallBlackButton>
                    <SmallBlackButton class="mx-5" width="auto" textbutton="No Show" :color="white" @click="applyNoShowStatus()"></SmallBlackButton>
                </cols>
                <cols>
                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                    <DarkRedButton class="mx-5" textbutton="Sauvegarder" @click="sendUpdate()"></DarkRedButton>
                </cols>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import SmallBlackButton from '../../components/Reusable/SmallBlackButton.vue';
import { getReservationById, updateReservation } from '../../services/ReservationService';
import { fetchTableByNumber } from '../../services/TableService';

export default {
    inject: ['closeEditReservationDialog'],
    props: {
        reservationId: Number
    },
    data() {
        return {
            reservation: {},
            table: {},
            editedDate: null,
            editedStartTime: null,
            editedFullDate: null,
            editedPeopleCount: null,
            editedMention: null,
            editedHasMinor: false,
            editedStatusCode: null,
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

                        this.editedDate = reservation.date;
                        this.editedStartTime = reservation.startTime;
                        this.editedFullDate = reservation.date + " " + reservation.startTime;
                        this.editedPeopleCount = reservation.peopleCount;
                        this.editedMention = reservation.mention;
                        this.editedHasMinor = reservation.hasMinor;
                        this.editedStatusCode = reservation.statusCode;

                        this.reservation = {
                            ...reservation,
                            fullDate: this.editedFullDate
                        };

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
        },
        sendUpdate() {
            let updatedReservationInformations = {
                id: this.reservationId
            }

            //TODO: do a validate rules here 

            if (this.editedDate != this.reservation.date) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    date: this.editedDate
                }
            }

            if (this.editedStartTime != this.reservation.startTime) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    startTime: this.editedStartTime
                }
            }

            if (this.editedFullDate != this.reservation.fullDate) {
                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    fullDate: this.editedFullDate
                }
            }

            //TODO: verifier si il y a une table d'assigner et si oui est-ce qu'elle a assez de place, si non proposer de l'enlever avec la mise à jours ou d'annuler ??
            if (this.editedPeopleCount != this.reservation.peopleCount) {
                if (this.table.capacity < this.editedPeopleCount) { return alert(`Le nombre de personne(s) fournis (${this.editedPeopleCount}) est supérieur à la capacité de la table #${this.table.number} (${this.table.capacity})`) }

                updatedReservationInformations = {
                    ...updatedReservationInformations,
                    peopleCount: this.editedPeopleCount
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


            updateReservation(updatedReservationInformations)
                .then(result => {
                    if (result) {
                        //TODO: ajouter un dialogue de confirmation
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert(err.message);
                    //TODO: ajouter un dialogue d'erreur ou garder l'alerte 
                    //TODO: pourrait proposer des changements selon l'erreur ??
                    // this.dialogConfirmReservation = false;
                });
        },
        applyNoShowStatus() {
            // TODO: be sure of what is the right number of the reservation status "No show"
            this.editedStatusCode = 2;
            console.log("this.editedStatusCode : ");
            console.log(this.editedStatusCode);
        }
    },
    mounted() {
        console.clear();
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