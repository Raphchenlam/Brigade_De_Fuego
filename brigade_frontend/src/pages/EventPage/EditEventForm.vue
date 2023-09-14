<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="editEventForm">
            <v-row>
                <v-text-field disabled class="ma-2" v-model.trim="name" label="Nom de l'événement">
                </v-text-field>
            </v-row>
            <v-row>
                <v-select class="ma-2" v-model="eventType" label="Type d'événement" :rules="[rules.requiredEventType]"
                    :items="eventTypes"></v-select>
            </v-row>
            <v-row class="align-center">
                <v-slider class="ma-2 pa-2" thumb-color="#8b0000" label="Achalandage prévu" :messages="sliderMessage"
                    v-model="impact" thumb-label="always" :max="300"></v-slider>
                <ResetButton @click="resetImpact()"></ResetButton>
            </v-row>
            <v-row class="justify-end">
                <v-checkbox v-model="isActive" label="Actif"></v-checkbox>
                <DarkRedButton class="mx-5 ma-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5 ma-5 w-25" textbutton="Enregistrer" @click="submitupdatedEvent()">
                     </DarkRedButton>
            </v-row>
            
            <!-- <v-text-field disabled v-model="name" label="Nom de levenement" density="compact" clearable>
            </v-text-field>
            <v-row>
                <v-text-field v-model="impact" dense type="number" class="ma-2" label="Impact" clearable>
                </v-text-field>
                <v-select v-model="eventType" label="Type devenement" :items="eventTypes"></v-select>
            </v-row>
            <v-checkbox v-model="isActive" label="Actif"></v-checkbox>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Sauvegarder" @click="submitupdatedEvent"></DarkRedButton>
            </v-row> -->
        </v-form>
    </div>
</template>
<script>
import ResetButton from '../../components/Reusable/ResetButton.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { updateEvent, fetchAllEventType } from '../../services/EventService';

export default {
    inject: ['closeEditEventDialog'],
    components: {
        DarkRedButton,
        ResetButton
    },
    props: {
        event: {
            name:String,
            impact:Number,
            eventType:String,
            isActive:Boolean
        }
    },
    data()
    {
        return {
            eventTypes: [],
            name: this.event.name,
            impact: this.event.impact,
            eventType:this.event.eventType,
            isActive: this.event.isActive,
            rules: {
                requiredEventType: value => !!value || "Un type d'événement doit être sélectionné",
                maxLengthInput: value => !(value.length > 254) || "Le nom est beaucoup trop long, il doit se limiter à 255 caractères."
            } 
        }
    },
    methods: {
        resetImpact(){
            this.impact = 100;
        },

        closeDialog()
        {
            this.closeEditEventDialog();
        },
        async submitupdatedEvent(){
            const formValid = await this.$refs.editEventForm.validate();
            if (!formValid.valid) {
                return;
            }

            try {
                const newEvent ={
                    name: this.name,
                    impact: this.impact,
                    eventType:this.eventType,
                    isActive: this.isActive
                }
                await updateEvent(newEvent);
                this.closeDialog();
            } catch (err) {
                console.error(err);
            }
        }
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