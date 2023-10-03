<template>
    <v-sheet
        v-if="userSession">
        <v-row v-if="this.isUserAuthorized() || userSession.employeeNumber == employeeNumber">
            <LeaveList :employee-number="employeeNumber"></LeaveList>
        </v-row>
    </v-sheet>
    <v-sheet v-else>
        <v-row class="m-10 justify-center">
            <h1>Vous devez être connecté ou avoir les droits administrateurs pour avoir accès à cette page</h1>
        </v-row>
    </v-sheet>
</template>

<script>

import userSession from "../../sessions/UserSession"
import LeaveList from './LeaveList.vue';

export default {
    props: {
        employeeNumber : Number
    },
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