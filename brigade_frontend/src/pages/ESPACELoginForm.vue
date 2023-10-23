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
                <a @click="dialogLostPassword = true" style="color:blue; text-decoration: underline;">cliquez ici!</a>
            </div>
        </v-sheet>
    </div>
    <v-dialog v-model="dialogLostPassword" width="50%" persistent>
        <v-form @submit.prevent="resetPassword" validate-on="submit lazy" ref="lostPasswordForm">
            <v-card class="pa-5">
                <v-card-title>
                    Réinitialisation du mot de passe
                </v-card-title>
                <v-card-text>
                    <v-row class="justify-center">
                        <p v-if="warningEmployeeLostPassword" align="center" class="warning-message"> {{
                            warningEmployeeLostPasswordMessage }}</p>
                    </v-row>
                    <v-row class="justify-center">
                        <v-col cols="12">
                            <v-text-field v-model="emailLostPassword" label="Courriel"
                                :rules="[rules.required, rules.validateEmail]"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-row class="justify-end">
                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closelostPasswordDialog()"></DarkRedButton>
                    <DarkRedButton class="mx-5" textbutton="Réinitialiser" type="submit" :disabled="!emailLostPassword">
                    </DarkRedButton>
                </v-row>
            </v-card>
        </v-form>
    </v-dialog>
    <v-dialog v-model="dialogConfirmLostPassword" width="75%" persistent>
        <v-card class="pa-5">
            <v-row class="justify-center">
                <p style="font-size: 25px;">Votre email a bien été réinitialisé. Un courriel vous a été envoyé.</p>
            </v-row>
        </v-card>
    </v-dialog>
</template>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

<script>

import userSession from '../sessions/UserSession';
import DarkRedButton from '../components/Reusable/DarkRedButton.vue';
import { validEmail } from '../../../REGEX/REGEX_frontend';
import { getEmployeeByEmail, resetPassword } from '../services/EmployeeService';

export default {
    components: {
        DarkRedButton
    },
    data()
    {
        return {
            employeeNumber: '',
            password: '',
            validPassword: false,
            rules: {
                required: value => !!value || "Le champ est requis",
                validatePassword: () => this.validPassword === false ? "Numéro d'employé ou mot de passe invalide" : true,
                validateEmail: value => validEmail.test(value) || "Adresse courriel invalide",
            },
            dialogLostPassword: false,
            warningEmployeeLostPassword: false,
            warningEmployeeLostPasswordMessage: '',
            dialogConfirmLostPassword: false,
            emailLostPassword: ''
        };
    },
    methods: {
        login()
        {
            this.validPassword = true;
            userSession.login(this.employeeNumber, this.password).then(() =>
            {
                this.$refs.loginForm.validate();
                
            
                this.$router.push('/espace/dashboard');
            }).catch(authError =>
            {
                this.validPassword = false;
                this.$refs.loginForm.validate();
                alert(authError.message);
            });
        },
        closelostPasswordDialog()
        {
            this.dialogLostPassword = false;
            this.emailLostPassword = '';
        },
        closeAllDialog()
        {
            this.dialogConfirmLostPassword = false;
            this.closelostPasswordDialog();
        },
        async resetPassword()
        {
            this.warningEmployeeLostPassword = false;
            const validResetPassword = await this.$refs.lostPasswordForm.validate();
            if (validResetPassword.valid)
            {
                getEmployeeByEmail(this.emailLostPassword).then(employee =>
                {
                    if (employee)
                    {
                        resetPassword(employee.employeeNumber).then(employeeReset =>
                        {
                            this.dialogConfirmLostPassword = true;
                            setTimeout(this.closeAllDialog, 4000);
                        }).catch(err =>
                        {
                            this.warningEmployeeLostPassword = true;
                            this.warningEmployeeLostPasswordMessage = err.message;
                            console.error(err);
                        })
                    }
                }).catch(err =>
                {
                    this.warningEmployeeLostPassword = true;
                    this.warningEmployeeLostPasswordMessage = err.message;
                    console.error(err);

                })
            }
        }
    },
    created()
    {
        if (!userSession.employeeNumber && !userSession.password)
        {
            this.$router.push('/espace');
        } else
        {
            this.$router.push('/espace/dashboard');
        }
    }
}
</script>

<style scoped>
a {
    cursor: pointer;
}
</style>