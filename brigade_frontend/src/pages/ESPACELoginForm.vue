<template>
    <div class="boxed-center">
        <v-sheet class="ma-2" max-width="40rem">
            <v-form @submit.prevent="login" validate-on="submit lazy" ref="loginform">
<<<<<<< Updated upstream
                <v-text-field type="number" maxlength="4" label="Numero d'employé"
=======
<<<<<<< Updated upstream
                <v-text-field v-model="userAccountEmail" label="Adresse courriel"
                    :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
                <v-text-field v-model="password" label="Mot de passe" type="password"
                    :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
                <v-btn type="submit" :disabled="!userAccountEmail || !password">Se connecter</v-btn>
=======
                <v-text-field v-model="employeeNumber" type="number" maxlength="4" label="Numero d'employé"
>>>>>>> Stashed changes
                    density="compact"></v-text-field>
                <v-text-field label="Mot de passe" type="password"
                   density="compact"></v-text-field>
                <v-btn type="submit">Se connecter</v-btn>
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            </v-form>
            <div class="text-body ma-3">Mot de passe oublié ?&nbsp;
                <router-link to="/login/new" replace>cliquez ici!</router-link>
            </div>
        </v-sheet>
    </div>
</template>

<script>
import userSession from '../sessions/UserSession';

export default {
    data() {
        return {
            employeeNumber: '',
            password: '',
            passwordValid: true,
            rules: {
                required: value => !!value || "Le champ est requis",
                passwordValid: () => this.passwordValid || "Nom d'utilisateur ou mot de passe incorrect"
            }
        };
    },
    methods: {
        login() {
            userSession.login(this.userAccountEmail, this.password).then(() => {
                this.passwordValid = true;
                this.$refs.loginform.validate();
                this.$router.go(-1);
            }).catch(authError => {
                this.passwordValid = false;
                this.$refs.loginform.validate();
                alert(authError.message);
            });
        }
    },
    mounted()
    {
        if (userSession.user)
        {
            this.$router.push('/espace/dashboard');
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
    width: 40%;
    max-width: 80rem;
}
</style>
