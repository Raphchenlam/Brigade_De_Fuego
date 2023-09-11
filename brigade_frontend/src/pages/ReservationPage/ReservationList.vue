<template>
    <v-sheet class="px-10 h-75">
        <v-card class="h-75">



                <v-row class="mb-0">
                    <v-text-field @input="" v-model="search" hide-details placeholder="Search name..."
                        class="ma-2"></v-text-field>
                    <v-dialog v-model="dialogNewReservation" width="100%">
                        <template v-slot:activator="{ props }">
                            <div class="ma-2 text-center">
                                <BlackButton class="h-100 w-100" v-bind="props" textbutton="+">
                                </BlackButton>
                            </div>
                        </template>
                        <v-card>
                            <v-card-title>
                                Creer une nouvelle reservation
                            </v-card-title>
                            <NewReservationForm></NewReservationForm>
                        </v-card>
                    </v-dialog>
                </v-row>
                <v-row>
                <v-text-field type="date" class="ma-2" label="Date Debut" clearable>
                </v-text-field>
                <v-text-field type="date" class="ma-2" label="Date Fin" clearable>
                </v-text-field>
            </v-row>
            <v-radio-group v-model="shiftShow">
                <v-row class="pl-5">
                    <v-radio label="Midi" value="lunch"></v-radio>
                    <v-radio label="Soir" value="dinner"></v-radio>
                    <v-radio label="Journee complete" value="all"></v-radio>
                </v-row>
            </v-radio-group>
                <v-list v-model:selected='selected' :items="reservations" item-title="listInformation" item-value="id">
                </v-list>
        </v-card>
    </v-sheet>
</template>


<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import NewReservationForm from "../reservationpage/NewReservationForm.vue"
import BlackButton from '../../components/Reusable/BlackButton.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';

export default {
    components: {
        VDataTable,
        NewReservationForm,
        BlackButton,
        DarkRedButton
    },
    data()
    {
        return {
            search: "",
            shiftShow: "all",
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal: false,
            selected: [],
            reservations: [],
            dialogNewReservation: false,
        };
    },
    provide()
    {
        return {
            closeNewReservationDialog: this.closeNewReservationDialog,
        };
    },
    methods: {
        loadReservations()
        {
            const allReservations = [
                {
                    listInformation: "Alice Dupays (555-555-5555) - 4 personnes - 15/10/2023 - 10h00",
                    id: 1,
                    tableNumber: null,
                    clientId: "1",
                    clientName: "Alice Dupays (555-555-5555)",
                    statusCode: "1",
                    peopleCount: 4,
                    date: "2023-10-15",
                    startTime: "10:00:00",
                    endTime: "12:00:00",
                    mention: null,
                    hasMinor: false,
                    takenBy: "3883344939293432",
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Alice Dupays (555-555-5555) - 12 personnes - 15/10/2023 - 18h00",
                    id: 2,
                    tableNumber: null,
                    clientId: "1",
                    clientName: "Alice Dupays (555-555-5555)",
                    statusCode: "1",
                    peopleCount: 12,
                    date: "2023-10-15",
                    startTime: "18:00:00",
                    endTime: "20:00:00",
                    mention: "Fete a Annie",
                    hasMinor: false,
                    takenBy: "3883344939293432",
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Bob Gratton (111-111-1111) - 4 personnes - 15/10/2023 - 19h00",
                    id: 3,
                    tableNumber: null,
                    clientId: "2",
                    clientName: "Bob Gratton (111-111-1111)",
                    statusCode: "1",
                    peopleCount: 4,
                    date: "2023-10-15",
                    startTime: "19:00:00",
                    endTime: "21:00:00",
                    mention: null,
                    hasMinor: true,
                    takenBy: "3883344939293432",
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Alice Dupays (555-555-5555) - 6 personnes - 17/10/2023 - 10h00",
                    id: 4,
                    tableNumber: null,
                    clientId: "1",
                    clientName: "Alice Dupays (555-555-5555)",
                    statusCode: "1",
                    peopleCount: 6,
                    date: "2023-10-17",
                    startTime: "10:00:00",
                    endTime: "12:00:00",
                    mention: null,
                    hasMinor: false,
                    takenBy: "3883344939293432",
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "Alice Dupays (555-555-5555) - 4 personnes - 18/10/2023 - 10h00",
                    id: 5,
                    tableNumber: null,
                    clientId: "1",
                    clientName: "Alice Dupays (555-555-5555)",
                    statusCode: "1",
                    peopleCount: 4,
                    date: "2023-10-18",
                    startTime: "10:00:00",
                    endTime: "12:00:00",
                    mention: null,
                    hasMinor: false,
                    takenBy: "3883344939293432",
                    props: {
                        color: 'red',
                    },
                },
            ];
            this.reservations = allReservations;
        },
        closeNewReservationDialog()
        {
            this.dialogNewReservation = false;
        },
    },
    mounted()
    {
        this.loadReservations();
    },
}
</script>


<style scoped>
.v-btn {
    font-size: xx-large;
}
</style>