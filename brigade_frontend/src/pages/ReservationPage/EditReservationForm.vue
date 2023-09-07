<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="editReservationForm">
            <v-row class="justify-center">
                <p>Client : {{ reservation.clientName }}</p>
            </v-row>
            <v-row class="justify-center">
                <v-text-field v-model="reservation.fullDate" type="datetime-local" class="ma-2"
                    label="Date de la reservation" clearable>
                </v-text-field>
                <v-text-field v-model="reservation.peopleCount" width="10px" type="number" class="shrink ma-2"
                    label="Nombre de personnes" clearable>
                </v-text-field>
            </v-row>
            <v-textarea v-model="reservation.mention" label="Mentions speciales"></v-textarea>
            <v-checkbox v-model="reservation.hasMinor" label="Mineur sur place"></v-checkbox>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" height="3rem" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5" height="3rem" textbutton="Sauvegarder"></DarkRedButton>
                <SmallBlackButton class="mt-10" textbutton="No Show"></SmallBlackButton>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import SmallBlackButton from '../../components/Reusable/SmallBlackButton.vue';

export default {
    inject: ['closeEditReservationDialog'],
    props: {
        reservationId: Number
    },
    data()
    {
        return {
            reservation: {
                id: 2,
                tableNumber: null,
                clientId: "1",
                clientName: "Alice Dupays (555-555-5555)",
                statusCode: "1",
                peopleCount: 12,
                date: "2023-10-15",
                startTime: "18:00:00",
                fullDate: "2023-10-15 18:00", //FAIRE BIEN ATTENTENTION A CE FORMAT... C'EST CELUI UTILISER PAR LE V-TEXT-FIELD
                endTime: "20:00:00",
                mention: "Fete a Annie",
                hasMinor: false,
                takenBy: "3883344939293432"
            }
        }
    },
    components: {
        DarkRedButton,
        SmallBlackButton
    },
    methods: {
        closeDialog()
        {
            this.closeEditReservationDialog();
        }
    },
    mounted()
    {

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