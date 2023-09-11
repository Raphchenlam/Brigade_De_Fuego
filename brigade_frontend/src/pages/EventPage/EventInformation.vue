<template>
    <v-sheet v-if="event.name" class="px-10">
        <v-dialog v-model="dialogEditEvent" width="50%">
            <template v-slot:activator="{ props }">
                <v-row class="justify-space-between">
                    <div>
                        <h1 class="my-5 ml-10">{{ event.name }}</h1>
                    </div>
                    <EditBlackButton class="ma-2" v-bind="props"> </EditBlackButton>
                </v-row>
            </template>
            <v-card>
                <v-card-title>
                    Modfier un evenement
                </v-card-title>
                <EditEventForm></EditEventForm>
            </v-card>
        </v-dialog>
        <v-divider :thickness="2" class="border-opacity-50"></v-divider>
        <v-sheet class="ma-5">
            <h3> Type : {{ event.eventType }} </h3>
            <h3> Impact : {{ event.impact * 10 }}% de hausse </h3>
            <h2>
                <span v-if="event.isActive" style='color:rgb(3, 211, 3)'>
                    ACTIF
                </span>
                <span v-else style='color:red'>
                    NON ACTIF
                </span>
            </h2>
        </v-sheet>
    </v-sheet>
</template>

<script>
import EditBlackButton from '../../components/Reusable/EditBlackButton.vue';
import EditEventForm from './EditEventForm.vue';

export default {
    props: {
        id: String
    },
    components: {
        EditEventForm,
        EditBlackButton
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
    provide()
    {
        return {
            closeEditEventDialog: this.closeEditEventDialog,
        };
    },
    methods: {
        closeEditEventDialog()
        {
            this.dialogEditEvent = false;
        },
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