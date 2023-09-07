<template>
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
            <DarkRedButton class="mx-5" textbutton="Confirmer" type="submit" @click="confirmEvent()">
            </DarkRedButton>
        </v-row>
    </v-sheet>
</template>

<script>

import DarkRedButton from '../../components/Reusable/darkredbutton.vue';

export default {
    inject: ['toggleEventConfirmationDialog'],
    components: { DarkRedButton },
    props: {
        name: String,
        eventType: String,
        impact: Number
    },

    data() {
        return {

        }
    },

    methods: {
        closeEventConfirmationDialog() {
            this.toggleEventConfirmationDialog;
        }
    }
}
</script>