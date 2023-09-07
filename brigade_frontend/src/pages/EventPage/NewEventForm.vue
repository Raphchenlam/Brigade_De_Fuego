<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="blur lazy" ref="createEventForm">
            <v-row>
                <v-text-field class="ma-2" v-model.trim="event.name" label="Nom de l'événement"
                    :rules="[rules.requiredName]" clearable>
                </v-text-field>
            </v-row>
            <v-row>
                <v-select class="ma-2" v-model="event.eventType" label="Type d'événement" :rules="[rules.requiredEventType]"
                    :items="eventTypes"></v-select>
                <v-text-field type="number" step="0.1" class="ma-2" v-model.trim="event.impact"
                    label="Impact sur l'achalandage" :rules="[rules.requiredImpact, rules.impactValid]" clearable>
                </v-text-field>
            </v-row>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Creer" @click="toggleEventConfirmationDialog()"></DarkRedButton>
            </v-row>
        </v-form>
    </div>
    <v-dialog v-model="dialogConfirmEvent" width="50%">
        <v-card>
            <NewEventConfirmationForm :name="event.name" :impact="event.impact" :eventType="event.eventType"></NewEventConfirmationForm>
        </v-card>
    </v-dialog>
</template>
<script>
import DarkRedButton from '../../components/Reusable/darkredbutton.vue';
import { fetchAllEventType } from '../../services/EventService';
import NewEventConfirmationForm from './NewEventConfirmationForm.vue';


export default {
    inject: ['closeNewEventDialog'],
    components: {
        DarkRedButton,
        NewEventConfirmationForm
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
                impact: null,
                eventType: null,
            },
            eventTypes: [],
            dialogConfirmEvent: false,
            rules: {
                requiredName: value => !!value || "L'événement doit avoir un nom",
                requiredEventType: value => !!value || "Un type d'événement doit être sélectionné",
                requiredImpact: value => !!value || "L'impact sur l'événement doit être saisie",
                impactValid: value => {
                    const regex = /^\d{1,3}(.\d{1,2})?$/;
                    if (value && regex.test(value)) {
                        if (value >= 0 && value <= 300) {
                            return true;
                        }
                        else {
                            return "Veuillez entrer un impact entre 0.00 % et 300.00 %";
                        }
                    } else {
                        return "Respecter le format de nombre accepté: XXX.XX";
                    }
                },
            }
        }
    },
    methods: {
        closeDialog() {
            this.closeNewEventDialog();
        },

        async toggleEventConfirmationDialog() {
            const formValid = await this.$refs.createEventForm.validate();
            if (!formValid.valid) {
                return;
            }
            // await this.verifyUniqueEvent(this.event.name);

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