<template>
    <v-sheet v-if="event.name" class="px-10">
        <v-dialog v-model="dialogEditEvent" width="50%">
            <template v-slot:activator="{ props }">
                <v-row class="justify-space-between">
                    <div>
                        <h1 class="my-5 ml-10">{{ event.name }}</h1>
                    </div>
                    <EditBlackButton class="ma-2" v-bind="props"> </EditBlackButton>
                </v-row>
            </template>
            <v-card>
                <v-card-title>
                    Modfier un événement
                </v-card-title>
                <EditEventForm :event="event"></EditEventForm>
            </v-card>
        </v-dialog>
        <v-divider :thickness="2" class="border-opacity-50"></v-divider>
        <v-sheet class="ma-5">
            <h3> Type : {{ event.eventType }} </h3>
            <h3> Achalandage : {{ event.impact }}% </h3>
            <h2>
                <span v-if="event.isActive" style='color:rgb(3, 211, 3)'>
                    ACTIF
                </span>
                <span v-else style='color:red'>
                    NON ACTIF
                </span>
            </h2>
        </v-sheet>
    </v-sheet>
</template>

<script>
import { fetchEventByName } from '../../services/EventService';
import EditBlackButton from '../../components/Reusable/EditBlackButton.vue';
import EditEventForm from './EditEventForm.vue';

export default {
    inject: ['eventToDisplay', 'needUpdateEvent', 'toggleUpdateEvent'],

    components: {
        EditEventForm,
        EditBlackButton
    },
    data() {
        return {
            dialogEditEvent: false,
            event: {
                name: null,
                impact: null,
                eventType: null,
                isActive: null
            }
        }
    },
    provide() {
        return {
            closeEditEventDialog: this.closeEditEventDialog,
            loadEventInformation: this.loadEventInformation
        };
    },
    methods: {
        toggleEditEventDialog() {
            this.dialogEditEvent = !this.dialogEditEvent;
        },
        closeEditEventDialog() {
            this.toggleEditEventDialog();
            if (this.needUpdateEvent) {
                this.toggleUpdateEvent();
            }
        },
        loadEventInformation() {
            if (this.eventToDisplay) {
                fetchEventByName(this.eventToDisplay).then(event => {
                    this.event.name = event.name,
                        this.event.eventType = event.eventType,
                        this.event.impact = event.impact,
                        this.event.isActive = event.isActive
                }).catch(err => {
                    console.error(err);
                })
            } else {
                this.event = {};
            }
        },
    },
    watch: {
        eventToDisplay() {
            this.loadEventInformation(this.eventToDisplay);
        },
        needUpdateEvent() {
            if (this.needUpdateEvent) {
                setTimeout(this.toggleEditEventDialog, 500);
            }
        }
    },
    mounted() {
        if (this.eventToDisplay) {
            this.loadEventInformation(this.eventToDisplay);
        }
    }
}

</script>