<template>
    <div class="boxed-center">
        <v-sheet class="ma-2" max-width="40rem">
            tu peux te connecter directment dans username et mot de passe (si tu veut etre admin, fait juste ecrire 1 a
            numero employee)
            <v-form @submit.prevent="login" validate-on="submit lazy" ref="loginform">
                <v-text-field v-model="employeeNumber" type="number" maxlength="4" label="Numero d'employé"
                    density="compact"></v-text-field>
                <v-text-field label="Mot de passe" type="password" density="compact"></v-text-field>
                <v-btn type="submit">Se connecter</v-btn>
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
        };
    },
    methods: {
        login()
        {
            if (this.employeeNumber == "1")
            {
                userSession.user = {
                    employeeNumer: 1,
                    firstName: "super admin",
                    isAdmin: true
                };
            } else
            {
                userSession.user = {
                    employeeNumer: 2,
                    firstName: "Maxime",
                    isAdmin: false
                }
            }
            this.$router.push('/espace/dashboard');

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
