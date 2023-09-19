<template>
    <v-sheet v-if="(userSession.employee && userSession.employee.isActive) && (userSession.employee.isAdmin || userSession.employee.isSuperAdmin)">
        <v-row>
            <LeaveList v-if="(userSession.employee && userSession.employee.isActive) && (userSession.employee.isAdmin || userSession.employee.isSuperAdmin)"></LeaveList>
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
    components: {
        LeaveList
    },
    data() {
        return{
            userSession: userSession
        }
    },
    mounted() {
        if(!userSession.employee){
            this.$router.push('/espace');
        }
    }
}



</script>