<template>
    <v-sheet class="ma-16">
        <v-card height="440" class="ma-16">
            <v-sheet class="ma-5">
                <div class="text-center">
                    <h1> {{ event.name }}</h1>
                    <h3> Type : {{ event.eventType }} </h3>
                    <h3> Impact : {{ event.impact * 10 }}% de hausse </h3>
                </div>
                <v-divider thickness="2" class=" my-10 border-opacity-100"></v-divider>
                <div class="text-center">
                    <h2>
                        <span v-if="event.isActive" style='color:rgb(3, 211, 3)'>
                            ACTIF
                        </span>
                        <span v-else style='color:red'>
                            NON ACTIF
                        </span>
                    </h2>
                </div>
            </v-sheet>
        </v-card>
    </v-sheet>
    <v-dialog v-model="dialogEditEvent" width="50%">
        <template v-slot:activator="{ props }">
            <div class="ma-2 text-center">
                <v-btn width="70%" color="black" v-bind="props">
                    Modifier cet evenement
                </v-btn>
            </div>

        </template>
        <v-card>
            <v-card-title>
                Modfier un evenement
            </v-card-title>
            <EditEventForm></EditEventForm>
        </v-card>
    </v-dialog>
</template>

<script>
import EditEventForm from './EditEventForm.vue';

export default {
    props: {
        id: String
    },
    components: {
        EditEventForm
    },
    data()
    {
        return {
            dialogEditEvent: false,
            event: {
                name: null,
                impact: null,
                eventType: null,
                isActive: null
            }
        }
    },
    methods: {
        closeEditEventDialog()
        {
            this.dialogEditEvent = false;
        },
    },
    provide()
    {
        return {
            closeEditEventDialog: this.closeEditEventDialog,
        };
    },
    mounted()
    {
        this.event = {
            name: "Game du canadien",
            impact: 2.1,
            eventType: "Sportif",
            isActive: true
        }
    }
}

</script>