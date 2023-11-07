<template>
    <div class="boxed-center">
        <v-sheet class="ma-2" max-width="40rem">
            <v-form @submit.prevent="login" validate-on="submit lazy" ref="loginForm">
                <v-text-field v-model="employeeNumber" label="Numéro d'employé" :counter="4" maxlength="4"
                    :rules="[rules.required, rules.validatePassword]" density="compact" autofocus></v-text-field>
                <v-text-field v-model="password" label="Mot de passe" type="password"
                    :rules="[rules.required, rules.validatePassword]" density="compact"></v-text-field>
                <v-btn type="submit" :disabled="!employeeNumber || !password">Se connecter</v-btn>
            </v-form>
            <div class="text-body ma-3">Mot de passe oublié ?&nbsp;
                <a @click="dialogLostPassword = true" style="color:blue; text-decoration: underline;">Cliquez ici!</a>
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

    <v-dialog v-model="dialogChangeNewEmployeePassword" width="75%" persistent>
        <v-card>
            <v-form @submit.prevent="changePassword" validate-on="blur" ref="newEmployeePasswordForm" class="pa-10">
                <v-row class="justify-center">
                    <p >Bienvenue dans l'équipe Del Fuego!</p>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field v-model="newPassword" label="Mot de passe" type="password"
                            :rules="[rules.required, rules.validateNewPassword, rules.fieldLength255]" density="compact" ref="passwordInput"
                            clearable autofocus maxlength="255" :counter="255">
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="newPasswordConfirmation" label="Confirmer le mot de passe"
                            :rules="[rules.required, rules.newPasswordsMatch, rules.fieldLength255]" type="password" density="compact"
                            ref="passwordConfirmInput" clearable maxlength="255" :counter="255">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-row class="justify-center">
                            <DarkRedButton type="submit" class="mx-5" textbutton="Sauvegarder"></DarkRedButton>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>

    </v-dialog>

    <v-dialog v-model="dialogConfirmLostPassword" width="75%" persistent>
        <v-card class="pa-5">
            <v-row class="justify-center">
                <p style="font-size: 25px;">Votre mot de passe a bien été réinitialisé. Un courriel vous a été envoyé.</p>
            </v-row>
        </v-card>
    </v-dialog>
</template>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

<script>

import userSession from '../sessions/UserSession';
import DarkRedButton from '../components/Reusable/DarkRedButton.vue';
import { validEmail } from '../../../REGEX/REGEXfrontend';
import { getEmployeeByEmail, changeNewEmployeePassword, resetPassword } from '../services/EmployeeService';
import { validPassword } from '../../../REGEX/REGEXfrontend';

export default {
    components: {
        DarkRedButton
    },
    data() {
        return {
            employeeNumber: '',
            password: '',
            validPassword: false,
            invalidPasswordMessage: '',
            newPassword: '',
            newPasswordConfirmation: '',
            rules: {
                required: value => !!value || "Le champ est requis",
                validatePassword: () => this.validPassword === false ? "Numéro d'employé ou mot de passe invalide" : true,
                validateEmail: value => validEmail.test(value) || "Adresse courriel invalide",
                fieldLength255: value => ((value) ? !(value.length > 254) : true) || "255 caractères maximum.",
                validateNewPassword: value => {
                    if (!this.newPassword && !this.newPasswordConfirmation) {
                        return true;
                    }
                    return validPassword.test(value) || "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial";
                },
                newPasswordsMatch: () => {
                    if (!this.newPassword && !this.newPasswordConfirmation) {
                        return true;
                    }
                    return this.newPassword === this.newPasswordConfirmation || "Les mots de passe ne correspondent pas";
                }
            },
            dialogLostPassword: false,
            warningEmployeeLostPassword: false,
            warningEmployeeLostPasswordMessage: '',
            dialogConfirmLostPassword: false,
            dialogChangeNewEmployeePassword: false,
            emailLostPassword: ''
        };
    },
    methods: {
        async login() {
            this.validPassword = true;

            const validForm = await this.$refs.loginForm.validate();

            if (!validForm.valid) {
                return;
            }

            userSession.login(this.employeeNumber, this.password).then((employee) => {
                if (employee.isNewEmployee) {
                    this.dialogChangeNewEmployeePassword = true;
                } else {
                    this.$router.push('/espace/dashboard');
                }
            }).catch(authError => {
                this.validPassword = false;
                this.$refs.loginForm.validate();
                this.invalidPasswordMessage = authError.message;
            });
        },
        closelostPasswordDialog() {
            this.dialogLostPassword = false;
            this.emailLostPassword = '';
        },
        closeAllDialog() {
            this.dialogConfirmLostPassword = false;
            this.closelostPasswordDialog();
        },
        async resetPassword() {
            this.warningEmployeeLostPassword = false;
            const validResetPassword = await this.$refs.lostPasswordForm.validate();
            if (validResetPassword.valid) {
                getEmployeeByEmail(this.emailLostPassword).then(employee => {
                    if (employee) {
                        resetPassword(employee.employeeNumber).then(employeeReset => {
                            this.dialogConfirmLostPassword = true;
                            setTimeout(this.closeAllDialog, 4000);
                        }).catch(err => {
                            this.warningEmployeeLostPassword = true;
                            this.warningEmployeeLostPasswordMessage = err.message;
                            console.error(err);
                        })
                    }
                }).catch(err => {
                    this.warningEmployeeLostPassword = true;
                    this.warningEmployeeLostPasswordMessage = err.message;
                    console.error(err);
                })
            }
        },
        async changePassword() {
            const formValid = await this.$refs.newEmployeePasswordForm.validate();
            if (!formValid.valid) {
                return;
            }
            try {
                await changeNewEmployeePassword(userSession.employeeNumber, this.newPassword).then((employee) => {
                    if (employee) {
                        try {
                            const employeeNumber = userSession.employeeNumber;
                            userSession.clearCredentials();
                            userSession.setCredentials(employeeNumber, this.newPassword);
                            this.$router.push('/espace/dashboard');
                        } catch (error) {
                            console.error(error);
                            alert(error.message);
                        }
                    }
                });
            } catch (error) {
                console.error(error);
                alert(error.message);
                await this.$refs.newEmployeePasswordForm.validate();
            }
        }
    },
    created() {
        if (!userSession.employeeNumber && !userSession.password) {
            this.$router.push('/espace');
        } else {
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