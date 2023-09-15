<template>
    <div class="boxed-center">
        <v-sheet class="ma-2" max-width="40rem">
            <v-form @submit.prevent="login" validate-on="submit lazy" ref="loginForm">
                <v-text-field v-model="employeeNumber" label="Numero d'employé" maxlength="4"
                    :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
                <v-text-field v-model="password" label="Mot de passe" type="password" 
                :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
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
            passwordValid: true,
            rules: {
                required: value => !!value || "Le champ est requis",
                passwordValid: () => this.passwordValid || "Numéro d'employé ou mot de passe invalide"
            }
        };
    },
    methods: {
        login()
        {
            userSession.login(this.employeeNumber, this.password).then(() => {
                this.passwordValid = true;
                this.$refs.loginForm.validate();
                this.$router.push('/espace/dashboard');
            }).catch(authError => {
                this.passwordValid = false;
                this.$refs.loginForm.validate();
                alert(authError.message);
            });

            // if (this.employeeNumber == "1111")
            // {
            //     userSession.user = {
            //         employeeNumber: 1111,
            //         firstName: "Genevieve",
            //         lastName: "Dermers",
            //         isAdmin: true
            //     };
            // } else
            // {
            //     userSession.user = {
            //         employeeNumber: 2222,
            //         firstName: "John",
            //         lastName: "Doe",
            //         isAdmin: false
            //     }
            // }
        }
    },
    mounted()
    {
        if (userSession.employee)
        {
            this.$router.push('/espace/dashboard');
        }
    }
}
</script>
