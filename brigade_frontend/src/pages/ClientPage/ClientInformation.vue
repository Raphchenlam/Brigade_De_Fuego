<template>
    <v-sheet>
        <v-card class="mr-10 ml-5 h-75">
            <v-dialog v-model="dialogEditClient" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-space-between">
                        <div>
                            <h1 class="mt-5 ml-10">Bob Gratton</h1>
                        </div>
                        <EditBlackButton class="ma-2" v-bind="props"></EditBlackButton>
                    </v-row>
                    <v-divider></v-divider>
                </template>
                <v-card>
                    <v-card-title>
                        Editer les informations du client
                    </v-card-title>
                    <EditClientForm :clientId="2"></EditClientForm>
                </v-card>
            </v-dialog>
            <p>Numero client : 2</p>
            <p>Numero telephone : 555-555-5555</p>
            <p>Client favoris ? Oui</p>
            <p>Blacklist ? Non</p>
        </v-card>
    </v-sheet>
</template>

<script>
import BlackButton from '../../components/Reusable/BlackButton.vue';
import EditBlackButton from '../../components/Reusable/EditBlackButton.vue';
import EditClientForm from './EditClientForm.vue'

export default {
    components: {
        EditClientForm,
        BlackButton,
        EditBlackButton
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