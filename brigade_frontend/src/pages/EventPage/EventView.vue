<template>
    <v-row class="justify-space-between">
        <EventList class="h-screen" width="35%"></EventList>
        <EventInformation v-if="selectedEvent" class="h-screen" width="65%"></EventInformation>
    </v-row>
</template>

<script>
import { computed } from "vue";
import userSession from "../../sessions/UserSession"
import EventInformation from "./EventInformation.vue";
import EventList from './EventList.vue';

export default {
    components: {
        userSession,
        EventList,
        EventInformation
    },
    data() {
        return {
            userSession: userSession,
            selectedEvent: null,
            updateEvent: false
        }
    },
    methods: {
        loadEvent(selectedEvent) {
            this.selectedEvent = selectedEvent;
        },
        toggleUpdateEvent() {
            this.updateEvent = !this.updateEvent;
        }
    },
    provide() {
        return {
            loadEvent: this.loadEvent,
            toggleUpdateEvent: this.toggleUpdateEvent,
            eventToDisplay: computed(() => this.selectedEvent),
            needUpdateEvent: computed(() => this.updateEvent)

        };
    },
    mounted() {
        if (!userSession.user) {
            this.$router.push('/espace');
        }
    },
}
</script>