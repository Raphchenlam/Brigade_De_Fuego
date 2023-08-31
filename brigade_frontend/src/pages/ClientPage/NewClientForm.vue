<template>
    <div class="ma-2" width="50%">
        <v-form class="pa-10" validate-on="submit lazy" ref="createClientForm">
            <v-row>
                <v-text-field class="ma-2" label="Prenom" clearable>
                </v-text-field>
                <v-text-field class="ma-2" label="Nom de famille" clearable>
                </v-text-field>
            </v-row>
            <v-text-field label="Numero de telephone" density="compact" clearable>
            </v-text-field>
            <v-text-field label="Allergies" density="compact" ref="passwordInput" clearable>
            </v-text-field>
            <v-checkbox label="Client favori"></v-checkbox>
            <v-row class="justify-center">
                <CancelButton @click="closeDialog()"></CancelButton>
                <CreateButton></CreateButton>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import CreateButton from '../../components/Reusable/CreateButton.vue';
import CancelButton from '../../components/Reusable/CancelButton.vue'

export default {
    inject: ['closeNewClientDialog'],
    components: {
        CreateButton,
        CancelButton
    },
    methods: {
        closeDialog()
        {
            this.closeNewClientDialog();
        }
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