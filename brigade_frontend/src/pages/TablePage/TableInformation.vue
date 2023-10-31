<template>
    <v-sheet class="w-100">
        <v-card class="pa-2 ma-2"
            :color="tableInformation.isAssign ? `${tableInformation.assignation.employeeColor}` : (!tableInformation.isActive ? 'grey' : 'white')">
            <v-row>
                <v-col>
                    <h1>Table # {{ tableInformation.number }}</h1>
                </v-col>

                <v-col cols="auto">
                    <h2 v-if="!tableInformation.isActive" class="text-no-wrap bg-black text-red-lighten-1">Table INACTIVE
                    </h2>
                    <h2 v-if="!tableInformation.isAssign && tableInformation.isActive">Non assigné</h2>
                    <h2 v-if="tableInformation.isAssign && tableInformation.isActive"> Responsable: {{
                        tableInformation.assignation.employeeFirstName }} {{ tableInformation.assignation.employeeLastName
    }}
                    </h2>
                </v-col>
            </v-row>
            <v-row class="ms-1">
                <h3>Capacité: {{ tableInformation.capacity }}</h3>
            </v-row>
            <v-row class="ms-1">
                <h3 v-if="tableInformation.hasReservation">Réservation(s): {{ tableInformation.reservation.firstName }} {{
                    tableInformation.reservation.lastName }} - {{
        tableInformation.reservation.peopleCount }} personnes - {{ tableInformation.reservation.startTime }} à
                    {{ tableInformation.reservation.endTime }}</h3>
            </v-row>
            <v-row class="ma-2">
                <v-col class="py-0 ps-0">
                    <v-card class="pa-2 ma-4 w-100" v-if="!!reservation || tableInformation.hasReservation">
                        <BlackButton class="ma-2" v-if="!tableInformation.hasReservation" @click="addReservation()"
                            textbutton="Assigner la réservation sélectionnée">
                        </BlackButton>
                        <BlackButton class="ma-2"
                            v-if="tableInformation.hasReservation && (tableInformation.reservation.statusCode == 1 || tableInformation.reservation.statusCode == 3)"
                            @click="updateReservationStatus()" textbutton="COMMENCER">
                        </BlackButton>
                        <BlackButton class="ma-2"
                            v-if="tableInformation.hasReservation && tableInformation.reservation.statusCode == 3"
                            @click="updateReservationStatus('NOSHOW')" textbutton="NO SHOW">
                        </BlackButton>
                        <BlackButton class="ma-2"
                            v-if="tableInformation.hasReservation && (tableInformation.reservation.statusCode == 2 || tableInformation.reservation.statusCode == 4)"
                            @click="updateReservationStatus()" textbutton="COMPLÉTER">
                        </BlackButton>
                        <BlackButton class="ma-2" v-if="tableInformation.hasReservation" @click="removeReservation()"
                            textbutton="Libérer la table">
                        </BlackButton>
                        <!-- <BlackButton @click="toggleReservation" class="ma-2"
                        :textbutton='!!reservation ? "Assigner la réservation sélectionnée":"Sélectionner une réservation"'></BlackButton> -->
                        <!-- <BlackButton @click="changeTableStatus(tableInformation.number, tableInformation.isActive)"
                            class="ma-2"
                            :textbutton='tableInformation.isActive ? "Désactiver la table" : "Réactiver la table"'>
                        </BlackButton> -->
                        <!-- <BlackButton v-if="tableInformation.isActive" class="ma-2" textbutton="Désactiver la table">
                        </BlackButton> -->
                    </v-card>
                    <v-card class="pa-2 ma-4 w-100"
                        v-if="!((!!reservation) || tableInformation.hasReservation) && tableInformation.isActive">
                        <p><v-icon color="warning" icon="mdi-alert" size="x-large" class="ma-3"></v-icon>Pour assigner cette
                            table a une réservation, veuillez la sélectionner dans la liste...</p>
                    </v-card>
                </v-col>
                <v-col cols="auto" class="py-0 pe-0 ps-6 d-flex align-center">
                    <BlackButton class="ma-2" textbutton="RETOUR" @click="toggleSelectedTable">
                    </BlackButton>
                </v-col>

            </v-row>
            <v-row class="ma-1 justify-end">
                <p v-if="tableInformation.isActive"
                    @click="changeTableStatus(tableInformation.number, tableInformation.isActive)"><u>
                        Désactiver la table</u></p>
                <p v-else @click="changeTableStatus(tableInformation.number, tableInformation.isActive)"><u>
                        Réactiver la table</u></p>
            </v-row>

        </v-card>
    </v-sheet>
</template>

<script>
import BlackButton from "../../components/Reusable/BlackButton.vue";
import { getReservationById, updateTableOnReservationById, updateReservationStatusById } from "../../services/ReservationService"

export default {
    inject: ['selectedTable', 'tableWithAssignationList', 'toggleSelectedTable', 'refreshPageView', 'displaySelectedTable', 'changeTableStatus', 'loadReservationInformations'],
    components: {
        BlackButton
    },
    props: {
        reservation: Object
    },
    data() {
        return {
            tableInformation: {
                number:null,
                capacity:null,
                isActive:false,
                isAssign:false,
                hasReservation:false,
                assignation:null,
                reservation:null
            },
            hasReservation: false
        }
    },
    methods: {
        getTableInformation() {
            this.tableInformation = this.tableWithAssignationList.find(table => {
                return table.number == this.selectedTable.number;
            })
        },
        async addReservation() {
            const reservationFound = await getReservationById(this.reservation.id);
            if (reservationFound) {
                if (this.reservation.tableNumber == null && this.selectedTable != null) {
                    if (this.reservation.peopleCount <= this.tableInformation.capacity) {
                        this.reservation.tableNumber = this.selectedTable.number;
                        await updateTableOnReservationById(this.reservation.id, this.reservation.tableNumber);
                        //this.hasReservation = true;
                        this.refreshPageView();
                    } else {
                        alert("Il n'y a pas suffisament de place sur la table, veuillez choisir une autre table.")
                        console.info("Il n'y a pas suffisament de place sur la table, veuillez choisir une autre table.")
                    }
                }
                else {
                    if (reservationFound.tableNumber == this.reservation.tableNumber == this.selectedTable.tableNumber) {
                        console.info("La réservation est déjà assigné à cette table #" + reservationFound.tableNumber);
                        alert("La réservation est déjà assigné à cette table #" + reservationFound.tableNumber);
                    } else {
                        console.info("La réservation est déjà assigné à la table: #" + reservationFound.tableNumber);
                        alert("La réservation est déjà assigné à la table: #" + reservationFound.tableNumber);
                    }
                }
            } else {
                console.error("Aucune réservation trouvée ayant cet ID");
                alert("Aucune réservation trouvée ayant cet ID");
            }


        },
        async removeReservation() {
            const reservationFound = await getReservationById(this.tableInformation.reservation.id)
            console.log("reservationFound : " + JSON.stringify(reservationFound));
            if (!reservationFound) {
                alert("Aucune réservation trouvée")
            } else {
                if (reservationFound.tableNumber == null) {
                    alert("Il n'y a aucune réservation sur cette table actuellement.")
                } else {
                    this.reservation.tableNumber = null;
                    await updateTableOnReservationById(reservationFound.id, 0)
                    this.hasReservation = false;
                }
            }
            this.refreshPageView();
        },

        async updateReservationStatus(status) {
            const reservationFound = await getReservationById(this.tableInformation.reservation.id)
            console.log("reservationFound : " + JSON.stringify(reservationFound));
            if (!reservationFound) {
                alert("Aucune réservation trouvée")
            } else {
                if (reservationFound.tableNumber == null) {
                    alert("Il n'y a aucune réservation sur cette table actuellement.")
                } else {
                    if ((this.tableInformation.reservation.statusCode == 1 || this.tableInformation.reservation.statusCode == 3) && status != "NOSHOW") {
                        await updateReservationStatusById(reservationFound.id, 2)
                        this.hasReservation = true;
                    } else if ((this.tableInformation.reservation.statusCode == 1 || this.tableInformation.reservation.statusCode == 3) && status == "NOSHOW") {
                        await updateReservationStatusById(reservationFound.id, 6)
                        this.hasReservation = false;
                    } else if ((this.tableInformation.reservation.statusCode == 2 || this.tableInformation.reservation.statusCode == 4)) {
                        await updateReservationStatusById(reservationFound.id, 5)
                        this.hasReservation = false;
                    }
                }
            }
            this.refreshPageView();
            this.toggleSelectedTable();
        },
    },
    watch: {
        selectedTable() {
            this.getTableInformation();
        },
        tableWithAssignationList() {
            this.getTableInformation();
            //this.loadReservationInformations(this.tableInformation.reservation.id)

        },
        // tableInformation() {
        //     if (!!this.tableInformation) {
        //         if (this.tableInformation.hasReservation) {
        //             this.loadReservationInformations(this.tableInformation.reservation.id)
        //         }
        //     }
        // }
    },
    mounted() {
        this.getTableInformation();
    }

}
</script>