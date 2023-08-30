<template>
    Client

    <v-dialog v-model="dialogNewClient" width="100%">
        <template v-slot:activator="{ props }">
            <div class="text-center">
                <v-btn color="black" v-bind="props">Creer un nouveau client (TEST)</v-btn>
            </div>
        </template>
        <v-card>
            <v-card-title>
                Creer un nouveau client
            </v-card-title>
        <NewClientForm></NewClientForm>
        </v-card>
    </v-dialog>
</template>


<script>
import operationSession from "../../sessions/OperationSession"

import OperationMenu from '../../components/OperationMenu.vue';
import NewClientForm from "../clientpage/NewClientForm.vue"

export default {
    components: {
        OperationMenu,
        NewClientForm
    },
    data()
    {
        return {
            operationSession: operationSession,
            dialogNewClient: false
        }
    },
    methods: {
        closeNewClientDialog()
        {
            this.dialogNewClient = false;
        }
    },
    mounted()
    {
        if (!operationSession.isActive)
        {
            this.$router.push('/operation');
        }
    },
    provide()
    {
        return {
            closeNewClientDialog: this.closeNewClientDialog
        };
    },
}
</script>