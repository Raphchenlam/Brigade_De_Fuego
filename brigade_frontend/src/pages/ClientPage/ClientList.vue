<template>
    <v-sheet width="50%" height="auto" class="ma-2">
    <v-data-table-server height="300px" fixed-header v-model="selected" :headers="headers" :items="clients"
    :items-length="clients.length"
    select-strategy="single" class="elevation-1" @update:options="loadClients" show-select 
    >
        <template v-slot:top>
                    <v-text-field @input="loadClients" v-model="search" hide-details placeholder="Search name..." class="ma-2"></v-text-field>
        </template>
    </v-data-table-server>
    <v-dialog  v-model="dialogNewClient" width="100%">
        <template v-slot:activator="{ props }">
            <div class="ma-2 text-center">
                <v-btn block color="black" v-bind="props">Creer un nouveau client (TEST)</v-btn>
            </div>
        </template>
        <v-card>
            <v-card-title>
                Creer un nouveau client
            </v-card-title>
        <NewClientForm></NewClientForm>
        </v-card>
    </v-dialog>
</v-sheet>
</template>


<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import NewClientForm from "../clientpage/NewClientForm.vue"

export default {
    components: {
        VDataTable,
        NewClientForm
    },
    data()
    {
        return {
            selected: [],
            search: '',
            clients: [],
            headers: [
                {
                    align: 'start',
                    key: 'phoneNumber',
                    sortable: false,
                    title: 'Numero de telephone',
                },
                {
                    key: 'firstName',
                    sortable: true,
                    title: 'Prenom',
                },
                {
                    key: 'lastName',
                    sortable: true,
                    title: 'Nom de famille',
                },
            ],
            dialogNewClient: false,
        };
    },
    provide()
    {
        return {
            closeNewClientDialog: this.closeNewClientDialog,
        };
    },
    methods: {
        loadClients()
        {
            const allClients = [
                {
                    id: 1,
                    firstName: "Alice",
                    lastName: "dupays",
                    phoneNumber: "111-111-1111",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false
                },
                {
                    id: 2,
                    firstName: "Bob",
                    lastName: "Gratton",
                    phoneNumber: "555-555-555",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false
                },  {
                    id: 3,
                    firstName: "Maxime",
                    lastName: "Marchand",
                    phoneNumber: "888-111-1111",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false
                },
                {
                    id: 4,
                    firstName: "Francis",
                    lastName: "Maynard",
                    phoneNumber: "999-555-5555",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false
                },  {
                    id: 5,
                    firstName: "Raphael",
                    lastName: "Chenard Lamothe",
                    phoneNumber: "888-888-8888",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false
                },
                {
                    id: 6,
                    firstName: "David",
                    lastName: "Beaudry",
                    phoneNumber: "000-111-5555",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false
                },  {
                    id: 7,
                    firstName: "Maxime",
                    lastName: "Roy",
                    phoneNumber: "555-444-1111",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false
                },
                {
                    id: 8,
                    firstName: "Gab",
                    lastName: "D'amours",
                    phoneNumber: "666-666-6666",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false
                },
            ]
            this.clients= [];
            allClients.forEach(client => {
                if (client.firstName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0 
                || client.lastName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                || client.phoneNumber.indexOf(this.search) >= 0) {
                    console.log(client);
                    this.clients.push(client);
                }
            });
        },
        closeNewClientDialog()
        {
            this.dialogNewClient = false;
        },
    },
    mounted()
    {
       
    },
}
</script>