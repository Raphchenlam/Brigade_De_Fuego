<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" validate-on="submit lazy" ref="editClientForm">
            <p>Idclient : {{ clientId }}</p>
            <v-row>
                <v-text-field v-model="client.firstName" class="ma-2" label="Prenom" clearable>
                </v-text-field>
                <v-text-field v-model="client.lastName" class="ma-2" label="Nom de famille" clearable>
                </v-text-field>
            </v-row>
            <v-text-field v-model="client.phoneNumber" label="Numero de telephone" density="compact" clearable>
            </v-text-field>
            <v-text-field v-model="client.allergy" label="Allergies" density="compact" ref="passwordInput" clearable>
            </v-text-field>
            <v-row>
                <v-checkbox class="mr-10" v-model="client.isFavorite" label="Client favori"></v-checkbox>
                <v-checkbox class="ml-10" v-model="client.isBlacklisted" label="BLACKLIST"></v-checkbox>
            </v-row>

            <v-row class="justify-center">
                <CancelButton @click="closeDialog()"></CancelButton>
                <SaveButton></SaveButton>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import SaveButton from '../../components/Reusable/SaveButton.vue';
import CancelButton from '../../components/Reusable/CancelButton.vue';

export default {
    inject: ['closeEditClientDialog'],
    props: {
        clientId: Number
    },
    data()
    {
        return {
            client: {
                id: 2,
                firstName: "Bob",
                lastName: "Gratton",
                phoneNumber: "555-555-555",
                allergy: "Gluten",
                isFavorite: true,
                isBlacklisted: false
            }
        }
    },
    components: {
        CancelButton,
        SaveButton
    },
    methods: {
        closeDialog()
        {
            this.closeEditClientDialog();
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