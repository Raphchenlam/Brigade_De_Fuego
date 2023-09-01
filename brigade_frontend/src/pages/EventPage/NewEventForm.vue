<template>
    <div class="ma-2" width="auto">
        <v-form @submit.prevent="submitNewEvent" class="pa-10" validate-on="submit lazy" ref="createEventForm">
            <v-row>
                <v-text-field class="ma-2" v-model="event.name" label="Nom de l'événement" clearable>
                </v-text-field>
            </v-row>
            <v-row>
                <v-select class="ma-2" v-model="event.eventType" label="Type d'événement" :items="eventTypes.name"></v-select>
                <v-text-field type="number" step="0.1" class="ma-2" v-model="event.impact" label="Impact sur l'achalandage" clearable>
                </v-text-field>
            </v-row>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Creer"></DarkRedButton>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/darkredbutton.vue';
import { createEvent, fetchAllEventType } from '../../services/EventService';


export default {
    inject: ['closeNewEventDialog'],
    components: {
        DarkRedButton,
    },
    data() {
        return {
            event: {
                name: null,
                impact: null,
                eventType: null,
            },
            eventTypes: [{
                name:null
            }],
        }
    },
    methods: {
        closeDialog() {
            this.closeNewEventDialog();
        },
        // loadEventType() {
        //     fetchAllEventType().then(eventTypes => {
        //         this.eventTypes = eventTypes;
        //     }).catch(err => {
        //         this.eventTypes = "BOOM!!!";
        //         console.log(err);
        //     })
        // }

    },
    mounted() {
        this.eventTypes = fetchAllEventType();
    }
}
</script>

<style scoped>
.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 80%;
    max-width: 80rem;
}
</style>