<template>
       <v-row class="justify-space-around">
<ClientList></ClientList>
<ClientInformation></ClientInformation>
</v-row>
</template>


<script>
import operationSession from "../../sessions/OperationSession"

import OperationMenu from '../../components/OperationMenu.vue';
import NewClientForm from "../clientpage/NewClientForm.vue"
import EditClientForm from "./EditClientForm.vue";
import ClientList from "./ClientList.vue";
import ClientInformation from './ClientInformation.vue'

export default {
    components: {
    OperationMenu,
    NewClientForm,
    EditClientForm,
    ClientList,
    ClientInformation
},
    data()
    {
        return {
            operationSession: operationSession,
            dialogNewClient: false,
            dialogEditClient: false
        }
    },
    methods: {
        closeNewClientDialog()
        {
            this.dialogNewClient = false;
        },
        closeEditClientDialog()
        {
            this.dialogEditClient = false;
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
            closeNewClientDialog: this.closeNewClientDialog,
            closeEditClientDialog : this.closeEditClientDialog
        };
    },
}
</script>