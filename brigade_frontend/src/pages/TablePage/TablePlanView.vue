<template>
    <v-sheet width="100%" class="pa-2">
        <v-row>
            <v-col>
                <v-row>
                    <TableLayout v-if="selectedTable == null" class="pa-2"></TableLayout>
                    <TableInformation v-else class="pa-2" :reservation="reservationInformations" ></TableInformation>
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
            //reservationToSelect:null,

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

        }
    },
    methods: {
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
        filterReservationsStatus(){
            this.reservations = this.reservations.filter((reservation)=>{
                return (reservation.statusCode < 5)
            })
        },
        loadDate(newReservationDate, newReservationShift) {
            //************************/
            //***A remettre en place**/
            //************************/
            // const todayDate = new Date().toISOString().split('T')[0];
            const todayDate = this.toLocale(new Date().toLocaleDateString("en-GB")).date.fullDate;

            this.selectedDate = (newReservationDate) ? newReservationDate : todayDate;
            this.selectedShift = (newReservationShift) ? newReservationShift : "Midi";
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
            //this.tableWithAssignationList = [];
            fetchAssignationByDate(date).then(allAssignations => {
                allAssignations.forEach(assignation => {
                    if (assignation.shift == shift) {
                        this.assignationList.push(assignation);
                    }
                });
                // this.updateTableLayout();
            }).catch(err => {
                console.error(err);
            });
        },
        updateTableLayout() {
            this.tableWithAssignationList = [];

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
                            if (table.isActive) {
                                table.hasReservation = true;
                                table.reservation = reservation;
                            } else {
                                console.error(`La table ${table.number} est inactive`);
                                const todayDate = this.toLocale(new Date().toLocaleDateString("en-GB")).date.fullDate;
                                if (todayDate == this.selectedDate) {
                                    table.hasReservation = false;
                                    updateTableOnReservationById(reservation.id, 0)
                                    //reservation.tableNumber = null;
                                }
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

            //console.log("Create the new localAssignations with :" + this.tempAssignationList.length)
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
                // if (table.isActive && !assignation.isActive) {
                //     table.isAssign = false;
                // } else if (!table.isActive) {
                //     console.error(`La table ${table.number} est inactive.... veuillez retirer l'assignation`);
                //     table.isAssign = false;
                //     assignation.isActive = false;
                // } else {
                //     table.isAssign = true;
                // }
                //table.assignation = assignation;
            })
            if(this.reservations.length > 0) {
                this.reservations.forEach(reservation => {
                    let shift = null;
                    if(parseInt(reservation.startTime.split(':').slice(0)[0]) > 15) shift = "Soir" 
                    if(parseInt(reservation.startTime.split(':').slice(0)[0]) <= 15) shift = "Midi" 

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
                                // const todayDate = this.toLocale(new Date().toLocaleDateString("en-GB")).date.fullDate;
                                // if (todayDate == this.selectedDate) {
                                //     table.hasReservation = false;
                                //     updateTableOnReservationById(reservation.id, null)
                                //     //reservation.tableNumber = null;
                                // }
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
            console.log('tableInSection : ' + tableNumber)

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
                console.log("AssignationFound : " + assignationFound);
                console.log("AssignedToWaiter : " + assignedToWaiter);

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
                // this.tempAssignationList = this.tempAssignationList.filter((assignation) => {
                //     return assignation.isActive;
                // })
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
            // this.loadAssignationList(this.selectedDate, this.selectedShift);
            // this.loadReservations(this.selectedDate, this.selectedDate);
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
        selectedTable(){
            if (this.selectedTable != null) {
                if(this.selectedTable.hasReservation)this.selectedReservationId = this.selectedTable.reservation.id;
            } else {
                this.selectedReservationId = null
            }            
        }
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