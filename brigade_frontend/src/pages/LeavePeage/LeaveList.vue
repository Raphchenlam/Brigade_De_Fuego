<template>
    <v-sheet class="h-auto">
    <v-sheet v-if="userSession.user.isAdmin && $route.fullPath == '/espace/leave'">
        <v-row class="ma-5 justify-space-around">
            <v-col cols="6">
                <h3>Nombre de demande de conges non-traite : {{ calculatePendingLeaves }}</h3>
            </v-col>
            <v-col cols="1">
                <v-icon size="x-large" class="me-2n" @click="filterDialog = true">
                    mdi-filter-outline
                </v-icon>
                <template>
                    <v-dialog v-model="filterDialog" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Filtre Conge</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-checkbox @click="checkAllBoxes()" v-model="checkedBoxes.all"
                                                label="Tout selectionner"></v-checkbox>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-checkbox v-model="checkedBoxes.pending" label="En Attente"></v-checkbox>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-checkbox v-model="checkedBoxes.pendingModified"
                                                label="Modifié, en attente"></v-checkbox>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-checkbox v-model="checkedBoxes.accepted" label="Accepté"></v-checkbox>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-checkbox v-model="checkedBoxes.refused" label="Refusé"></v-checkbox>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-checkbox v-model="checkedBoxes.coming" label="À venir"></v-checkbox>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-checkbox v-model="checkedBoxes.passed" label="Passé"></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn variant="text" @click="filterDialog = false">
                                    Annuler
                                </v-btn>
                                <v-btn variant="text" @click="applyFilter">
                                    Appliquer
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
            </v-col>
        </v-row>
        <v-row>
            <v-text-field @input="loadLeaves" v-model="search" hide-details placeholder="Rechercher un employe"
                class="mx-10"></v-text-field>
        </v-row>
    </v-sheet>
    <v-sheet class="ma-5">
        <v-data-table-server no-data-text="Aucune demande de congés à venir" v-model:expanded="expanded" height="250" fixed-header :headers="headers" :items="leaveList"
            :items-length="leaveList.length" class="elevation-1" @update:options="loadLeaves" show-expand>
            
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Listes des conges</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-dialog v-model="dialog" max-width="500px">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Modifier Conge</span>
                        </v-card-title>

                        <v-card-text>
                            <EditLeaveForm :editedItem="editedItem"></EditLeaveForm>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn v-if="editedItem.status != 'Accepté'" color="green" variant="text" @click="close">
                                Accepter
                            </v-btn>
                            <v-btn v-if="editedItem.status != 'Refusé'" color="red" variant="text" @click="close">
                                Refuser
                            </v-btn>
                            <v-btn variant="text" @click="close">
                                Annuler
                            </v-btn>
                            <v-btn variant="text" @click="save">
                                Sauvegarder
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-icon v-if="item.raw.status != 'Accepté'" size="small" class="me-2 approved-icon"
                    @click="accept(item.raw)">
                    mdi-check
                </v-icon>
                <v-icon v-if="item.raw.status != 'Refusé'" size="small" class="me-2 refused-icon" @click="refuse(item.raw)">
                    mdi-close
                </v-icon>
                <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                </v-icon>
            </template>

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        ******* Categorie: {{ item.raw.category }} *******
                        <span v-if="item.raw.reason">Raison: {{ item.raw.reason }} </span>
                        <span v-else>Aucune raison</span> *******
                    </td>
                </tr>
            </template>

        </v-data-table-server>
    </v-sheet>
</v-sheet>
</template>

<script>
import userSession from '../../sessions/UserSession';

import EditLeaveForm from './EditLeaveForm.vue'

import { getAllLeaves, getleavesByEmployeeNumber } from '../../services/LeaveService';

export default {
    components: {
        EditLeaveForm
    },
    props: {
        height: String,
        employeeNumber: Number
    },
    data() {
        return {
            userSession: userSession,
            search: "",
            filterDialog: false,
            roleShowed: "Tous",
            dialog: false,
            expanded: [],
            date: null,
            leaveList: [],
            headers: [
                {
                    align: 'start',
                    key: 'employeeName',
                    sortable: false,
                    title: 'Nom',
                },
                {
                    key: 'startDate',
                    sortable: false,
                    title: 'Date Debut',
                },
                {
                    key: 'endDate',
                    sortable: false,
                    title: 'Date Fin',
                },
                {
                    key: 'status',
                    sortable: false,
                    title: 'Status',
                },
                {
                    key: 'actions',
                    sortable: false,
                    title: 'Actions',
                }
            ],
            editedIndex: -1,
            editedItem: {
                id: 0,
                employeeNumber: 0,
                employeeName: "",
                showName: "",
                startDate: "",
                endDate: "",
                status: "",
                category: "",
                reason: ""
            },
            defaultItem: {
                id: 0,
                employeeNumber: 0,
                employeeName: "",
                showName: "",
                startDate: "",
                endDate: "",
                status: "",
                category: "",
                reason: ""
            },
            checkedBoxes: {
                all: true,
                pending: true,
                pendingModified: true,
                refused: true,
                accepted: true,
                passed: true,
                coming: true
            },
            checkedBoxAccepted: true
        }
    },
    methods: {
        loadLeaves() {
            this.leaveList = [];
            console.log("EMPLOYEENUMBER", this.employeeNumber)
            if (this.employeeNumber) {
                getleavesByEmployeeNumber(this.employeeNumber).then(allLeaves => {
                    allLeaves.forEach(leave => {
                        leave.startDate = leave.startDate.split('T').slice(0)[0]
                        leave.endDate = leave.endDate.split('T').slice(0)[0]

                    });
                    this.leaveList = allLeaves;
                });
            } else {
                getAllLeaves().then(allLeaves => {
                    allLeaves.forEach(leave => {

                        leave.startDate = leave.startDate.split('T').slice(0)[0]
                        leave.endDate = leave.endDate.split('T').slice(0)[0]
                        if (this.roleShowed == "Tous") {
                            this.leaveList.push(leave);
                        } else { }
                        //faire une fonction qui permet de seulement ajouter les employee que son attribut role == this.roleShowsed au emplouyeeList

                    });
                }).catch(err => {
                    console.error(err);
                })
            }
        },
        editItem(item) {
            this.editedIndex = this.leaveList.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        accept(item) {
            console.log("Accept", item)
        },
        refuse(item) {
            console.log("Refuse", item)
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save() {

        },
        applyFilter() {
            this.filterDialog = false;
        },
        checkAllBoxes() {
            if (this.checkedBoxes.all == false) {
                this.checkedBoxes.all = true;
                this.checkedBoxes.pending = true;
                this.checkedBoxes.pendingModified = true;
                this.checkedBoxes.accepted = true;
                this.checkedBoxes.refused = true;
                this.checkedBoxes.passed = true;
                this.checkedBoxes.coming = true;
            }
            else {
                this.checkedBoxes.all = false;
                this.checkedBoxes.pending = false;
                this.checkedBoxes.pendingModified = false;
                this.checkedBoxes.accepted = false;
                this.checkedBoxes.refused = false;
                this.checkedBoxes.passed = false;
                this.checkedBoxes.coming = false;
            }
        }
    },
    computed: {
        calculatePendingLeaves() {
            return 3
            // ici faire une requete BD pour voir le nombre de demande qui ont "en attente" comme status
        }
    },
    watch: {
        'checkedBoxes': {
            handler: function (checkboxList) {
                for (var checkbox in checkboxList) {
                    console.log("watch", checkbox, checkboxList[checkbox])

                    if (checkboxList[checkbox] == false && checkbox != "all") {
                        this.checkedBoxes.all = false;
                        return;
                    }
                }
                this.checkedBoxes.all = true;
            },
            deep: true
        },
        employeeNumber() {
            this.loadLeaves()
        }
    },
    mounted() {
        if (this.employeeName) {
            console.log("search = employeename", this.employeeName)
            this.search = this.employeeName;
        }
        //this.loadLeaves();
        this.date = "2023-09-05"; //aller chercher la date de aujourdhui
    }
}

</script>

<style scoped>
/*
.v-list{
  height:100px;
  overflow-y:auto
}
*/
</style>

<style scoped>
.approved-icon {
    color: #00f519;
}

.refused-icon {
    color: #f50000;
}
</style>