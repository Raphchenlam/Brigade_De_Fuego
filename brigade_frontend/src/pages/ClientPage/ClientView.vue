<template>
    <v-row class="justify-center">
        <ClientList></ClientList>
        <ClientInformation></ClientInformation>
    </v-row>
</template>


<script>
import operationSession from "../../sessions/OperationSession"

import ClientList from "./ClientList.vue";
import ClientInformation from './ClientInformation.vue'

export default {
    components: {
        ClientList,
        ClientInformation
    },
    data()
    {
        return {
            operationSession: operationSession,
        }
    },
    methods: {

    },
    mounted()
    {
        if (!operationSession.isActive)
        {
            this.$router.push('/operation');
        }
    }
}
</script>