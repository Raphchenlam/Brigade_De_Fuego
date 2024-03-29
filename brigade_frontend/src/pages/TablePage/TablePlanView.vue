<template>
    <v-sheet width="100%" class="pa-2">
        <v-row>
            <v-col>
                <v-row>
                    <TableLayout v-if="selectedTable == null" class="pa-2"></TableLayout>
                    <TableInformation v-else class="pa-2" :reservation="reservationInformations"></TableInformation>
                </v-row>
                <v-row>
                    <WaiterList class="pa-2" v-if="!selectedReservationId"></WaiterList>
                    <ReservationInformation class="pa-2" v-if="selectedReservationId"
                        :reservationId="selectedReservationId"></ReservationInformation>
                </v-row>
            </v-col>
            <v-col cols="5">
                <v-row class="d-flex ms-2">
                    <!-- Ajouter :min="selectedDate" -->
                    <v-text-field class="ma-2" type="date" label="Sélectionner une date" density="compact"
                        v-model="selectedDate">
                    </v-text-field>
                    <v-radio-group class="d-flex justify-start align-center" :inline=true v-model="selectedShift">
                        <v-radio label="Midi" value="Midi"></v-radio>
                        <v-radio label="Soir" value="Soir"></v-radio>
                    </v-radio-group>
                </v-row>
                <v-row class="ma-2">
                    <h2 class="ma-2">Liste des réservations</h2>
                    <ReservationList class="pa-2"></ReservationList>
                </v-row>
            </v-col>
        </v-row>
    </v-sheet>
</template>


<script>
import { computed } from "vue";
import BlackButton from "../../components/Reusable/BlackButton.vue";
import OperationMenu from '../../components/OperationMenu.vue';
import operationSession from "../../sessions/OperationSession"
import ReservationList from '../ReservationPage/ReservationList.vue';
import ReservationInformation from '../ReservationPage/ReservationInformation.vue';
import TableLayout from './TableLayout.vue';
import TableInformation from './TableInformation.vue';
import WaiterList from "./WaiterList.vue";
import { fetchAllTables, fetchAssignationByDate, createAssignations, updateTableStatusByNumber } from '../../services/TableService';
import { getReservationById, getReservationList, updateTableOnReservationById } from '../../services/ReservationService';



export default {
    inject: ['toLocale'],
    name: 'TablePlanView',
    components: {
        OperationMenu,
        ReservationList,
        ReservationInformation,
        TableLayout,
        TableInformation,
        WaiterList,
        BlackButton
    },
    data() {
        return {
            operationSession: operationSession,
            tableList: [],
            assignationList: [],
            reservations: [],
            localAssignations: [],
            tempAssignationList: [],
            tableWithAssignationList: [],
            selectedDate: this.loadDate(),
            selectedShift: "Midi",
            selectedTable: null,
            selectedReservationId: null,
            reservationInformations: null,
            tableInSection: null,
            selectedWaiter: null,
            inEditionMode: false,
            tableIsInactiveToday: false,
            //reservationToSelect:null,
            refreshWithUpdatedReservation: null,
            editedFirstName: null,

        }
    },
    provide() {
        return {
            tableList: computed(() => this.tableList),
            assignationList: computed(() => this.assignationList),
            reservations: computed(() => this.reservations),
            tableWithAssignationList: computed(() => this.tableWithAssignationList),
            selectedDate: computed(() => this.selectedDate),
            selectedShift: computed(() => this.selectedShift),
            selectedTable: computed(() => this.selectedTable),
            selectedWaiter: computed(() => this.selectedWaiter),
            tableInSection: computed(() => this.tableInSection),
            reservationInformations: computed(() => this.reservationInformations),
            inEditionMode: computed(() => this.inEditionMode),
            localAssignations: computed(() => this.localAssignations),
            selectedReservationId: computed(() => this.selectedReservationId),
            tableIsInactiveToday: computed(() => this.tableIsInactiveToday),

            toggleEditionMode: this.toggleEditionMode,
            toggleSelectedTable: this.toggleSelectedTable,
            displaySelectedTable: this.displaySelectedTable,
            selectTableInSection: this.selectTableInSection,
            loadReservationInformations: this.loadReservationInformations,
            loadReservations: this.loadReservations,
            buildAssignations: this.buildAssignations,
            selectWaiter: this.selectWaiter,
            loadDate: this.loadDate,
            changeTableStatus: this.changeTableStatus,
            refreshPageView: this.refreshPageView,

            editedReservationRefreshAndSearch: this.editedReservationRefreshAndSearch,
            editedFirstName: computed(() => this.editedFirstName),
            refreshWithUpdatedReservation: computed(() => this.refreshWithUpdatedReservation),

        }
    },
    methods: {
        editedReservationRefreshAndSearch(refreshingInformations) {
            this.refreshWithUpdatedReservation = refreshingInformations.changeListFilters;
            this.selectedDate = refreshingInformations.date;

            if (refreshingInformations.changeListFilters) {
                this.selectedShift = refreshingInformations.shift;
                this.editedFirstName = refreshingInformations.firstName;
            }else{
                this.editedFirstName = "";
            }

            setTimeout(() => this.refreshWithUpdatedReservation = null);
        },
        loadReservationInformations(receivedReservationId) {
            this.selectedReservationId = receivedReservationId;
        },
        loadReservations(startDate, endDate) {
            this.reservations = [];
            getReservationList(startDate, endDate).then((reservationList) => {
                this.reservations = reservationList;
                this.filterReservationsStatus();
                this.updateTableLayout();
            }).catch(err => {
                console.error(err);
                alert(err.message);
            })
        },
        filterReservationsStatus() {
            this.reservations = this.reservations.filter((reservation) => {
                return (reservation.statusCode < 5)
            })
        },
        loadDate(newReservationDate, newReservationShift) {

            const todayDate = this.toLocale(new Date().toLocaleDateString("en-GB")).date.fullDate;
            const shift = parseInt(new Date().toLocaleTimeString("en-GB").split(':').slice(0)[0]) > 15 ? "Soir" : "Midi"

            this.selectedDate = (newReservationDate) ? newReservationDate : todayDate;
            this.selectedShift = (newReservationShift) ? newReservationShift : shift;
            return todayDate;
        },
        loadTableList() {
            this.tableList = [];
            fetchAllTables().then(allTables => {
                allTables.forEach(table => {
                    this.tableList.push(table);
                });
            }).catch(err => {
                console.error(err);
            });
        },
        loadAssignationList(date, shift) {
            this.assignationList = [];
            this.tableWithAssignationList = [];
            fetchAssignationByDate(date).then(allAssignations => {
                allAssignations.forEach(assignation => {
                    if (assignation.shift == shift) {
                        this.assignationList.push(assignation);
                    }
                });
            }).catch(err => {
                console.error(err);
            });
        },
        updateTableLayout() {
            this.tableWithAssignationList = [];
            this.tableIsInactiveToday = false;

            this.tableWithAssignationList = this.tableList.map(table => {
                return {
                    number: table.number,
                    capacity: table.capacity,
                    isActive: table.isActive,
                    isAssign: false,
                    hasReservation: false,
                    assignation: null,
                    reservation: null
                }
            });

            if (this.assignationList.length > 0) {
                this.assignationList.forEach(assignation => {

                    const table = this.tableWithAssignationList.find(table => {
                        return (table.number == assignation.tableNumber)
                    })
                    if (table.isActive && assignation.isActive) {
                        table.isAssign = true;
                        table.assignation = assignation;
                    } else if (!table.isActive && assignation.isActive) {
                        console.error(`La table ${table.number} est inactive`);
                        table.isAssign = false;
                        assignation.isActive = false;
                    }
                }
                );
            }

            if (this.reservations.length > 0) {
                this.reservations.forEach(reservation => {
                    const shift = parseInt(reservation.startTime.split(':').slice(0)[0]) > 15 ? "Soir" : "Midi"

                    if (this.selectedShift == shift && reservation.statusCode < 5) {
                        const table = this.tableWithAssignationList.find(table => {
                            return (table.number == reservation.tableNumber)
                        })
                        if (table) {
                            table.hasReservation = true;
                            table.reservation = reservation;

                            const todayDate = this.toLocale(new Date().toLocaleDateString("en-GB")).date.fullDate;

                            if (!table.isActive && todayDate == this.selectedDate) {
                                table.hasReservation = false;
                                this.tableIsInactiveToday = true;
                                updateTableOnReservationById(reservation.id, 0)
                                console.info(`La réservation au nom de ${reservation.clientFirstname} ${reservation.clientLastname} à ${reservation.startTime} devra être attitrée à une nouvelle table, car la table #${reservation.tableNumber} est inactive aujourd'hui.`)
                                alert(`La réservation au nom de ${reservation.clientFirstname} ${reservation.clientLastname} à ${reservation.startTime} devra être attitrée à une nouvelle table, car la table #${reservation.tableNumber} est inactive aujourd'hui.`)
                            }
                        }
                    }
                })
            }
        },
        selectWaiter(waiterNumber, employeeColor) {

            if (this.selectedWaiter == null || this.selectedWaiter.waiterNumber != waiterNumber) {
                if (waiterNumber == 0 && employeeColor == 0) {
                    this.selectedWaiter = null;
                } else {
                    this.selectedWaiter = {
                        waiterNumber: waiterNumber,
                        employeeColor: employeeColor
                    }
                }
            } else {
                this.selectedWaiter = null;
            }

        },
        async changeTableStatus(tableNumber, status) {
            await updateTableStatusByNumber(tableNumber, !status);
            this.refreshPageView();
            this.displaySelectedTable(tableNumber);
        },
        createLocalAssignations() {

            this.localAssignations = [];
            this.localAssignations = this.tableList.map(table => {
                return {
                    number: table.number,
                    capacity: table.capacity,
                    isActive: table.isActive,
                    isAssign: false,
                    hasReservation: false,
                    assignation: null,
                    reservation: null
                }
            });

            if (this.tempAssignationList.length == 0) {

                this.tempAssignationList = JSON.parse(JSON.stringify(this.assignationList))

            }
            this.tempAssignationList.forEach(assignation => {

                const table = this.localAssignations.find(table => {
                    return (table.number == assignation.tableNumber)
                })
                if (!table.isActive) {
                    console.error(`La table ${table.number} est inactive.... veuillez retirer l'assignation`);
                    table.isAssign = false;
                    assignation.isActive = false;
                } else {
                    if (!assignation.isActive) {
                        table.isAssign = false;
                        table.assignation = null;
                    } else {
                        table.isAssign = true;
                        table.assignation = assignation;
                    }
                }
            })
            if (this.reservations.length > 0) {
                this.reservations.forEach(reservation => {
                    let shift = null;
                    if (parseInt(reservation.startTime.split(':').slice(0)[0]) > 15) shift = "Soir"
                    if (parseInt(reservation.startTime.split(':').slice(0)[0]) <= 15) shift = "Midi"

                    if (this.selectedShift == shift && reservation.statusCode < 5) {
                        const table = this.localAssignations.find(table => {
                            return (table.number == reservation.tableNumber)
                        })
                        if (table) {
                            if (table.isActive) {
                                table.hasReservation = true;
                                table.reservation = reservation;
                            } else {
                                console.error(`La table ${table.number} est inactive`);
                            }
                        }
                    }
                })
            }
        },
        toggleSelectedTable() {
            if (this.selectedTable != "" || this.selectedTable != null) {
                this.selectedTable = null;
            }
        },
        displaySelectedTable(number) {
            this.selectedTable = this.tableWithAssignationList.find((table) => {
                return table.number == number;
            })
        },
        selectTableInSection(tableNumber) {

            if (this.selectedWaiter != null) {
                const assignationFound = this.tempAssignationList.find((assignation) => {
                    return (
                        assignation.employeeNumber == this.selectedWaiter.waiterNumber &&
                        assignation.tableNumber == tableNumber
                    );
                })
                const assignedToWaiter = this.tempAssignationList.find((assignation) => {
                    return assignation.employeeNumber != this.selectedWaiter.waiterNumber &&
                        assignation.tableNumber == tableNumber && assignation.isActive
                })

                if ((!assignationFound && assignedToWaiter)) {
                    alert("La table est déjà assignée à quelqu'un d'autre! Vous devez retirer la table de sa section actuelle avant de pouvoir la réassigner dans une autre section.")
                }
                else if (assignationFound && !assignedToWaiter) {
                    assignationFound.isActive = !assignationFound.isActive;
                }
                else {
                    const newAssignation = {
                        tableNumber: tableNumber,
                        employeeNumber: this.selectedWaiter.waiterNumber,
                        employeeColor: this.selectedWaiter.employeeColor,
                        isActive: true
                    }
                    this.tempAssignationList.push(newAssignation);
                }

                this.createLocalAssignations();
            }
        },
        async buildAssignations() {
            const newAssignationList = this.tempAssignationList.map(assignation => {
                return {
                    ...assignation,
                    date: this.selectedDate,
                    shift: this.selectedShift
                }
            })
            await createAssignations(newAssignationList)
            this.refreshPageView();
            this.inEditionMode = false;
            this.tempAssignationList = [];

        },
        toggleEditionMode() {
            this.inEditionMode = !this.inEditionMode;
            if (!this.inEditionMode) {
                this.tempAssignationList = [];
            } else {
                this.createLocalAssignations();
            }
        },
        refreshPageView() {
            this.loadTableList();
            this.loadAssignationList(this.selectedDate, this.selectedShift)
            this.loadReservations(this.selectedDate, this.selectedDate);
            this.updateTableLayout();
        }
    },
    watch: {
        selectedDate() {
            this.inEditionMode = false;
            this.toggleSelectedTable();
            this.refreshPageView();
        },
        selectedShift() {
            this.loadAssignationList(this.selectedDate, this.selectedShift);
            this.loadReservations(this.selectedDate, this.selectedDate);

        },
        selectedReservationId() {
            if (this.selectedReservationId) {
                getReservationById(this.selectedReservationId)
                    .then(reservation => {
                        this.reservationInformations = reservation;
                    }).catch(err => {
                        console.error(err);
                    })
            }
            else {
                this.reservationInformations = null;
            }
        },
        selectedTable() {
            if (this.selectedTable != null) {
                if (this.selectedTable.hasReservation) this.selectedReservationId = this.selectedTable.reservation.id;
            } else {
                this.selectedReservationId = null
            }
        },
    },
    created() {
        this.loadDate();
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
        this.refreshPageView();
    }
}
</script>