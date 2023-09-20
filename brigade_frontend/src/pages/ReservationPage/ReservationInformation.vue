<template>
    <v-sheet width="100%" class="pa-2">
        <v-card >
            <v-dialog v-model="dialogEditReservation" width="100%">
                <template v-slot:activator="{ props }">
                    <v-row class="justify-end">
                        <EditBlackButton class="ma-2" v-bind="props"></EditBlackButton>
                    </v-row>
                    <v-divider class="my-5"></v-divider>
                </template>
                <v-card>
                    <v-card-title>
                        Modifier la reservation
                    </v-card-title>
                    <EditReservationForm :reservationId="2"></EditReservationForm>
                </v-card>
            </v-dialog>
        <p>Numero reservation : 2</p>
        <p>Nom client : Bob Gratton</p>
        <p>Date: 2023-09-15</p>
        <p>Heure : 19:00</p>
        <p>Nombre de personne: 6</p>
        <p>Table : Aucune</p>
        <p>Mention: "Fete de isabelle"</p>
        <p>Allergy: "Gluten"</p>
        <p>Mineur sur place ? Oui</p>
        <p></p>
    </v-card>
    </v-sheet>
</template>

<script>
import EditBlackButton from '../../components/Reusable/EditBlackButton.vue';
import BlackButton from '../../components/Reusable/BlackButton.vue';
import EditReservationForm from './EditReservationForm.vue'

export default {
    components: {
        EditReservationForm,
        BlackButton,
        EditBlackButton
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