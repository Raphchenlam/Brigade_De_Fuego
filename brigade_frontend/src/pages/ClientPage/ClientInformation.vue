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
                    <BlackButton class="ma-5" v-bind="props" textbutton="Editer un client"></BlackButton>
                    <BlackButton class="ma-5" textbutton="Blacklister le client"></BlackButton>
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
import BlackButton from '../../components/Reusable/BlackButton.vue';
import EditClientForm from './EditClientForm.vue'

export default {
    components: {
        EditClientForm,
        BlackButton
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