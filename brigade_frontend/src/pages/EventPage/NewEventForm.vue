<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="blur lazy" ref="createEventForm">
            <v-row>
                <v-text-field class="ma-2" v-model.trim="event.name" label="Nom de l'événement"
                   @blur="capitalizeName" :rules="[rules.requiredName, rules.maxLengthInput]" clearable>
                </v-text-field>
            </v-row>
            <v-row>
                <v-select class="ma-2" v-model="event.eventType" label="Type d'événement" :rules="[rules.requiredEventType]"
                    :items="eventTypes"></v-select>
            </v-row>
            <v-row class="align-center">
                <v-slider class="ma-2 pa-2" thumb-color="#8b0000" label="Achalandage prévu" :messages="sliderMessage"
                    v-model="event.impact" thumb-label="always" :max="300"></v-slider>
                <ResetButton @click="resetImpact()"></ResetButton>
            </v-row>
            <v-row class="justify-end">
                <DarkRedButton class="mx-5 ma-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton :disabled="!disabledButton" class="mx-5 ma-5 w-25" textbutton="Enregistrer" @click="toggleEventConfirmationDialog()">
                     </DarkRedButton>
            </v-row>
        </v-form>
    </div>
    <v-dialog persistent v-model="dialogConfirmEvent" width="50%">
        <v-card>
            <NewEventConfirmationForm :name="event.name" :impact="event.impact.toFixed(2)" :eventType="event.eventType">
            </NewEventConfirmationForm>
        </v-card>
    </v-dialog>
</template>
<script>
import ResetButton from '../../components/Reusable/ResetButton.vue';
import DarkRedButton from '../../components/Reusable/darkredbutton.vue';
import { fetchAllEventType } from '../../services/EventService';
import NewEventConfirmationForm from './NewEventConfirmationForm.vue';


export default {
    inject: ['closeNewEventDialog','capitalizeWords'],
    components: {
        DarkRedButton,
        NewEventConfirmationForm,
        ResetButton
    },
    provide() {
        return {
            toggleEventConfirmationDialog: this.toggleEventConfirmationDialog,
        }
    },

    data() {
        return {
            event: {
                name: null,
                impact: 100,
                eventType: null,
            },
            eventTypes: [],
            dialogConfirmEvent: false,
        
            rules: {
                requiredName: value => !!value || "L'événement doit avoir un nom",
                requiredEventType: value => !!value || "Un type d'événement doit être sélectionné",
                maxLengthInput: value => !(value.length > 254) || "Le nom est beaucoup trop long, il doit se limiter à 255 caractères."
            }
        }
    },
    computed: {
        sliderMessage() {
            if (this.event.impact >= 250) {
                return "C'est la folie! (+++++)"
            } else if (this.event.impact >= 200 && this.event.impact < 250) {
                return "Super super occupé (++++)"
            } else if (this.event.impact >= 150 && this.event.impact < 200) {
                return "Wow, c'est trés occupé (+++)"
            } else if (this.event.impact > 125 && this.event.impact < 150) {
                return "Intéresant, c'est occupé (++)"
            } else if (this.event.impact > 101 && this.event.impact < 125) {
                return "Un peu plus qu'à l'habitude (+)"
            } else if (this.event.impact >= 99 && this.event.impact <= 101) {
                return "La normal, quoi?"
            } else if (this.event.impact > 75 && this.event.impact < 99) {
                return "Plus tranquille qu'à l'habitude (-)"
            } else if (this.event.impact >= 50 && this.event.impact < 75) {
                return "Trés tranquille (--)"
            } else if (this.event.impact > 0 && this.event.impact < 50) {
                return "Super super tranquille (---)"
            } else if (this.event.impact == 0) {
                return "Fermé (X)"
            }
        },
        disabledButton(){
            return (this.event.name && this.event.eventType)
        }
    },
    
    methods: {
        closeDialog() {
            this.closeNewEventDialog();
        },
        resetImpact(){
            this.event.impact = 100;
        },
        capitalizeName(){
            this.event.name = this.capitalizeWords(this.event.name);
        },
        async toggleEventConfirmationDialog() {
            const formValid = await this.$refs.createEventForm.validate();
            if (!formValid.valid) {
                return;
            }
            this.dialogConfirmEvent = !this.dialogConfirmEvent;
        },
    },

    async mounted() {
        this.eventTypes = await fetchAllEventType();
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