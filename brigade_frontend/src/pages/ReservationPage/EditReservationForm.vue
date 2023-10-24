<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="editReservationForm">
            <v-row class="justify-center">
                <p>Client : {{ reservation.firstName + " " + reservation.lastName }}</p>
            </v-row>
            <v-row class="justify-center">
                <v-col cols="4">
                    <v-text-field v-model="editedFullDate" type="datetime-local" class="ma-2" label="Date de la reservation"
                        clearable>
                    </v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="editedPeopleCount" width="10px" type="number" class="shrink ma-2"
                        label="Nombre de personnes" clearable>
                    </v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-select class="shrink ma-2" label="Select" :items="reservationStatusList" v-model="editedStatusCode"
                        item-title="name" item-value="code"></v-select>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-textarea v-model="editedMention" label="Mentions speciales"></v-textarea>
            </v-row>
            <v-row>
                <v-checkbox v-model="editedHasMinor" label="Mineur sur place"></v-checkbox>
            </v-row>
            <v-row class="justify-space-between">
                <cols>
                    <SmallBlackButton class="mx-5" width="200px" textbutton="No Show" @click="applyNoShowStatus()">
                    </SmallBlackButton>
                </cols>
                <cols>
                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                    <DarkRedButton class="mx-5" textbutton="Sauvegarder" @click="sendUpdate()"></DarkRedButton>
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
                                @click="editedTableNumber = null, dialogTablePasOk = false">
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
    inject: ['closeEditReservationDialog'],
    props: {
        reservationId: Number
    },
    data() {
        return {
            reservationStatusList: [],
            reservation: {},
            table: {},
            editedDate: null,
            dialogOKReservation: false,
            dialogTablePasOk: false,
            dialogReservationNonModidier: false,
            editedStartTime: null,
            editedFullDate: null,
            editedPeopleCount: null,
            editedMention: null,
            editedHasMinor: false,
            editedStatusCode: null,
            editedTableNumber: null
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
        }
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
                        this.editedTableNumber = reservation.tableNumber;

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
            let updatedReservationInformations = {
                id: this.reservationId
            }

            //TODO: Séparé la validation des champs de la construction de l'objet d'envoie
            //TODO: Validate onBlur
            //TODO: Deactivate the save button if not valid, can't be valid if didn't change anything
            //TODO: Then construct

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
                if (this.table.capacity < this.editedPeopleCount) {
                    this.dialogTablePasOk = true;

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
                        peopleCount: this.editedPeopleCount
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

            if (Object.keys(updatedReservationInformations).length < 1) {

                updateReservation(updatedReservationInformations)
                    .then(result => {
                        if (result) {
                            console.log("La réservation a bien été enregistré");
                            this.dialogOKReservation = true;
                            setTimeout(this.closeAllDialog, 1000);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        alert(err.message);
                        //TODO: ajouter un dialogue d'erreur ou garder l'alerte 
                        //TODO: pourrait proposer des changements selon l'erreur ??
                        //TODO: How can you trigger this one ???
                    });
            } else {
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