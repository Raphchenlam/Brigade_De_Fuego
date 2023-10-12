<template>
    <v-sheet width="100%" class="pa-2">
        <v-row>
            <v-col>

                <v-row>
                    <TableLayout v-if="selectedTable == null" class="pa-2"></TableLayout>
                    <TableInformation v-else class="pa-2"></TableInformation>
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
import { fetchAllTables, fetchAssignationByDate } from '../../services/TableService';


// QUERIES TO UPDATE EMPLOYEE COLOR
// UPDATE employee
// 	SET color_hexcode='4C0099'
// 	WHERE employee_number=2222;


export default {
    inject: [ 'toLocale' ],
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
            localAssignations: [],
            tempAssignationList: [],
            tableWithAssignationList: [],
            selectedDate: this.loadDate(),
            selectedShift: "Midi",
            selectedTable: null,
            selectedReservationId: null,
            tableInSection: null,
            selectedWaiter: null,
            inEditionMode: false,


            ////////////TEMPORAIRE/////////
            hasReservation: true,

        }
    },
    provide() {
        return {
            tableList: computed(() => this.tableList),
            assignationList: computed(() => this.assignationList),
            tableWithAssignationList: computed(() => this.tableWithAssignationList),
            selectedDate: computed(() => this.selectedDate),
            selectedShift: computed(() => this.selectedShift),
            selectedTable: computed(() => this.selectedTable),
            selectedWaiter: computed(() => this.selectedWaiter),
            tableInSection: computed(() => this.tableInSection),
            inEditionMode: computed(() => this.inEditionMode),
            localAssignations: computed(() => this.localAssignations),

            toggleEditionMode: this.toggleEditionMode,
            toggleSelectedTable: this.toggleSelectedTable,
            displaySelectedTable: this.displaySelectedTable,
            selectTableInSection: this.selectTableInSection,
            loadReservationInformations: this.loadReservationInformations,
            buildAssignations: this.buildAssignations,
            selectWaiter: this.selectWaiter,
            loadDate: this.loadDate,
            
            
            ////////////TEMPORAIRE/////////
            hasReservation: computed(() => this.hasReservation),
        }
    },
    methods: {
        loadReservationInformations(receivedReservationId) {
            this.selectedReservationId = receivedReservationId;
        },
        loadDate(newReservationDate, newReservationShift) {
            //************************/
            //***A remettre en place**/
            //************************/
            // const todayDate = new Date().toISOString().split('T')[0];
            const todayDate = this.toLocale(new Date().toLocaleDateString()).date.fullDate;

            // this.selectedDate = todayDate;
            this.selectedDate = (newReservationDate) ? newReservationDate : todayDate;
            this.selectedShift = newReservationShift;
            return todayDate;
        },
        loadTableList() {
            // console.log('Loading table list...');
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
            // console.log('Loading assignation list...');
            this.assignationList = [];
            this.tableWithAssignationList = [];
            fetchAssignationByDate(date).then(allAssignations => {
                allAssignations.forEach(assignation => {
                    if (assignation.shift == shift) {
                        this.assignationList.push(assignation);
                    }
                });
                this.updateTableLayout();
            }).catch(err => {
                console.error(err);
            });
            // console.log("assignationList: " + this.assignationList.length)
        },
        updateTableLayout() {
            this.tableWithAssignationList = [];
            // console.log('tableList:', this.tableList);
            // console.log('tableList:', this.tableList.length);
            // console.log('assignationList:', this.assignationList);
            // console.log('assignationList:', this.assignationList.length);

            this.tableWithAssignationList = this.tableList.map(table => {
                return {
                    number: table.number,
                    capacity: table.capacity,
                    isActive: table.isActive,
                    isAssign: false,
                    assignation: null,
                }
            });
            // console.log("tableWithAssi... : " +this.tableWithAssignationList.length);

            if (this.assignationList.length > 0) {
                this.assignationList.forEach(assignation => {

                    const table = this.tableWithAssignationList.find(table => {
                        return (table.number == assignation.tableNumber)
                    })
                    if (table.isActive && assignation.isActive) {
                        table.isAssign = true;
                        table.assignation = assignation;
                    } else {
                        console.error(`La table ${table.number} est inactive`);
                        assignation.isActive = false;
                    }
                }
                );
            }
        },
        selectWaiter(waiterNumber, employeeColor) {
            if (this.selectedWaiter == null || this.selectedWaiter.waiterNumber != waiterNumber) {
                this.selectedWaiter = {
                    waiterNumber: waiterNumber,
                    employeeColor: employeeColor
                }
            }else{
                this.selectedWaiter = null;
            }

        },
        createLocalAssignations() {
            console.log("Create the new localAssignations with :" + this.tempAssignationList.length)
            this.localAssignations = [];
            this.localAssignations = this.tableList.map(table => {
                return {
                    number: table.number,
                    capacity: table.capacity,
                    isActive: table.isActive,
                    isAssign: false,
                    assignation: null,
                }
            });
            if (this.tempAssignationList.length > 0) {
                this.tempAssignationList.forEach(assignation => {

                    const table = this.localAssignations.find(table => {
                        return (table.number == assignation.tableNumber)
                    })
                    if (table.isActive && !assignation.isActive) {
                        table.isAssign = false;
                    } else if (!table.isActive) {
                        console.error(`La table ${table.number} est inactive.... veuillez retirer l'assignation`);
                        table.isAssign = false;
                        assignation.isActive = false;
                    } else {
                        table.isAssign = true;
                    }
                    table.assignation = assignation;
                }
                );
            }
        },
        loadReservationInformations(receivedReservationId) {
            this.selectedReservationId = receivedReservationId;
        },
        toggleSelectedTable() {
            if (this.selectedTable != "" || this.selectedTable != null) {
                this.selectedTable = null;
            }
        },
        displaySelectedTable(number) {
            // console.log("DisplaySelectedTable : " + number)
            this.selectedTable = this.tableWithAssignationList.find((table) => {
                return table.number == number;
            })
            // console.log("DisplaySelectedTable : " + this.selectedTable)
        },
        selectTableInSection(tableNumber) {
            //this.tableInSection = tableNumber
            console.log('tableInSection : ' + tableNumber)

            if (this.selectedWaiter != null) {
                const assignationFound = this.tempAssignationList.find((assignation) => {
                    return (
                        assignation.waiterNumber == this.selectedWaiter.waiterNumber &&
                        assignation.tableNumber == tableNumber
                    );
                })
                const assignedToWaiter = this.tempAssignationList.find((assignation) => {
                    return assignation.waiterNumber != this.selectedWaiter.waiterNumber &&
                        assignation.tableNumber == tableNumber && assignation.isActive
                })
                console.log("AssignationFound : " + assignationFound);
                console.log("AssignedToWaiter : " + assignedToWaiter);

                if ((assignationFound && assignedToWaiter) || assignedToWaiter) {
                    alert("La table est déjà assignée à quelqu'un d'autre! Vous devez retirer la table de sa section actuelle avant de pouvoir la réassigner dans une autre section.")
                }
                else if (assignationFound && !assignedToWaiter) {
                    assignationFound.isActive = !assignationFound.isActive;
                }
                else {
                    const newAssignation = {
                        tableNumber: tableNumber,
                        waiterNumber: this.selectedWaiter.waiterNumber,
                        employeeColor: this.selectedWaiter.employeeColor,
                        isActive: true
                    }
                    this.tempAssignationList.push(newAssignation);
                }
                this.tempAssignationList = this.tempAssignationList.filter((assignation) => {
                    return assignation.isActive;
                })
                this.createLocalAssignations();
            }
        },
        toggleEditionMode() {
            this.inEditionMode = !this.inEditionMode;
            if (!this.inEditionMode) {
                // this.selectedWaiter = null;
                this.tempAssignationList = [];
            }
        },
    },
    watch: {
        selectedDate() {
            // console.log('selectedDate changed');
            this.loadAssignationList(this.selectedDate, this.selectedShift);
        },
        selectedShift() {
            // console.log('tableList changed');
            this.loadAssignationList(this.selectedDate, this.selectedShift);
        },

        // tableInSection() {
        //     console.log('tableInSection : ' + this.tableInSection)
        //     if (this.selectedWaiter != null) {
        //         const assignationIndex = this.tempAssignationList.indexOf((assignation) => {
        //             return (assignation.tableNumber == this.tableInSection) && (assignation.waiterNumber == this.selectWaiter.waiterNumber)
        //         })
        //         if (assignationIndex != -1) {
        //             this.tempAssignationList.splice(assignationIndex, 1);
        //         }
        //         else {
        //             const newAssignation = {
        //                 tableNumber: this.tableInSection,
        //                 waiterNumber: this.selectedWaiter.waiterNumber,
        //                 employeeColor: this.selectedWaiter.employeeColor,
        //                 isActive: true
        //             }
        //             this.tempAssignationList.push(newAssignation);
        //             this.createLocalAssignations();
        //         }
        //     }
        // },

        inEditionMode() {
            if (this.inEditionMode) {
                this.createLocalAssignations();
            }
        }
    },
    created() {
        this.loadDate();
    },
    mounted() {
        // console.clear();
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
        // this.loadDate();
        this.loadTableList();
        this.loadAssignationList();
    }
}
</script>