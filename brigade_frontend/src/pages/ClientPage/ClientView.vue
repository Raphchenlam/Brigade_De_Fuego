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
            selectedClientId: null,
            selectedClientIsBlacklisted: null,
        }
    },
    methods: {
        loadClientInformations(clientInformations) {
            if(clientInformations){
                this.selectedClientId = clientInformations[0];
                this.selectedClientIsBlacklisted = clientInformations[1];
            }else{
                this.selectedClientId = this.selectedClientIsBlacklisted = null;
            }

        },
    },
    provide() {
        return {
            loadClientInformations: this.loadClientInformations
        };
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
    }
}
</script>