<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" @submit.prevent="submitNewClient" validate-on="submit lazy" ref="createClientForm">
            <v-row>
                <v-text-field class="ma-2 pa-4" label="Prenom" density="compact" v-model.trim="client.firstName"
                    :rules="[rules.required, rules.clientIdUnique, rules.prenomValidation]" clearable>
                </v-text-field>
                <v-text-field class="ma-2 pa-4" label="Nom de famille" density="compact" v-model.trim="client.lastName"
                    :rules="[rules.required, rules.clientIdUnique]" clearable>
                </v-text-field>
            </v-row>
            <v-text-field class="pa-4" label="Numero de telephone(format: xxx-xxx-xxxx)" density="compact"
                v-model.trim="client.phoneNumber" :rules="[rules.required, rules.clientIdUnique]" clearable>
            </v-text-field>
            <v-text-field class="pa-4" label="Allergies" density="compact" ref="passwordInput" v-model.trim="client.allergy"
                clearable>
            </v-text-field>
            <v-checkbox label="Client favori" density="compact" v-model="client.isFavorite"></v-checkbox>
            <v-row class="justify-center">
                <DarkRedButton textbutton="Annuler" class="mx-5" height="3rem" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton type="submit" textbutton="Creer le client" class="mx-5" height="3rem">
                </DarkRedButton>
            </v-row>
        </v-form>
    </div>
</template>

<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { createClient } from '../../services/ClientService';

export default {
    inject: ['closeNewClientDialog'],
    components: {
        DarkRedButton,
    },
    data() {
        return {
            client: {
                firstName: null,
                lastName: null,
                phoneNumber: null,
                allergy: null,
                isFavorite: false,
                isBlacklisted: false
            },
            rules: {
                required: value => !!value || "Le champ est requis",
                clientIdUnique: () => this.clientIdUnique || "Cette combinaison d'identifiants est déjà utilisé, veuillez modifié le(s) champs ou consulter le client associé",
                prenomValidation: value => {
                    const regEx = /^/;
                    if(value && regEx.test(value)){
                        return true;
                    }
                    return "Veuillez entré un prénom valide";
                }
            },
            clientIdUnique: true,
            newClientAdded: false
        }
    },
    methods: {
        closeDialog() {
            this.closeNewClientDialog();
        },
        async submitNewClient() {
            this.clientIdUnique = true;
            const formValid = await this.$refs.createClientForm.validate();
            if (!formValid.valid) {
                return;
            }

            try {
                await createClient(this.client);
                this.clientIdUnique = true;
                this.newClientAdded = true;
                this.closeDialog();
            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.clientIdUnique = false;
                    this.newClientAdded = false;
                }
                await this.$refs.createClientForm.validate();
            }
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