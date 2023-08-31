<template>
    <v-sheet width="40%">
        <v-card height="420px" class="pa-5 ma-2">
            <p>Numero reservation : 2</p>
            <v-divider></v-divider>
            <p>Nom client : Bob Gratton</p>
            <p>Date: 2023-09-15</p>
            <p>Heure : 19:00</p>
            <p>Nombre de personne: 6</p>
            <p>Mention: "Fete de isabelle"</p>
            <p>Allergy: "Gluten"</p>
            <p>Mineur sur place ? Oui</p>
            <p></p>
        </v-card>
        <v-dialog v-model="dialogEditReservation" width="100%">
            <template v-slot:activator="{ props }">
                <v-row class="justify-center">
                    <v-btn block class="ma-5" color="black" v-bind="props">Modifier la reservation</v-btn>
                </v-row>
            </template>
            <v-card>
                <v-card-title>
                    Modifier la reservation
                </v-card-title>
                <EditReservationForm :reservationId="2"></EditReservationForm>
            </v-card>
        </v-dialog>

    </v-sheet>
</template>

<script>
import EditReservationForm from './EditReservationForm.vue'

export default {
    components: {
        EditReservationForm
    },
    data()
    {
        return {
            dialogEditReservation: false,
        };
    },
    methods: {
        closeEditReservationDialog()
        {
            this.dialogEditReservation = false;
        }
    },
    provide()
    {
        return {
            closeEditReservationDialog: this.closeEditReservationDialog
        };
    },
}

</script>