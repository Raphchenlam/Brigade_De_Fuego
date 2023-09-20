<template>
    <v-row class="justify-space-between">
        <ClientList class="h-screen w-50"></ClientList>
        <ClientInformation class="h-screen w-50" v-if="selectedClientId" :clientId="selectedClientId"></ClientInformation>
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
    data() {
        return {
            operationSession: operationSession,
            selectedClientId: null
        }
    },
    methods: {
        loadClientId(clientId) {
            this.selectedClientId = clientId;
        },
    },
    provide() {
        return {
            loadClientId: this.loadClientId
        };
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
    }
}
</script>