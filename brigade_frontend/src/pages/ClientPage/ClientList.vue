<template>
    <v-sheet class="h-15">
        <v-card class="mx-10 h-75">
            <v-row class="mb-0">
                <v-text-field @input="" v-model="search" hide-details placeholder="Rechercher un client..." class="ma-2"
                    clearable @click:clear="clearSearchInput"></v-text-field>
                <v-dialog v-model="dialogNewClient" width="100%">
                    <template v-slot:activator="{ props }">
                        <div class="ma-2 text-center">
                            <BlackButton class="h-100 w-100" textbutton="+" v-bind="props"></BlackButton>
                        </div>
                    </template>
                    <v-card>
                        <v-card-title>
                            Créer un nouveau client
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
    inject: ['loadClientInformations', 'refresh'],
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
        clearSearchInput() {
            this.search = "";
        },
        loadClients(clientAdded) {
            this.clients = [];

            getClientList()
                .then((clientList) => {
                    this.clients = clientList;
                    if (clientAdded) this.selected = clientAdded, this.search = clientAdded[1];
                })
                .catch((err) => {
                    console.error(err);
                    alert(err.message);
                });
        },
        filterClients() {
            this.filteredClientList = [];

            this.clients.forEach(client => {
                const isClientFavorite = client.is_favorite ? " - FAVORIS" : "";
                const isClientBlacklisted = client.is_blacklisted ? " - BLACKLISTED !" : "";
                const isClientAllergic = client.allergy ? " - Allergie(s) " : "";

                const clientToKeep = {
                    "listInformation":
                        client.first_name + " " + client.last_name + " (" + client.phone_number + ")" + isClientFavorite + isClientBlacklisted + isClientAllergic,
                    ...client,
                    props: {
                        color: 'red',
                    },
                }

                if (clientToKeep.listInformation.toUpperCase().indexOf(this.search.toUpperCase()) >= 0) {
                    this.filteredClientList.push(clientToKeep);
                }
            });
        },
        closeNewClientDialog() {
            this.dialogNewClient = false;
        },
    },
    watch: {
        'selected': {
            handler: function () {
                if (this.selected.length !== 0) {
                    const clientInfos = this.clients.find(client => client.id == this.selected[0]);
                    this.loadClientInformations([this.selected[0], clientInfos.is_blacklisted, clientInfos.first_name]);
                } else if (this.selected.length === 0) {
                    this.loadClientInformations([]);

                }
            },
            deep: true
        },
        clients() {
            this.filterClients();
        },
        search() {
            this.filterClients();
        },
        refresh(){
            this.loadClients();
        }
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
    height: 600px;
    overflow-y: auto;
}
</style>