<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" @submit.prevent="submitClientUpdate" validate-on="blur" ref="editClientForm">
            <v-row class="pl-4">
                <h5>Id client : {{ clientId }}</h5>
            </v-row>
            <v-row class="pa-1">
                <v-text-field v-model="editedFirstName" class="ma-2" label="Prénom" clearable
                    :rules="[rules.required, rules.uniqueClientInfoCombo, rules.firstNameValidation, rules.fieldLength255]">
                </v-text-field>
                <v-text-field v-model="editedLastName" class="ma-2" label="Nom de famille" clearable
                    :rules="[rules.required, rules.uniqueClientInfoCombo, rules.lastNameValidation, rules.fieldLength255]">
                </v-text-field>
            </v-row>
            <v-text-field v-model="editedPhoneNumber" label="Numéro de téléphone(format: xxx-xxx-xxxx)" density="compact"
                clearable :rules="[rules.required, rules.uniqueClientInfoCombo, rules.phoneNumberValidation]">
            </v-text-field>
            <v-text-field v-model="editedAllergy" label="Allergies" density="compact" ref="passwordInput" clearable
                :rules="[rules.fieldLength255]">
            </v-text-field>
            <v-row>
                <v-checkbox class="mr-10" v-model="editedIsFavorite" label="Client favori"></v-checkbox>
                <v-checkbox class="ml-10" v-model="editedIsBlacklisted" label="BLACKLIST"></v-checkbox>
            </v-row>

            <v-row class="justify-end">
                <DarkRedButton class="mx-5" height="3rem" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton type="submit" class="mx-5" height="3rem" textbutton="Sauvegarder"
                    :disabled="updateButtonDisabled()">
                </DarkRedButton>
            </v-row>
        </v-form>
    </div>
    <v-dialog v-model="clientModified" width="25%" height="25%">
        <v-card class="ma-2 pa-2 text-center">
            <v-card-title>
                <h2>Confirmation</h2>
            </v-card-title>
            <v-card-text>
                <p>Le client à bien été modifié</p>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { getClientById, updateClient } from '../../services/ClientService';
import { validName, validPhoneNumber } from '../../../REGEX/REGEXfrontend';

export default {
    inject: ['closeEditClientDialog', 'refreshClientList'],
    props: {
        clientId: Number
    },
    data() {
        return {
            client: {},
            editedFirstName: "",
            editedLastName: "",
            editedPhoneNumber: "",
            editedAllergy: "",
            editedIsFavorite: false,
            editedIsBlacklisted: false,
            rules: {
                required: value => !!value || "Le champ est requis",
                uniqueClientInfoCombo: () => this.uniqueClientInfoCombo || "Cette combinaison d'identifiants est déjà utilisé, veuillez modifié le(s) champs ou consulter le client associé",
                fieldLength255: value => ((value) ? !(value.length > 254) : true) || "255 caractères maximum.",
                firstNameValidation: value => validName.test(value) || 'Le champ prénom ne respecte pas les critères d\'acceptation :   \n\t - Aucune lettre seule\n\t - La 1ere lettre de chaque mot en majuscule\n\t - Ne pas excéder 255 caractères\n\t - Aucun accents',
                lastNameValidation: value => validName.test(value) || 'Le champ nom de famille ne respecte pas les critères d\'acceptation :   \n\t - Aucune lettre seule\n\t - La 1ere lettre de chaque mot en majuscule\n\t - Ne pas excéder 255 caractères\n\t - Aucun accents',
                phoneNumberValidation: value => validPhoneNumber.test(value) || 'Le champ numéro de téléphone ne respecte pas les critères d\'acceptation.',
            },
            uniqueClientInfoCombo: true,
            clientModified: false

        }
    },
    components: {
        DarkRedButton,
    },
    methods: {
        closeDialog() {
            this.closeEditClientDialog();
        },
        loadClientById(clientId) {
            if (clientId) {
                getClientById(clientId)
                    .then(client => {
                        this.client = client;
                        this.editedFirstName = client.firstName;
                        this.editedLastName = client.lastName;
                        this.editedPhoneNumber = client.phoneNumber;
                        this.editedAllergy = client.allergy;
                        this.editedIsFavorite = client.isFavorite;
                        this.editedIsBlacklisted = client.isBlacklisted;
                    })
                    .catch((err) => {
                        console.error(err);
                        alert(err.message);
                    });
            } else {
                this.client = {};
            }
        },
        async submitClientUpdate() {
            this.uniqueClientInfoCombo = true;
            const formValid = await this.$refs.editClientForm.validate();
            if (!formValid.valid) return;

            try {
                let updatedClientInformations = {
                    id: this.clientId,
                    oldFirstName: this.client.firstName,
                    oldLastName: this.client.lastName,
                    oldPhoneNumber: this.client.phoneNumber,
                }

                if (this.editedFirstName != this.client.firstName) {
                    updatedClientInformations = {
                        ...updatedClientInformations,
                        newFirstName: this.editedFirstName,
                    }
                }

                if (this.editedLastName != this.client.lastName) {
                    updatedClientInformations = {
                        ...updatedClientInformations,
                        newLastName: this.editedLastName,
                    }
                }


                if (this.editedPhoneNumber != this.client.phoneNumber) {
                    updatedClientInformations = {
                        ...updatedClientInformations,
                        newPhoneNumber: this.editedPhoneNumber,
                    }
                }

                if (this.editedAllergy != this.client.allergy) {
                    updatedClientInformations = {
                        ...updatedClientInformations,
                        newAllergy: this.editedAllergy,
                    }
                }

                if (this.editedIsFavorite != this.client.isFavorite) {
                    updatedClientInformations = {
                        ...updatedClientInformations,
                        newIsFavorite: this.editedIsFavorite,
                    }
                }

                if (this.editedIsBlacklisted != this.client.isBlacklisted) {
                    updatedClientInformations = {
                        ...updatedClientInformations,
                        newIsBlacklisted: this.editedIsBlacklisted,
                    }
                }

                await updateClient(updatedClientInformations)
                .then((client) => {
                    if (client) {
                        this.clientModified = true;
                        this.closeEditClientDialog();
                        this.refreshClientList();
                    }
                });
                this.uniqueClientInfoCombo = true;
            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.uniqueClientInfoCombo = false;
                    this.clientModified = false;
                }
                await this.$refs.editClientForm.validate();
            }
        },
        updateButtonDisabled() {
            return !this.editedFirstName
                || !this.editedLastName
                || !this.editedPhoneNumber;
        }
    },
    mounted() {
        this.loadClientById(this.clientId);
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