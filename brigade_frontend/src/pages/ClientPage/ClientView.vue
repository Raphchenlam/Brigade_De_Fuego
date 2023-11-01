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
import { computed } from "vue";

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
            refresh: false
        }
    },
    methods: {
        loadClientInformations(clientInformations) {
            if (clientInformations) {
                this.selectedClientId = clientInformations[0];
                this.selectedClientIsBlacklisted = clientInformations[1];
            } else {
                this.selectedClientId = this.selectedClientIsBlacklisted = null;
            }

        },
        refreshClientList() {
            this.refresh = true;
            setTimeout(() => this.refresh = false, 2000);
        },
    },
    provide() {
        return {
            loadClientInformations: this.loadClientInformations,
            refreshClientList: this.refreshClientList,
            refresh: computed(() => this.refresh),
        };
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
    }
}
</script>