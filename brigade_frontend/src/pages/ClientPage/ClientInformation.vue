<template>
    <v-sheet v-if="clientId">
        <v-card class="mr-10 ml-5 h-75">
            <v-dialog v-model="dialogEditClient" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-space-between">
                        <v-col cols="8">
                            <h1 class="mt-5 ml-10">{{ shortenedFullName }}</h1>
                        </v-col>
                        <v-col>
                            <h1 class="mt-5 ml-10"> #: <strong>{{ client.id }}</strong></h1>
                        </v-col>
                        <EditBlackButton class="ma-2" v-bind="props"></EditBlackButton>
                    </v-row>
                    <v-divider class="ma-5"></v-divider>
                </template>
                <v-card>
                    <v-card-title>
                        Editer les informations du client
                    </v-card-title>
                    <EditClientForm :clientId="client.id"></EditClientForm>
                </v-card>
            </v-dialog>
            <v-row>
                <v-col cols="5" class="ma-5 justify-space-between">
                    <p class="ma-5 pb-5">Numero de client : <strong>{{ client.id }}</strong></p>
                    <p class="ma-5 pb-5">Prénom : <strong>{{ client.firstName }}</strong></p>
                    <p class="ma-5 pb-5">Nom de famille : <strong>{{ client.lastName }}</strong></p>
                    <p class="ma-5 pb-5" :class="{ warning: client.allergy }">Allergie(s) : <strong>{{ client.allergy || "Aucune"}}</strong></p>
                </v-col>
                <v-col class="ma-5 pb-5">
                    <p class="ma-5 pb-5">Numero telephone : <strong>{{ client.phoneNumber }}</strong></p>
                    <p class="ma-5 pb-5" :class="{ favorite: client.isFavorite }">Client favoris ?
                        <strong>{{ client.isFavorite ? "Oui" : "Non" }}</strong>
                    </p>
                    <p class="ma-5 pb-5" :class="{ blacklisted: client.isBlacklisted }">Blacklist ?
                        <strong>{{ client.isBlacklisted ? "Oui" : "Non" }}</strong>
                    </p>
                </v-col>
            </v-row>
        </v-card>
    </v-sheet>
</template>

<script>
import BlackButton from '../../components/Reusable/BlackButton.vue';
import EditBlackButton from '../../components/Reusable/EditBlackButton.vue';
import EditClientForm from './EditClientForm.vue';
import { getClientById } from '../../services/ClientService';

export default {
    props: {
        clientId: Number
    },
    components: {
        EditClientForm,
        BlackButton,
        EditBlackButton,
        clientsFullName: null
    },
    data() {
        return {
            client: {},
            dialogEditClient: false,
        };
    },
    methods: {
        loadClientById(clientId) {
            if (clientId) {
                getClientById(clientId)
                    .then(client => {
                        this.client = client;
                    })
                    .catch((err) => {
                        console.error(err);
                        alert(err.message);
                    });
            } else {
                this.client = {};
            }
        },
        closeEditClientDialog() {
            this.dialogEditClient = false;
        }
    },
    watch: {
        clientId() {
            this.loadClientById(this.clientId);
        }
    },
    computed: {
        shortenedFullName() {
            if (this.client.firstName && this.client.lastName) {
                const maxLength = 11;
                return (this.client.firstName.length > maxLength ? this.client.firstName.slice(0, maxLength) + "..." : this.client.firstName)
                    + " "
                    + (this.client.lastName.length > maxLength ? this.client.lastName.slice(0, maxLength) + "..." : this.client.lastName);
            }
        }
    },
    provide() {
        return {
            closeEditClientDialog: this.closeEditClientDialog
        };
    },
    mounted() {
        if (this.clientId) {
            this.loadClientById(this.clientId);
        }
    }

}

</script>

<style>
.favorite {
    color: green;
    font-size: 1.5em;
}

.blacklisted {
    color: red;
    font-size: 1.5em;
}


.warning {
    color: red;
    font-size: 1.5em;
}
</style>