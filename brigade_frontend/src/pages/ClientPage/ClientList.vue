<template>
    <v-sheet width="50%" height="auto" class="ma-2">
        <v-card class="mx-auto" max-height="400" max-width="800">
            <v-list v-model:selected='selected' :items="clients" item-title="listInformation" item-value="id">
            </v-list>
        </v-card>
        <v-dialog v-model="dialogNewClient" width="100%">
            <template v-slot:activator="{ props }">
                <div class="ma-2 text-center">
                    <BlackButton block textbutton="Creer un nouveau client " v-bind="props"></BlackButton>
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
import BlackButton from '../../components/Reusable/BlackButton.vue';

export default {
    components: {
        VDataTable,
        NewClientForm,
        BlackButton
    },
    data()
    {
        return {
            selected: [],
            search: '',
            clients: [],
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
                    listInformation: "Alice Dupays (111-111-1111)",
                    id: 1,
                    firstName: "Alice",
                    lastName: "dupays",
                    phoneNumber: "111-111-1111",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Bob Gratton (555-555-5555)",
                    id: 2,
                    firstName: "Bob",
                    lastName: "Gratton",
                    phoneNumber: "555-555-5555",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Maxime Marchand (888-111-1111)",
                    id: 3,
                    firstName: "Maxime",
                    lastName: "Marchand",
                    phoneNumber: "888-111-1111",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Francis Maynard (999-555-5555)",
                    id: 4,
                    firstName: "Francis",
                    lastName: "Maynard",
                    phoneNumber: "999-555-5555",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                }, 
                {
                    listInformation: "Raphael Chenard Lamothe (888-888-8888)",
                    id: 5,
                    firstName: "Raphael",
                    lastName: "Chenard Lamothe",
                    phoneNumber: "888-888-8888",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Alice Dupays (555-555-5555)",
                    id: 6,
                    firstName: "David",
                    lastName: "Beaudry",
                    phoneNumber: "000-111-5555",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                }, {
                    listInformation: "Maxime Roy (555-444-1111)",
                    id: 7,
                    firstName: "Maxime",
                    lastName: "Roy",
                    phoneNumber: "555-444-1111",
                    allergy: null,
                    isFavorite: false,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Gab D'amours (666-666-6666)",
                    id: 8,
                    firstName: "Gab",
                    lastName: "D'amours",
                    phoneNumber: "666-666-6666",
                    allergy: "Gluten",
                    isFavorite: true,
                    isBlacklisted: false,
                    props: {
                        color: 'red',
                    },
                },
            ]
            this.clients = [];
            allClients.forEach(client =>
            {
                if (client.firstName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                    || client.lastName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                    || client.phoneNumber.indexOf(this.search) >= 0)
                {
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
        this.loadClients();
    },
}
</script>