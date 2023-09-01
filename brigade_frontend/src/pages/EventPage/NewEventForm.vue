<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="createEventForm">
            <v-text-field label="Nom de levenement" density="compact" clearable>
            </v-text-field>
            <v-row>
                <v-text-field dense type="number" class="ma-2" label="Impact" clearable>
                </v-text-field>
                <v-select v-model="event.eventType" label="Type devenement" :items="eventTypes"></v-select>
            </v-row>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Creer"></DarkRedButton>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';

export default {
    inject: ['closeNewEventDialog'],
    components: {
        DarkRedButton,
    },
    data()
    {
        return {
            event: {
                name: null,
                impact: null,
                eventType: null,
            },
            eventTypes: [],
        }
    },
    methods: {
        closeDialog()
        {
            this.closeNewEventDialog();
        }
    },
    mounted()
    {
        this.eventTypes = ["Sportif", "Ferie"]; //On va avoir nesoin de fetch les eventTypes dans la BD
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