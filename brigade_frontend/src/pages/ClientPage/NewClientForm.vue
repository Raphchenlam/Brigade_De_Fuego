<template>
    <div class="ma-2" width="auto">
        <v-form class="pa-10" @submit.prevent="submitNewClient" validate-on="blur" ref="createClientForm">
            <v-row>
                <v-text-field class="ma-2 pa-4" label="Prénom" density="compact" v-model.trim="client.firstName"
                    @blur="capitalizeFirstName()"
                    :rules="[rules.required, rules.clientIdUnique, rules.firstNameValidation, rules.fieldLength255]"
                    clearable>
                </v-text-field>
                <v-text-field class="ma-2 pa-4" label="Nom de famille" density="compact" v-model.trim="client.lastName"
                    @blur="capitalizeLastName()"
                    :rules="[rules.required, rules.clientIdUnique, rules.lastNameValidation, rules.fieldLength255]"
                    clearable>
                </v-text-field>
            </v-row>
            <v-text-field class="pa-4" label="Numéro de téléphone(format: xxx-xxx-xxxx)" density="compact"
                v-model.trim="client.phoneNumber" @input="patternedPhoneNumber()"
                :rules="[rules.required, rules.clientIdUnique, rules.phoneNumberValidation]" clearable>
            </v-text-field>
            <v-text-field class="pa-4" label="Allergies" density="compact" v-model.trim="client.allergy"
                :rules="[rules.fieldLength255]" clearable>
            </v-text-field>
            <v-checkbox label="Client favori" density="compact" v-model="client.isFavorite"></v-checkbox>
            <v-row class="justify-end">
                <DarkRedButton textbutton="Annuler" class="mx-5" height="3rem" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton type="submit" textbutton="Creer le client" class="mx-5" height="3rem"
                    :disabled="createButtonDisabled">
                </DarkRedButton>
            </v-row>
        </v-form>
    </div>
</template>

<script>
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { createClient } from '../../services/ClientService';
import { validName, validPhoneNumber } from '../../../../REGEX/REGEX_frontend.js';

export default {
    inject: ['closeNewClientDialog', 'capitalizeWords', 'formatPhoneNumber'],
    components: {
        DarkRedButton,
    },
    data()
    {
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
                fieldLength255: value => !(value.length > 254) || "255 caractères maximum.",
                firstNameValidation: value => validName.test(value) || 'Le champ prénom ne respecte pas les critères d\'acceptation.',
                lastNameValidation: value => validName.test(value) || 'Le champ nom de famille ne respecte pas les critères d\'acceptation.',
                phoneNumberValidation: value => validPhoneNumber.test(value) || 'Le champ numéro de téléphone ne respecte pas les critères d\'acceptation.',
            },
            clientIdUnique: true,
            newClientAdded: false
        }
    },
    methods: {
        closeDialog()
        {
            this.closeNewClientDialog();
        },
        async submitNewClient()
        {
            this.clientIdUnique = true;
            const formValid = await this.$refs.createClientForm.validate();
            if (!formValid.valid)
            {
                return;
            }

            try
            {
                await createClient(this.client);
                this.clientIdUnique = true;
                this.newClientAdded = true;
                this.closeDialog();
            } catch (err)
            {
                console.error(err);
                alert(err.message);
                if (err.status === 409)
                {
                    this.clientIdUnique = false;
                    this.newClientAdded = false;
                }
                await this.$refs.createClientForm.validate();
            }
        },
        capitalizeFirstName()
        {
            this.client.firstName = this.capitalizeWords(this.client.firstName);
        },
        capitalizeLastName()
        {
            this.client.lastName = this.capitalizeWords(this.client.lastName);
        },
        patternedPhoneNumber()
        {
            this.client.phoneNumber = this.formatPhoneNumber(this.client.phoneNumber);
        }

    },
    computed: {
        createButtonDisabled()
        {
            return !this.client.firstName
                || !this.client.lastName
                || !this.client.phoneNumber;
        }
    }
}

</script>

<style scoped>.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 80%;
    max-width: 80rem;
}</style>