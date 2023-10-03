<template>
    <v-sheet
        v-if="userSession">
        <v-row v-if="this.isUserAuthorized()">
            <LeaveList></LeaveList>
        </v-row>
    </v-sheet>
    <v-sheet v-else>
        <v-row class="m-10 justify-center">
            <h1>Vous devez être connecté et avoir les droits administrateurs pour avoir accès à cette page</h1>
        </v-row>
    </v-sheet>
</template>

<script>

import userSession from "../../sessions/UserSession"
import LeaveList from './LeaveList.vue';

export default {
    inject:['isUserAuthorized'],
    components: {
        LeaveList
    },
    data() {
        return {
            userSession: userSession
        }
    },
    created() {
        if (!userSession.employeeNumber && !userSession.password) {
            this.$router.push('/espace');
        }
    },
}



</script>