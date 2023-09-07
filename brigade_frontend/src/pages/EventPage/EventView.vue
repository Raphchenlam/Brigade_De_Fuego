<template>
    <EventList></EventList>
</template>

<script>
import userSession from "../../sessions/UserSession"

import EventList from './EventList.vue';

export default {
    components: {
        userSession,
        EventList
    },
    data()
    {
        return {
            userSession: userSession,
        }
    },
    methods: {

    },
    mounted()
    {
        if (!userSession.user)
        {
            this.$router.push('/espace');
        }
    },
}
</script>