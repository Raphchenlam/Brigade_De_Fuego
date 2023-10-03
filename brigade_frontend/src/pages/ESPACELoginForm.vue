<template>
    <div class="boxed-center">
        <v-sheet class="ma-2" max-width="40rem">
            <v-form @submit.prevent="login" validate-on="submit lazy" ref="loginForm">
                <v-text-field v-model="employeeNumber" label="Numero d'employé" :counter="4" maxlength="4"
                    :rules="[rules.required, rules.validatePassword]" density="compact" autofocus></v-text-field>
                <v-text-field v-model="password" label="Mot de passe" type="password" 
                :rules="[rules.required, rules.validatePassword]" density="compact"></v-text-field>
                <v-btn type="submit" :disabled="!employeeNumber || !password">Se connecter</v-btn>
            </v-form>
            <div class="text-body ma-3">Mot de passe oublié ?&nbsp;
                <router-link to="" replace>cliquez ici!</router-link>
            </div>
        </v-sheet>
    </div>
</template>

<script>

import userSession from '../sessions/UserSession';

export default {
    data()
    {
        return {
            employeeNumber: '',
            password: '',
            validPassword: false,
            rules: {
                required: value => !!value || "Le champ est requis",

                validatePassword: () => this.validPassword === false ? "Numéro d'employé ou mot de passe invalide" : true
            }
        };
    },
    methods: {
        login()
        {
            this.validPassword = true;
            userSession.login(this.employeeNumber, this.password).then(() => {
                this.$refs.loginForm.validate();
                this.$router.push('/espace/dashboard');
            }).catch(authError => {
                this.validPassword = false;
                this.$refs.loginForm.validate();
                alert(authError.message);
            });
        }
    },
    created()
    {   
        if (!userSession.employeeNumber && !userSession.password)
        {
            this.$router.push('/espace');
        } else {
            this.$router.push('/espace/dashboard');
        }
    }
}
</script>
