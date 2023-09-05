<template>
            <v-row class="ma-5 justify-space-around">
                <v-col cols="6">
                    <v-text-field v-model="date" type="date" label="Date">
                    </v-text-field>
                </v-col>
                <v-col cols="6">
                    <h3>Nombre de demande de conges non-traite : {{ calculatePendingLeaves }}</h3>
                </v-col>
            </v-row>
    <v-row>
        <v-text-field @input="loadLeaves" v-model="search" hide-details placeholder="Rechercher un employe"
            class="mx-10"></v-text-field>
    </v-row>
    <v-sheet class="ma-5">
        <v-data-table-server v-model:expanded="expanded" height="300px" fixed-header :headers="headers" :items="leaveList"
            :items-length="leaveList.length" class="elevation-1" @update:options="loadLeaves" show-expand>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Listes des conges</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
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
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
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
</template>

<script>
import EditLeaveForm from './EditLeaveForm.vue'

export default {
    components: {
        EditLeaveForm
    },
    props: {
        height: String
    },
    data()
    {
        return {
            search: "",
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
        }
    },
    methods: {
        loadLeaves()
        {
            console.log("Rentrer dans loadLeaves");
            const allLeaves = [
                {
                    id: 332,
                    employeeNumber: 1111,
                    employeeName: "Maxime Marchand",
                    showName: "25 Decembre 2023 (Accepte)",
                    startDate: "2023-12-25",
                    endDate: "2023-12-25",
                    status: "Accepté",
                    category: "Personnel",
                    reason: "Noel en famille"
                },
                {
                    id: 111,
                    employeeNumber: 1111,
                    employeeName: "Maxime Marchand",
                    showName: "1 Janvier 2024 - 7 Janvier 2024 (En attente)",
                    startDate: "2024-01-01",
                    endDate: "2024-01-07",
                    status: "En attente",
                    category: "Vacance",
                    reason: null
                },
                {
                    id: 443,
                    employeeNumber: 2222,
                    employeeName: "David Beaudry",
                    showName: "14 fevrier 2024 (Refuser)",
                    startDate: "2024-02-14",
                    endDate: "2024-02-14",
                    status: "Refusé",
                    category: "Personnel",
                    reason: "St-Valentin"
                },
                {
                    id: 443,
                    employeeNumber: 3333,
                    employeeName: "Francis Maynard",
                    showName: "14 fevrier 2024 (Refuser)",
                    startDate: "2024-02-14",
                    endDate: "2024-02-14",
                    status: "Refusé",
                    category: "Personnel",
                    reason: "St-Valentin"
                },
                {
                    id: 443,
                    employeeNumber: 1111,
                    employeeName: "Maxime Marchand",
                    showName: "14 fevrier 2024 (Refuser)",
                    startDate: "2024-02-14",
                    endDate: "2024-02-14",
                    status: "Refusé",
                    category: "Personnel",
                    reason: "St-Valentin"
                }
            ];
            this.leaveList = [];
            allLeaves.forEach(leave =>
            {
                if (leave.employeeName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0)
                {
                    console.log("YES");
                    if (this.roleShowed == "Tous")
                    {
                        this.leaveList.push(leave);
                    } else { }
                    //faire une fonction qui permet de seulement ajouter les employee que son attribut role == this.roleShowsed au emplouyeeList
                }
            });
        },
        editItem(item)
        {
            this.editedIndex = this.leaveList.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        accept(item)
        {
            console.log("Accept", item)
        },
        refuse(item)
        {
            console.log("Refuse", item)
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
    computed : {
        calculatePendingLeaves() {
            return 3
        }
    },
    mounted()
    {
        this.date = "2023-09-05";
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