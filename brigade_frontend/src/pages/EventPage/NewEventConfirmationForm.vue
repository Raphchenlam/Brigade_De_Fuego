<template>
    <v-sheet v-if="uniqueEvent">
    <v-sheet class="ma-3 pa-5">
        <v-card class="pa-5">
            <v-row>
                <v-card-title>
                    <strong>Confirmer cet événement : </strong>
                </v-card-title>
            </v-row>
            <v-row>
                <v-col>Nom de l'événement : </v-col>
                <v-col><strong>{{ name }}</strong></v-col>
            </v-row>
            <v-row>
                <v-col>Type d'événement : </v-col>
                <v-col><strong>{{ eventType }}</strong></v-col>
            </v-row>
            <v-row>
                <v-col>L'impact sur l'achalandage : </v-col>
                <v-col><strong>{{ impact }}</strong></v-col>
            </v-row>
        </v-card>
    </v-sheet>
    <v-sheet class="ma-3 pa-5">
        <v-row class="justify-center">
            <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeEventConfirmationDialog()">
            </DarkRedButton>
            <DarkRedButton class="mx-5" textbutton="Confirmer" @click="submitNewEvent">
            </DarkRedButton>
        </v-row>
    </v-sheet>
</v-sheet>
<v-sheet v-else>
<p>A faire :)</p>

</v-sheet>
</template>

<script>
import { createEvent, fetchEventByName } from '../../services/EventService';

import DarkRedButton from '../../components/Reusable/darkredbutton.vue';

export default {
    inject: ['toggleEventConfirmationDialog', 'closeNewEventDialog', 'updateEventList'],
    components: { DarkRedButton },
    props: {
        name: String,
        eventType: String,
        impact: Number
    },

    data() {
        return {
            uniqueEvent: true,
        }
    },

    methods: {
       
        closeEventConfirmationDialog() {
            this.toggleEventConfirmationDialog();
        },
        async submitNewEvent() {
            const event = {
                name: this.name,
                impact: this.impact,
                eventType: this.eventType,
                isActive: true
            };
            try {
                //await fetchEventByName(event.name)
                await createEvent(event);
                this.closeNewEventDialog();
                this.closeEventConfirmationDialog();
                this.updateEventList();
            } catch (err) {
                alert(err.message);
            }
        },
        verifyUniqueEvent() {
            fetchEventByName(this.name).then(eventFound => {
                console.log('eventFound:', eventFound);
                if (eventFound) {
                this.uniqueEvent = false;
            }
            })
        },

    },
    mounted() {
        this.verifyUniqueEvent();
    }
}
</script>