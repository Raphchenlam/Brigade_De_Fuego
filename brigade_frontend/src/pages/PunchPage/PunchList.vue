<template>
    <v-row class="ma-5 justify-center">
        <v-sheet width="300">
            <v-text-field v-model="currentDate" width="50%" type="date" label="Date">
            </v-text-field>
        </v-sheet>
    </v-row>
    <v-sheet class="mx-10">
        <v-data-table-server no-data-text="Aucun punch à cette date-ci" height="300px" fixed-header :headers="headers" :items="punchList"
            :items-length="punchList.length" class="elevation-1" @update:options="loadPunch">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Listes des punchs</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
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
                                            <v-text-field type="date" v-model="editedItem.dateIn"
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
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="close">
                                    Annuler
                                </v-btn>
                                <v-btn color="blue-darken-1" variant="text" @click="save">
                                    Sauvegarder
                                </v-btn>
                            </v-card-actions>
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
import { getPunchListByDate } from '../../services/PunchService';

export default {
    inject: ['toLocale'],
    components: {
        VDataTable,
    },
    data() {
        return {
            dialog: false,
            currentDate: null,
            punchList: [],
            headers: [
                {
                    align: 'start',
                    key: 'employeeNumber',
                    sortable: false,
                    title: '#Employee',
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
                    key: 'total',
                    sortable: false,
                    title: 'Total',
                },
                {
                    key: 'actions',
                    sortable: false,
                    title: 'Action',
                },
            ],
            editedIndex: -1,
            editedItem: {
                id: 0,
                employeeNumber: "",
                dateIn: "",
                startTime: "",
                dateOut: "",
                endTime: null,
                total: null
            },
            defaultItem: {
                id: 0,
                employeeNumber: "",
                dateIn: "",
                startTime: "",
                dateOut: "",
                endTime: null,
                total: null
            },
        }
    },
    methods: {
        loadPunchListFromCurrentDate() {
            this.punchList = [];
            console.log('DATE COURANTE', this.currentDate);
            getPunchListByDate(this.currentDate).then(allPunchs => {
                console.log('allPunchs', allPunchs);
                allPunchs.forEach(employeePunch => {
                    this.punchList.push(employeePunch);
                });
            }).catch(err => {
                console.error(err);
            });
        },
        editItem(item) {
            console.log('SELECTED PUNCH', Object.assign({},item));
            this.editedIndex = this.punchList.indexOf(item)
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            });
        },
        save() {

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