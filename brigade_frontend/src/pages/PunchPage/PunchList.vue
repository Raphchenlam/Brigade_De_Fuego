<template>
    <v-row class="ma-5 justify-center">
        <v-sheet width="300">
            <v-text-field v-model="currentDate" width="50%" type="date" label="Date">
            </v-text-field>
        </v-sheet>
    </v-row>
    <v-sheet class="mx-10">
        <v-data-table-server no-data-text="Aucun punch à la date sélectionnée" height="300px" fixed-header :headers="headers"
            :items="punchList" :items-length="punchList.length" class="elevation-1" @update:options="loadPunch">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Liste des punchs</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="updatePunchDialog" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Modifier Punch - {{ editedItem.employeeFullName }}</span>
                                <!-- on va devoir changer pour le name lorsque le fetch sera fait avec le inner join -->
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row class=" ma-2 justify-space-between">
                                        <p>Numero Employee : {{ editedItem.employeeNumber }}</p>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field disabled type="date" v-model="editedItem.dateIn"
                                                label="Date IN"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="time" v-model="editedItem.startTime"
                                                label="Heure IN"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="date" v-model="editedItem.dateOut"
                                                label="Date OUT"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="time" v-model="editedItem.endTime"
                                                label="Heure OUT"></v-text-field>
                                        </v-col>
                                        <v-col v-if="errorPunchInfo" cols="12">
                                            <span style="color: red;"> Une ou des informations sont manquantes ou invalides,
                                                veuillez les régler</span>
                                        </v-col>
                                        <v-col v-if="dateOutError" cols="12">
                                            <span style="color: red;">La date de fin doit être plus récente que la date de
                                                début</span>
                                        </v-col>
                                        <v-col v-if="endTimeError" cols="12">
                                            <span style="color: red;">L'heure de fin doit être après l'heure de début</span>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="close">
                                    Annuler
                                </v-btn>
                                <v-btn color="blue-darken-1" variant="text" @click="editPunchInfo">
                                    Sauvegarder
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="OKupdatedPunchDialog" width="50%" persistent>
                        <v-card height="100px">
                            <v-card-title>
                                <span>Confirmation de modification de punch</span>
                            </v-card-title>
                            <v-card-text>
                                <v-row class="justify-center">
                                    <p>Le punch de {{ editedItem.employeeFullName }} le {{ editedItem.dateIn }} a été
                                        modifié
                                    </p>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                </v-icon>
            </template>
        </v-data-table-server>
    </v-sheet>
</template>

<script>


import { VDataTable } from 'vuetify/labs/VDataTable'
import { getPunchListByDate, updatePunch } from '../../services/PunchService';

export default {
    inject: ['toLocale'],
    components: {
        VDataTable,
    },
    data() {
        return {
            updatePunchDialog: false,
            OKupdatedPunchDialog: false,
            errorPunchInfo: false,
            dateOutError: false,
            endTimeError: false,
            currentDate: null,
            punchList: [],
            headers: [
                {
                    align: 'start',
                    key: 'employeeNumber',
                    sortable: false,
                    title: '#EMPLOYÉ',
                },
                {
                    key: 'employeeFullName',
                    sortable: false,
                    title: 'NOM',
                },
                {
                    key: 'dateIn',
                    sortable: false,
                    title: 'DATE IN',
                },
                {
                    key: 'startTime',
                    sortable: false,
                    title: 'START AT',
                },
                {
                    key: 'dateOut',
                    sortable: false,
                    title: 'DATE OUT',
                },
                {
                    key: 'endTime',
                    sortable: false,
                    title: 'END AT',
                },
                {
                    key: 'actions',
                    sortable: false,
                    title: 'ACTION',
                },
            ],
            editedIndex: -1,
            editedItem: {
                id: 0,
                employeeNumber: "",
                dateIn: "",
                startTime: "",
                dateOut: "",
                endTime: null
            },
            defaultItem: {
                id: 0,
                employeeNumber: "",
                dateIn: "",
                startTime: "",
                dateOut: "",
                endTime: null
            },
        }
    },
    methods: {
        loadPunchListFromCurrentDate() {
            this.punchList = [];
            getPunchListByDate(this.currentDate).then(allPunchs => {
                allPunchs.forEach(employeePunch => {
                    this.punchList.push(employeePunch);
                });
            }).catch(err => {
                console.error(err);
            });
        },
        editItem(item) {
            this.editedIndex = this.punchList.indexOf(item)
            this.editedItem = Object.assign({}, item);
            this.updatePunchDialog = true;
        },
        close() {
            this.updatePunchDialog = false;
            this.OKupdatedPunchDialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            });
        },
        editPunchInfo() {
            this.verifyPunchInfo();
            if (this.errorPunchInfo) return;
            updatePunch(this.editedItem).then(updatedPunch => {
                if (updatedPunch) {
                    this.OKupdatedPunchDialog = true;
                    this.loadPunchListFromCurrentDate();
                    setTimeout(this.close, 2500);
                }
            }).catch(err => {
                console.error(err);
            });
        },
        verifyPunchInfo() {

            this.errorPunchInfo = false;
            this.dateOutError = false;
            this.endTimeError = false;

            if (!this.editedItem.dateIn || !this.editedItem.startTime) this.errorPunchInfo = true;
            if ((this.editedItem.dateOut && !this.editedItem.endTime) || (!this.editedItem.dateOut && this.editedItem.endTime)) this.errorPunchInfo = true;

            const dateInParts = this.editedItem.dateIn.split('-');
            const dateOutParts = this.editedItem.dateOut.split('-');

            const dateInObj = new Date(dateInParts[0], dateInParts[1] - 1, dateInParts[2]);
            const dateOutObj = new Date(dateOutParts[0], dateOutParts[1] - 1, dateOutParts[2]);

            if (dateOutObj >= dateInObj) {
                if (this.editedItem.startTime > this.editedItem.endTime) {
                    this.errorPunchInfo = true;
                    this.endTimeError = true;
                }
            }

            if (dateOutObj < dateInObj) {
                this.errorPunchInfo = true;
                this.dateOutError = true;
            }
        }
    },
    watch: {
        currentDate() {
            this.loadPunchListFromCurrentDate();
        }
    },
    mounted() {
        this.currentDate = this.toLocale(new Date().toLocaleDateString('en-GB')).date.fullDate;
    },
}
</script>