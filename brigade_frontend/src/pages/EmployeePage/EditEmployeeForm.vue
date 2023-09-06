<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="EditEmployeeForm">
            <v-row>
                <v-text-field disabled class="mx-2" type="number" label="Numero Employe" clearable>
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
            <v-row>
            <v-checkbox label="Gestionnaire"></v-checkbox>
            <v-checkbox label="Desactiver"></v-checkbox>
        </v-row>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Sauvegarder"></DarkRedButton>
            </v-row>
        </v-form>
    </div>
</template>


<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';

export default {
    inject: ['closeEditEmployeeDialog'],
    components: {
        DarkRedButton
    },
    data()
    {
        return {
            color: ""
        }
    },
    methods: {
        closeDialog()
        {
            this.closeEditEmployeeDialog();
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