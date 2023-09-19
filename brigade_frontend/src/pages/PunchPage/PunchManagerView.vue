<template>
    <v-sheet v-if="(userSession.employee && userSession.employee.isActive) && (userSession.employee.isAdmin || userSession.employee.isSuperAdmin)">
        <PunchList v-if="(userSession.employee && userSession.employee.isActive) && (userSession.employee.isAdmin || userSession.employee.isSuperAdmin)"></PunchList>
    </v-sheet>
</template>

<script>

import userSession from "../../sessions/UserSession"
import PunchList from './PunchList.vue'

export default {
    components: {
        PunchList,
    },
    data() {
        return {
            userSession: userSession
        }
    },
    mounted() {
        if (!userSession) {
            this.$router.push('/espace/dashboard');
        }
    }
}
</script>