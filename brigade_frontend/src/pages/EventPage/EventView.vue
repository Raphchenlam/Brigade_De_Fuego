<template>
    <v-sheet v-if="userSession.employee.isAdmin || userSession.employee.isSuperAdmin">
        <v-row class="justify-space-between">
            <EventList class="h-screen" width="35%"></EventList>
            <EventInformation v-if="selectedEvent" class="h-screen" width="65%"></EventInformation>
        </v-row>
    </v-sheet>
    <v-sheet v-else>
        <v-row class="m-10 justify-center">
            <h1>Vous devez être connecté et avoir les droits administrateurs pour avoir accès à cette page</h1>
        </v-row>
    </v-sheet>
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
            updateEvent: false,
            updateEventList: false
        }
    },
    methods: {
        loadEvent(selectedEvent) {
            this.selectedEvent = selectedEvent;
        },
        toggleUpdateEvent() {
            this.updateEvent = !this.updateEvent;
        },
        toggleUpdateEventList() {
            this.updateEventList = !this.updateEventList;
        }

    },
    provide() {
        return {
            loadEvent: this.loadEvent,
            toggleUpdateEvent: this.toggleUpdateEvent,
            eventToDisplay: computed(() => this.selectedEvent),
            needUpdateEvent: computed(() => this.updateEvent),
            needUpdateEventList: computed(() => this.updateEventList),
            toggleUpdateEventList: this.toggleUpdateEventList
        };
    },
    mounted() {
        if (!userSession.user) {
            this.$router.push('/espace');
        }
    },
}
</script>