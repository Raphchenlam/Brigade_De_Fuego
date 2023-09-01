<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="createReservationForm">
            <v-row>
                <ClientList></ClientList>
                <v-col>
                    <v-row class="justify-center">
                        <v-text-field type="datetime-local" class="ma-2" label="Date de la reservation">
                        </v-text-field>
                        <v-text-field width="10px" type="number" class="shrink ma-2" label="Nombre de personnes">
                        </v-text-field>
                    </v-row>
                    <v-textarea height="200px" no-resize rows="8" label="Mentions speciales"></v-textarea>
                    <v-checkbox label="Mineur sur place"></v-checkbox>
                    <v-row class="justify-center">
                        <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                        <DarkRedButton class="mx-5" textbutton="Creer la reservation"></DarkRedButton>
                    </v-row>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import ClientList from '../ClientPage/ClientList.vue';

export default {
    inject: ['closeNewReservationDialog'],
    components: {
        DarkRedButton,
        ClientList
    },
    data()
    {
        return {
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal: false,
            chiffresNombrePersonnes: []
        }
    },
    methods: {
        closeDialog()
        {
            this.closeNewReservationDialog();
        }
    },
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