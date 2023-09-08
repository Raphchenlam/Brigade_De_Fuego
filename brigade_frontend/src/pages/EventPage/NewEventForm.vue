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
            </v-row>
            <v-row>
                <v-slider class="ma-2 pa-2" thumb-color="#8b0000" label="Achalandage prevu" :messages="sliderMessage" v-model="event.impact" thumb-label="always"
                    :max="300"></v-slider>
                <!-- <v-text-field type="number" step="0.1" class="ma-2" v-model.trim="event.impact"
                    label="Impact sur l'achalandage" :rules="[rules.requiredImpact, rules.impactValid]" clearable>
                </v-text-field> -->
            </v-row>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5 ma-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5 ma-5" textbutton="Creer" @click="toggleEventConfirmationDialog()"></DarkRedButton>
            </v-row>
        </v-form>
    </div>
    <v-dialog v-model="dialogConfirmEvent" width="50%">
        <v-card>
            <NewEventConfirmationForm :name="event.name" :impact="event.impact.toFixed(2)" :eventType="event.eventType">
            </NewEventConfirmationForm>
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
                impact: 100,
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
    computed: {
        sliderMessage(){
            if (this.event.impact >= 250) {
                return "C'est la folie!"
            }else if(this.event.impact >= 200 && this.event.impact<250) {
                return "Super super occupé"
            }else if(this.event.impact >= 150 && this.event.impact<200) {
                return "Trés occupé"
            }else if(this.event.impact > 100 && this.event.impact<150) {
                return "Un peu plus que d'habitude"
            }else if(this.event.impact == 100) {
                return "La normal, quoi?"
            }else if(this.event.impact >= 50 && this.event.impact<100) {
                return "Trés tranquille"
            }else if(this.event.impact > 0 && this.event.impact<50) {
                return "Super super tranquille"
            }else if(this.event.impact == 0) {
                return "Fermé"
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