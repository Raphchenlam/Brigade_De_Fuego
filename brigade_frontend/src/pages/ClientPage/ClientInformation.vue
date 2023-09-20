<template>
    <v-sheet v-if="clientId">
        <v-card class="mr-10 ml-5 h-75">
            <v-dialog v-model="dialogEditClient" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-space-between">
                        <div>
                            <h1 class="mt-5 ml-10">{{ client.firstName + " " + client.lastName }}</h1>
                        </div>
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
            <p>Numero de client : <strong>{{ client.id }}</strong></p>
            <p>Prénom : <strong>{{ client.firstName }}</strong></p>
            <p>Nom de famille : <strong>{{ client.lastName }}</strong></p>
            <p>Numero telephone : <strong>{{ client.phoneNumber }}</strong></p>
            <p :class="{ favorite: client.isFavorite }">Client favoris ? <strong>{{ client.isFavorite ? "Oui" : "Non" }}</strong></p>
            <p :class="{ blacklisted: client.isBlacklisted }">Blacklist ? <strong>{{ client.isBlacklisted ? "Oui" : "Non" }}</strong> </p>
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
        EditBlackButton
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
                        console.log(err);
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
</style>