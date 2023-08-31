<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="editEventForm">
            <v-text-field v-model="event.name" label="Nom de levenement" density="compact" clearable>
            </v-text-field>
            <v-row>
                <v-text-field v-model="event.impact" dense type="number" class="ma-2" label="Impact" clearable>
                </v-text-field>
                <v-select v-model="event.eventType" label="Type devenement" :items="eventTypes"></v-select>
            </v-row>

            <v-checkbox v-model="event.isActive" label="Actif"></v-checkbox>
            <v-row class="justify-center">
                <CancelButton @click="closeDialog()"></CancelButton>
                <CreateButton></CreateButton>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import CreateButton from '../../components/Reusable/CreateButton.vue';
import CancelButton from '../../components/Reusable/CancelButton.vue'

export default {
    inject: ['closeEditEventDialog'],
    components: {
        CreateButton,
        CancelButton
    },
    data()
    {
        return {
            event: {
                name: "Game du canadien",
                impact: 2.1,
                eventType: "Sportif",
                isActive: false
            },
            eventTypes: [],
        }
    },
    methods: {
        closeDialog()
        {
            this.closeEditEventDialog();
        }
    },
    mounted()
    {
        this.eventTypes = ["Sportif", "Ferie"];
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