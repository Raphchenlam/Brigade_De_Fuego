<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="createClientForm">
            <v-row>
                <v-text-field class="ma-2" label="Prenom" clearable>
                </v-text-field>
                <v-text-field class="ma-2" label="Nom de famille" clearable>
                </v-text-field>
            </v-row>
            <v-text-field label="Numero de telephone(format: xxx-xxx-xxxx)" density="compact" clearable>
            </v-text-field>
            <v-text-field label="Allergies" density="compact" ref="passwordInput" clearable>
            </v-text-field>
            <v-checkbox label="Client favori"></v-checkbox>
            <v-row class="justify-center">
                <DarkRedButton textbutton="Annuler" class="mx-5" height="3rem" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton textbutton="Creer le client" class="mx-5" height="3rem"></DarkRedButton>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';

export default {
    inject: ['closeNewClientDialog'],
    components: {
        DarkRedButton,
    },
    data()
    {
        return {
            client: {
                firstName: null,
                LastName: null,
                phoneNumber: null,
                allergy: null,
                isFavorite: false,
                isBlacklisted: false
            }
        }
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