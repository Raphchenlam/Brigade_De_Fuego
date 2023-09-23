<template>
    <v-sheet v-if="userSession">
        <PunchList v-if="this.isUserAuthorized()"></PunchList>
    </v-sheet>
</template>

<script>

import userSession from "../../sessions/UserSession"
import PunchList from './PunchList.vue'

export default {
    inject:['isUserAuthorized'],
    components: {
        PunchList,
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