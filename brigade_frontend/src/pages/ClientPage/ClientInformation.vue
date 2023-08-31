<template>
    <v-sheet width="40%">
        <v-card height="420px" class="pa-5 ma-2">
            <p>Numero client : 2</p>
            <v-divider></v-divider>
            <p>Nom client : Bob Gratton</p>
            <p>Numero telephone : 555-555-5555</p>
            <p>Client favoris ? Oui</p>
            <p>Blacklist ? Non</p>
        </v-card>
        <v-dialog v-model="dialogEditClient" width="100%">
            <template v-slot:activator="{ props }">
                <v-row class="justify-center">
                    <v-btn class="ma-5" color="black" v-bind="props">Editer un client (TEST)</v-btn>
                    <v-btn class="ma-5" color="black">Blacklister le client</v-btn>
                </v-row>
            </template>
            <v-card>
                <v-card-title>
                    Editer les informations du client
                </v-card-title>
                <EditClientForm :clientId="2"></EditClientForm>
            </v-card>
        </v-dialog>

    </v-sheet>
</template>

<script>
import EditClientForm from './EditClientForm.vue'

export default {
    components: {
        EditClientForm
    },
    data()
    {
        return {
            dialogEditClient: false,
        };
    },
    methods: {
        closeEditClientDialog()
        {
            this.dialogEditClient = false;
        }
    },
    provide()
    {
        return {
            closeEditClientDialog: this.closeEditClientDialog
        };
    },
}

</script>