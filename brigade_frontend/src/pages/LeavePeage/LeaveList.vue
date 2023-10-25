<template>
    <v-sheet class="w-100">
        <v-sheet
            v-if="(this.isUserAuthorized() && $route.fullPath == '/espace/leave')"
            class="ma-5">
            <v-row class="ma-5 justify-space-around">
                <v-col cols="11">
                    <h3>Nombre de demande de conges non-traite : {{ calculatePendingLeaves }} affichées / {{ nbPendingLeave
                    }} total</h3>
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
                                                <v-checkbox v-model="checkedBoxes.coming" label="En Cours / À venir"></v-checkbox>
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
                <v-text-field v-model="search" hide-details placeholder="Rechercher un employe"
                    class="mx-10"></v-text-field>
            </v-row>
        </v-sheet>
        <v-sheet :class="this.isUserAuthorized() && $route.fullPath == '/espace/leave' ? 'mx-10' : 'mx-5'">
            <v-data-table-server no-data-text="Aucune demande de congés à afficher" v-model:items-per-page="itemsPerPage"
                v-model:expanded="expanded" :loading="loading" height="100%" fixed-header :headers="headers"
                :hide-default-footer="true" :items="filteredLeaveList" :items-length="filteredLeaveList.length"
                class="elevation-1" hide-default-footer disable-pagination @update:options="loadLeaves" show-expand>

                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Listes des conges</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialogNewLeave" max-width="500px">
                            <template v-slot:activator="{ props }">
                                <BlackButton v-bind="props" textbutton="+"> </BlackButton>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">Faire une demande de congé</span>
                                </v-card-title>
                                <NewLeaveForm :employeeNumberReceived="employeeNumber"></NewLeaveForm>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-dialog v-model="dialogEditLeave" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Modifier Conge</span>
                            </v-card-title>
                            <v-card-text>
                                <EditLeaveForm :editedItem="editedItem"></EditLeaveForm>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="editedItem.status != 'Accepté'" color="green" variant="text"
                                    @click="closeEditLeaveDialog">
                                    Accepter
                                </v-btn>
                                <v-btn v-if="editedItem.status != 'Refusé'" color="red" variant="text"
                                    @click="closeEditLeaveDialog">
                                    Refuser
                                </v-btn>
                                <v-btn variant="text" @click="closeEditLeaveDialog">
                                    Annuler
                                </v-btn>
                                <v-btn variant="text" @click="save">
                                    Sauvegarder
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-icon v-if="item.raw.status != 'Approved' && this.isUserAuthorized()" size="small"
                        class="me-2 approved-icon" @click="accept(item.raw)">
                        mdi-check
                    </v-icon>
                    <v-icon v-if="item.raw.status != 'Refused' && this.isUserAuthorized()" size="small"
                        class="me-2 refused-icon" @click="refuse(item.raw)">
                        mdi-close
                    </v-icon>
                    <!-- Ligne a decommenter au sprint 4 lors de la modification d'un congé -->
                    <!-- <v-icon size="small" class="me-2" @click="editItem(item.raw)"> mdi-pencil </v-icon> -->
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
import BlackButton from '../../components/Reusable/BlackButton.vue'
import EditLeaveForm from './EditLeaveForm.vue'

import { getAllFilteredLeaves, getleavesByEmployeeNumber, updateLeave } from '../../services/LeaveService';
import NewLeaveForm from './NewLeaveForm.vue';

export default {
    inject: ['isUserAuthorized'],
    components: {
        EditLeaveForm,
        BlackButton,
        NewLeaveForm
    },
    props: {
        height: String,
        employeeNumber: Number
    },
    data()
    {
        return {
            userSession: userSession,
            search: "",
            filterDialog: false,
            roleShowed: "Tous",
            dialogNewLeave: false,
            dialogEditLeave: false,
            expanded: [],
            leaveList: [],
            filteredLeaveList: [],
            nbPendingLeave: 0,
            loading: true,
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
                    key: 'statusShow',
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
            itemsPerPage: 100,
            checkedBoxes: {
                all: false,
                pending: true,
                pendingModified: true,
                refused: false,
                accepted: false,
                passed: false,
                coming: true
            },
            checkedBoxAccepted: true
        }
    },
    methods: {
        loadLeaves()
        {
            this.leaveList = [];
            if (this.employeeNumber)
            {
                getleavesByEmployeeNumber(this.employeeNumber).then(allLeaves =>
                {
                    allLeaves.forEach(leave =>
                    {
                        leave.startDate = leave.startDate.split('T').slice(0)[0]
                        leave.endDate = leave.endDate.split('T').slice(0)[0]
                        if (leave.status == 'Pending') leave.statusShow = 'En Attente'
                        if (leave.status == 'PendingModified') leave.statusShow = 'En Attente (modifié)'
                        if (leave.status == 'Approved') leave.statusShow = 'Accepté'
                        if (leave.status == 'Refused') leave.statusShow = 'Refusé'
                        this.leaveList.push(leave);
                    });
                    this.loading = false;
                }).catch(err =>
                {
                    console.error(err);
                });
            } else
            {
                getAllFilteredLeaves(this.checkedBoxes).then(allLeaves =>
                {
                    if (allLeaves.length == 0)
                    {
                        this.leaveList = allLeaves;
                        this.filteredLeaveList = this.leaveList;
                    }
                    allLeaves.forEach(leave =>
                    {
                        if (!leave.nbPending)
                        {
                            leave.startDate = leave.startDate.split('T').slice(0)[0]
                            leave.endDate = leave.endDate.split('T').slice(0)[0]
                            if (leave.status == 'Pending') leave.statusShow = 'En Attente'
                            if (leave.status == 'PendingModified') leave.statusShow = 'En Attente (modifié)'
                            if (leave.status == 'Approved') leave.statusShow = 'Accepté'
                            if (leave.status == 'Refused') leave.statusShow = 'Refusé'
                            this.leaveList.push(leave)
                        } else
                        {
                            this.nbPendingLeave = leave.nbPending;
                        }
                    });
                    this.loading = false;
                }).catch(err =>
                {
                    console.error(err);
                })
            }
            this.filteredLeaveList = this.leaveList;
        },
        editItem(item)
        {
            this.editedIndex = this.leaveList.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogEditLeave = true
        },
        accept(item)
        {
            const oldStatus = item.status;
            const oldStatusShow = item.statusShow;
            item.status = "Approved"
            item.statusShow = "Accepté"
            updateLeave(item).then(result =>
            {
                this.nbPendingLeave -= 1;
            }).catch(err =>
            {
                item.status = oldStatus;
                item.statusShow = oldStatusShow;
                console.error(err);
                alert(err);
            })
        },
        refuse(item)
        {
            const oldStatus = item.status;
            const oldStatusShow = item.statusShow;
            item.status = "Refused"
            item.statusShow = "Refusé"
            updateLeave(item).then(result =>
            {
                this.nbPendingLeave -= 1;
            }).catch(err =>
            {
                item.status = oldStatus;
                item.statusShow = oldStatusShow;
                console.error(err);
                alert(err);
            })
        },
        closeEditLeaveDialog()
        {
            this.dialogEditLeave = false
            this.$nextTick(() =>
            {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        closeNewLeaveDialog()
        {
            this.dialogNewLeave = false;
        },
        save()
        {

        },
        applyFilter()
        {
            this.loadLeaves();
            this.filterDialog = false;
        },
        checkAllBoxes()
        {
            if (this.checkedBoxes.all == false)
            {
                this.checkedBoxes.all = true;
                this.checkedBoxes.pending = true;
                this.checkedBoxes.pendingModified = true;
                this.checkedBoxes.accepted = true;
                this.checkedBoxes.refused = true;
                this.checkedBoxes.passed = true;
                this.checkedBoxes.coming = true;
            }
            else
            {
                this.checkedBoxes.all = false;
                this.checkedBoxes.pending = false;
                this.checkedBoxes.pendingModified = false;
                this.checkedBoxes.accepted = false;
                this.checkedBoxes.refused = false;
                this.checkedBoxes.passed = false;
                this.checkedBoxes.coming = false;
            }
        },
    },
    computed: {
        calculatePendingLeaves()
        {
            let nbPendingLeave = 0;
            this.leaveList.forEach(leave =>
            {
                if (leave.status == 'Pending' || leave.status == 'PendingModified') nbPendingLeave++

            });
            return nbPendingLeave
        }
    },
    watch: {
        'checkedBoxes': {
            handler: function (checkboxList)
            {
                for (var checkbox in checkboxList)
                {
                    if (checkboxList[checkbox] == false && checkbox != "all")
                    {
                        this.checkedBoxes.all = false;
                        return;
                    }
                }
                this.checkedBoxes.all = true;
            },
            deep: true
        },
        search()
        {
            this.filteredLeaveList = [];
            this.leaveList.forEach(leave =>
            {
                if (leave.employeeName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0)
                {
                    this.filteredLeaveList.push(leave);
                }
            });
        },
        employeeNumber()
        {
            this.loadLeaves()
        }
    },
    provide()
    {
        return {
            closeNewLeaveDialog: this.closeNewLeaveDialog,
            loadLeaves: this.loadLeaves
        }
    },
    created()
    {
        if (!userSession.employeeNumber && !userSession.password)
        {
            this.$router.push('/espace');
        }
    },
    mounted()
    {
        if (this.employeeName)
        {
            this.search = this.employeeName;
        }
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