<template>
    <v-sheet class="h-15">
        <v-card class="mx-10 h-75">
            <v-row class="mb-0">
                <v-text-field @input="" v-model="search" hide-details placeholder="Search name..."
                    class="ma-2"></v-text-field>
                <v-dialog v-model="dialogNewClient" width="100%">
                    <template v-slot:activator="{ props }">
                        <div class="ma-2 text-center">
                            <BlackButton class="h-100 w-100" textbutton="+" v-bind="props"></BlackButton>
                        </div>
                    </template>
                    <v-card>
                        <v-card-title>
                            Creer un nouveau client
                        </v-card-title>
                        <NewClientForm></NewClientForm>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-list fill-height v-model:selected='selected' :items="filteredClientList" item-title="listInformation"
                item-value="id">
            </v-list>
        </v-card>

    </v-sheet>
</template>



<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import NewClientForm from "../clientpage/NewClientForm.vue"
import BlackButton from '../../components/Reusable/BlackButton.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { getClientList } from '../../services/ClientService';

export default {
    inject: ['loadClientId'],
    components: {
        VDataTable,
        NewClientForm,
        BlackButton,
        DarkRedButton
    },
    data() {
        return {
            selected: [],
            search: '',
            clients: [],
            filteredClientList: [],
            dialogNewClient: false,
        };
    },
    provide() {
        return {
            closeNewClientDialog: this.closeNewClientDialog,
            loadClients: this.loadClients
        };
    },
    methods: {
        loadClients(clientAdded) {
            this.clients = [];

            getClientList()
                .then((clientList) => {
                    this.clients = clientList;
                })
                .catch((err) => {
                    console.log(err);
                    alert(err.message);
                });

            if (clientAdded) this.selected = clientAdded, this.search = clientAdded[1];
        },
        filterClients() {
            this.filteredClientList = [];

            this.clients.forEach(client => {
                if (client.first_name.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                    || client.last_name.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                    || client.phone_number.indexOf(this.search) >= 0) {

                    const clientToKeep = {
                        "listInformation":
                            client.first_name + " " + client.last_name + " (" + client.phone_number + ") - Favorite ? " + client.is_favorite + " Blacklisted ? " + client.is_blacklisted + " Allergie(s) : " + client.allergy,
                        ...client,
                        props: {
                            color: 'red',
                        },
                    }

                    this.filteredClientList.push(clientToKeep);
                }


            });
        },
        closeNewClientDialog() {
            this.dialogNewClient = false;
        },
    },
    watch: {
        selected() {
            this.loadClientId(this.selected[0]);
        },
        clients() {
            this.filterClients();
        },
        search() {
            this.filterClients();
        },
    },
    mounted() {
        this.loadClients();
    },
}
</script>

<style scoped>
.v-btn { 
    font-size: xx-large;
}

.v-list {
    height:600px;
    overflow-y:auto;
}
</style>