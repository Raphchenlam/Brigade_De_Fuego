<template>
    <v-form @submit.prevent="submitNewEvent" validate-on="submit lazy">
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
            <v-dialog v-model="dialogConfirmEvent" width="50%">
                <template v-slot:activator="{ props }">
                    <v-sheet class="ma-3 pa-5">
                        <v-row class="justify-center">
                            <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeEventConfirmationDialog()">
                            </DarkRedButton>
                            <DarkRedButton class="mx-5" textbutton="Confirmer" type="submit" v-bind="props">
                            </DarkRedButton>
                        </v-row>
                    </v-sheet>
                </template>
                <v-card height="100px">
                    <v-card-title>
                        <v-row class="justify-center ma-2">
                            <h2>Confirmation</h2>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="justify-center">
                            <p>L'événement a bien été enregistré.</p>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-sheet>
    </v-form>
    <v-sheet v-if="!uniqueEvent">
        <v-sheet class="ma-3 pa-5">
            <v-card class="pa-5">
                <v-row>
                    <v-card-title>
                        <strong>Événement existant: </strong>
                    </v-card-title>
                </v-row>
                <v-row><v-col class="text-red-lighten-1">Un événement portant le même nom se trouve dans la base de
                        données</v-col></v-row>
                <v-row>
                    <v-col></v-col>
                    <v-col><strong>Événement actuel</strong></v-col>
                    <v-col><strong>Événement trouvé</strong></v-col>
                </v-row>
                <v-row>
                    <v-col>Nom de l'événement : </v-col>
                    <v-col>{{ name }}</v-col>
                    <v-col><strong>{{ eventFoundInDB.name }}</strong></v-col>
                </v-row>
                <v-row>
                    <v-col>Type d'événement : </v-col>
                    <v-col>{{ eventType }}</v-col>
                    <v-col><strong>{{ eventFoundInDB.eventType }}</strong></v-col>
                </v-row>
                <v-row>
                    <v-col>L'impact sur l'achalandage : </v-col>
                    <v-col>{{ impact }}</v-col>
                    <v-col><strong>{{ eventFoundInDB.impact }}</strong></v-col>
                </v-row>
            </v-card>
        </v-sheet>
        <v-sheet class="ma-3 pa-5">
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="refreshAndCloseAllDialog()">
                            </DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Modifier l'événement ACTUEL"
                    @click="closeEventConfirmationDialog()">
                </DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Modifier l'événement TROUVÉ" @click="modififyExistingEvent()">
                </DarkRedButton>
            </v-row>
        </v-sheet>
    </v-sheet>
</template>

<script>
import { createEvent, fetchEventByName } from '../../services/EventService';

import DarkRedButton from '../../components/Reusable/darkredbutton.vue';

export default {
    inject: ['toggleEventConfirmationDialog', 'closeNewEventDialog', 'updateEventList', 'toggleUpdateEvent', 'loadEvent'],
    components: { DarkRedButton },
    props: {
        name: String,
        eventType: String,
        impact: Number
    },

    data() {
        return {
            uniqueEvent: true,
            eventFoundInDB: {},
            dialogConfirmEvent: false
        }
    },

    methods: {
        closeAllDialog() {
            this.dialogConfirmEvent = false;
            this.closeEventConfirmationDialog();
            this.closeDialog();
        },
        refreshAndCloseAllDialog(){
            this.loadEvent(this.eventFoundInDB.name);
            this.closeAllDialog();
        },
        closeEventConfirmationDialog() {
            this.toggleEventConfirmationDialog();
        },
        closeDialog() {
            this.closeNewEventDialog();
        },

        submitNewEvent() {
            const event = {
                name: this.name,
                impact: this.impact,
                eventType: this.eventType,
                isActive: true
            };
            this.dialogConfirmEvent = false;
            createEvent(event).then(() => {
                this.dialogConfirmEvent = true;
                setTimeout(this.closeAllDialog, 2000);
                this.updateEventList();
            }).catch(err => {
                console.error(err)
            });
        },
        verifyUniqueEvent() {
            fetchEventByName(this.name).then(eventFound => {
                console.log('eventFound:', eventFound);
                if (eventFound) {
                    this.uniqueEvent = false;
                    this.eventFoundInDB = eventFound;
                }
            })
        },
        modififyExistingEvent() {
            this.closeAllDialog();
            this.loadEvent(this.eventFoundInDB.name);
            this.toggleUpdateEvent();
        }


    },
    mounted() {
        this.verifyUniqueEvent();
    }
}
</script>