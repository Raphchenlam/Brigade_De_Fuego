<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="createEmployeeForm">
            <v-row>
                <v-text-field class="mx-2" type="number" label="Numero Employe" clearable>
                </v-text-field>
                <v-select class="mx-2" label="Poste">
                </v-select>
                <v-select class="mx-2" label="Skill Point">
                </v-select>
            </v-row>
            <v-row>
                <v-text-field class="mx-2" label="Code barre (Carte)" clearable>
                </v-text-field>
            </v-row>
            <v-row>
                <v-text-field class="mx-2" label="Prenom" clearable>
                </v-text-field>
                <v-text-field class="mx-2" label="Nom de famille" clearable>
                </v-text-field>
            </v-row>
            <v-row>
                <v-text-field class="mx-2" label="Numero de telephone(xxx-xxx-xxxx)" density="compact" clearable>
                </v-text-field>
                <v-text-field class="mx-2" label="Courriel" density="compact" clearable>
                </v-text-field>
            </v-row>
            <v-row>
            <v-text-field class="mx-2" label="Taux Horaire" density="compact">
            </v-text-field>
            <v-text-field v-model="color" class="mx-2" label="Couleur" density="compact">
            </v-text-field>
        </v-row>
            <v-row class="mx-2">
                Couleur de l'employé: 
            <v-color-picker v-model="color" class="ma-2" hide-canvas hide-inputs show-swatches></v-color-picker>

        </v-row>

            <v-text-field class="mx-2 mt-5" label="Mot de passe temporaire" density="compact" clearable>
            </v-text-field>
            <v-checkbox label="Gestionnaire"></v-checkbox>
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
    inject: ['closeNewEmployeeDialog'],
    components: {
        CreateButton,
        CancelButton
    },
    data() {
        return {
            color :""
        }
    },
    methods: {
        closeDialog()
        {
            this.closeNewEmployeeDialog();
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
    width: 100%;
    max-width: 80rem;
}
</style>