<template>
    <v-sheet width="50%" class="ma-2">
        <v-row>
            <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" width="290px">
                <template v-slot:activator="{ props }">
                    <v-text-field v-model="date" label="Date des reservations" prepend-icon="mdi-calendar" readonly
                        v-bind="props"></v-text-field>
                </template>
                <v-date-picker range v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="console.log('OK')">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">
                        OK
                    </v-btn>
                </v-date-picker>
            </v-dialog>
            <v-text-field type="date" class="ma-2" label="Date de la reservation" clearable>
            </v-text-field>
        </v-row>
        <v-data-table-server height="300px" fixed-header v-model="selected" :headers="headers" :items="reservations"
            :items-length="reservations.length" select-strategy="single" class="elevation-1"
            @update:options="loadReservations" show-select>

        </v-data-table-server>
        <v-dialog v-model="dialogNewReservation" width="100%">
            <template v-slot:activator="{ props }">
                <div class="ma-2 text-center">
                    <v-btn block color="black" v-bind="props">Ajouter une nouvelle reservation</v-btn>
                </div>
            </template>
            <v-card>
                <v-card-title>
                    Creer une nouvelle reservation
                </v-card-title>
                <NewReservationForm></NewReservationForm>
            </v-card>
        </v-dialog>
    </v-sheet>
</template>


<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import NewReservationForm from "../reservationpage/NewReservationForm.vue"

export default {
    components: {
        VDataTable,
        NewReservationForm
    },
    data()
    {
        return {
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal: false,
            selected: [],
            reservations: [],
            headers: [
                {
                    align: 'start',
                    key: 'clientName',
                    sortable: false,
                    title: 'Non du client',
                },
                {
                    key: 'date',
                    sortable: false,
                    title: 'Date',
                },
                {
                    key: 'startTime',
                    sortable: false,
                    title: 'Heure',
                },
                {
                    key: 'peopleCount',
                    sortable: false,
                    title: 'Nb personnes',
                },
            ],
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
                    takenBy: "3883344939293432"
                },
                {
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
                    takenBy: "3883344939293432"
                },
                {
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
                    takenBy: "3883344939293432"
                },
                {
                    id: 4,
                    tableNumber: null,
                    clientId: "1",
                    clientName: "Alice Dupays (555-555-5555)",
                    statusCode: "1",
                    peopleCount: 4,
                    date: "2023-10-17",
                    startTime: "10:00:00",
                    endTime: "12:00:00",
                    mention: null,
                    hasMinor: false,
                    takenBy: "3883344939293432"
                },
                {
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
                    takenBy: "3883344939293432"
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

    },
}
</script>