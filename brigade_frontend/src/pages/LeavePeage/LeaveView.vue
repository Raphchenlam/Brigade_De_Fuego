<template>
    <v-sheet v-if="userSession.employee">
        <v-row>
            <LeaveList v-if="userSession.employee.isAdmin || userSession.employee.isSuperAdmin"></LeaveList>
        </v-row>
    </v-sheet>
    <v-sheet v-else>
        <v-row class="m-10 justify-center">
            <h1>Vous devez être connecté et avoir les droits administrateurs pour avoir accès à cette page</h1>
        </v-row>
    </v-sheet>
</template>

<script>

import LeaveList from './LeaveList.vue';

export default {
    components: {
        LeaveList
    }
}



</script>