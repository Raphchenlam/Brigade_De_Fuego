<template>
    <v-row class="justify-space-between">
        <EventList class="h-screen" width="35%"></EventList>
        <EventInformation class="h-screen" width="65%"></EventInformation>
    </v-row>
</template>

<script>
import userSession from "../../sessions/UserSession"
import EventInformation from "./EventInformation.vue";
import EventList from './EventList.vue';

export default {
    components: {
    userSession,
    EventList,
    EventInformation
},
    data()
    {
        return {
            userSession: userSession,
            selectedEvent: null,
        }
    },
    methods: {
        loadEvent(event)
        {
            this.selectedEvent = event
        }
    },
    provide()
    {
        return {
            loadEvent: this.loadEvent
        };
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