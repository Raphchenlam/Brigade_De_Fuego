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
    mounted() {
        if (!userSession) {
            this.$router.push('/espace/dashboard');
        }
    }
}
</script>