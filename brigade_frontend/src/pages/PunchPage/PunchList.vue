<template>
    <v-row class="ma-5 justify-center">
        <v-sheet width="300">
            <v-text-field v-model="date" width="50%" type="date" label="Date">
            </v-text-field>
        </v-sheet>
    </v-row>
    <v-sheet class="mx-10">
        <v-data-table-server height="300px" fixed-header :headers="headers" :items="punchList"
            :items-length="punchList.length" class="elevation-1" @update:options="loadPunch">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Listes des punchs</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">Modifier Punch</span>
                                <!-- on va devoir changer pour le name lorsque le fetch sera fait avec le inner join -->
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row class=" ma-2 justify-space-between">
                                        <p>Nom employee : {{ editedItem.id }}</p>
                                        <p>Numero Employee : {{ editedItem.employeeNumber }}</p>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="date" v-model="editedItem.dateIn"
                                                label="Date IN"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="time" v-model="editedItem.punchIn" label="Heure IN"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="date" v-model="editedItem.dateOut"
                                                label="Date OUT"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="time" v-model="editedItem.punchOut" label="Heure OUT"></v-text-field>
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

export default {
    components: {
        VDataTable,

    },
    data()
    {
        return {
            dialog: false,
            date: null,
            punchList: [],
            headers: [
                {
                    align: 'start',
                    key: 'employeeNumber',
                    sortable: false,
                    title: 'Nom',
                },
                {
                    key: 'punchIn',
                    sortable: false,
                    title: 'IN',
                },
                {
                    key: 'punchOut',
                    sortable: false,
                    title: 'OUT',
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
                punchIn: "",
                dateOut: "",
                punchOut: null,
                total: null
            },
            defaultItem: {
                id: 0,
                employeeNumber: "",
                dateIn: "",
                punchIn: "",
                dateOut: "",
                punchOut: null,
                total: null
            },
        }
    },
    methods: {
        loadPunch()
        {
            const allPunch = [
                {
                    id: 1,
                    employeeNumber: "1111",
                    dateIn: "2023-09-23",
                    punchIn: "10:00",
                    dateOut: "2023-09-23",
                    punchOut: "15:00",
                    total: "5:00"
                },
                {
                    id: 2,
                    employeeNumber: "2222",
                    dateIn: "2023-09-23",
                    punchIn: "11:00",
                    dateOut: "2023-09-23",
                    punchOut: "16:00",
                    total: "5:00"
                },
                {
                    id: 3,
                    employeeNumber: "3333",
                    dateIn: "2023-09-23",
                    punchIn: "15:00",
                    dateOut: "2023-09-23",
                    punchOut: "16:00",
                    total: "5:00"
                },
                {
                    id: 4,
                    employeeNumber: "4444",
                    dateIn: "2023-09-23",
                    punchIn: "17:00",
                    dateOut: "2023-09-23",
                    punchOut: "23:00",
                    total: "6:00"
                },
                {
                    id: 5,
                    employeeNumber: "5555",
                    dateIn: "2023-09-23",
                    punchIn: "19:00",
                    dateOut: "2023-09-23",
                    punchOut: "16:00",
                    total: "5:00"
                },
            ];
            this.punchList = allPunch;
        },
        editItem(item)
        {
            this.editedIndex = this.punchList.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        close()
        {
            this.dialog = false
            this.$nextTick(() =>
            {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save()
        {

        }
    },
    mounted()
    {
        this.date = "2023-09-05" //changer pour obtenir la date de aujourdhui
    },
}
</script>