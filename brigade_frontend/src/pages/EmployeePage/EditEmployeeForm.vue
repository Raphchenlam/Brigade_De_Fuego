<template>
    <div class="ma-2" width="auto">
        <v-form @submit.prevent="saveUpdatedEmployeeInfos" class="pa-10" validate-on="blur" ref="editEmployeeForm">
            <v-row>
                <v-col cols="3">
                    <v-text-field disabled v-model="updatingEmployee.employeeNumber" class="mx-2" label="# Employé"
                        :rules="[rules.required, rules.validateEmployeeNumber]" maxlength="4" :counter="4">
                    </v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-select v-model="updatingEmployee.role" :items="roleList" class="mx-2" label="Poste"
                        :rules="[rules.required, rules.validateRole]">
                    </v-select>
                </v-col>
                <v-col cols="5">
                    <v-select :disabled="disableSkillPtsDropDown" :items="skillPointsRange"
                        v-model="updatingEmployee.skillPoints" class="mx-2" label="Points de compétences"
                        :rules="[rules.required, rules.validateSkillPoints]">
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field disabled v-model="updatingEmployee.barcodeNumber" class="mx-2" label="Code barre (Carte)"
                        clearable :rules="[rules.required, rules.validateBarcodeNumber, rules.fieldLength255]"
                        maxlength="16" :counter="16">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field disabled v-model="updatingEmployee.firstName" class="mx-2" label="Prénom" clearable
                        :rules="[rules.required, rules.validateName, rules.fieldLength255]" maxlength="255">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field disabled v-model="updatingEmployee.lastName" class="mx-2" label="Nom de famille" clearable
                        :rules="[rules.required, rules.validateName, rules.fieldLength255]" maxlength="255">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field v-model="updatingEmployee.phoneNumber" @blur="patternedPhoneNumber()" class="mx-2"
                        label="Numero de telephone(xxx-xxx-xxxx)" density="compact" clearable
                        :rules="[rules.required, rules.validatePhoneNumber, rules.fieldLength255]" maxlength="12">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field v-model="updatingEmployee.email" class="mx-2" label="Courriel" density="compact" clearable
                        :rules="[rules.required, rules.validateEmail, rules.fieldLength255]" maxlength="255">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field v-model="updatingEmployee.hourlyRate" class="mx-2" label="Taux Horaire" density="compact"
                        clearable :rules="[rules.required, rules.validateHourlyRate]" maxlength="6">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field disabled v-model="updatingEmployee.colorHexCode" class="mx-2" label="Couleur"
                        density="compact"
                        :rules="[rules.required, rules.validateHexCode, rules.invalidColor, rules.fieldLength255]"
                        maxlength="7">
                    </v-text-field>
                </v-col>
            </v-row>

            <v-col>
                <v-row class="mx-2">
                    Couleur choisie:
                    <v-color-picker disabled v-model="updatingEmployee.colorHexCode" class="ma-2" hide-canvas
                        hide-inputs></v-color-picker>
                </v-row>
            </v-col>

            <v-row>
                <v-col>
                    <v-checkbox :disabled="disableAdminCheckbox" v-model="updatingEmployee.isAdmin"
                        label="Accès Administrateur"></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox v-model="updatingEmployee.isActive" label="Employé(e) activé(e)"></v-checkbox>
                </v-col>
            </v-row>
 
            <v-row v-if="$route.fullPath == `/espace/employee/${userSession.employeeNumber}` && (userSession.employee.employeeNumber == this.updatingEmployee.employeeNumber)">
                <v-col>
                    <v-text-field @input="validatePassword" v-model="updatingEmployee.password" label="Mot de passe" type="password"
                        :rules="[rules.validPassword, rules.fieldLength255]" density="compact" ref="passwordInput" clearable>
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field @input="validatePasswordMatch" v-model="updatingEmployee.passwordConfirmation"
                        label="Confirmer le mot de passe" :rules="[rules.passwordsMatch, rules.fieldLength255]" type="password"
                        density="compact" ref="passwordConfirmInput" clearable>
                    </v-text-field>
                </v-col>
            </v-row>

            <v-col>
                <v-row class="justify-center">
                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                    <DarkRedButton type="submit" class="mx-5" textbutton="Sauvegarder"></DarkRedButton>
                </v-row>
            </v-col>
            <v-dialog v-model="updatedEmployee" width="50%" persistent>
                <v-card height="100px">
                    <v-card-title>
                        Confirmation de modification d'employé
                    </v-card-title>
                    <v-card-text>
                        <v-row class="justify-center">
                            <p>{{ updatingEmployee.firstName }} {{ updatingEmployee.lastName }} / {{
                                updatingEmployee.employeeNumber }} a bien été
                                modifié(e).</p>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-form>
    </div>
</template>


<script>
import { updateEmployeeByAdmin, updateEmployeeByNonAdmin, getEmployeeByEmployeeNumber, getAllRoles } from '../../services/EmployeeService';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import {
    validEmployeeNumber, validName, validPhoneNumber, validEmail, validRole, validColorHexCode,
    validHourlyRate, validBarcodeNumber, validSkillPoints, validPassword
} from '../../../../REGEX/REGEX_frontend';
import userSession from "../../sessions/UserSession"

export default {
    inject: ['closeEditEmployeeDialog', 'loadEmployees', 'capitalizeWords', 'formatPhoneNumber'],
    props: {
        employeeNumber: Number
    },
    components: {
        DarkRedButton
    },
    data() {
        return {
            userSession:userSession,
            updatingEmployee: {
                employeeNumber: 0,
                firstName: "",
                lastName: "",
                role: "",
                colorHexCode: "",
                hourlyRate: 0,
                barcodeNumber: "",
                email: "",
                phoneNumber: "",
                isAdmin: false,
                isActive: true,
                skillPoints: null,
                password: "",
                passwordConfirmation: "",
            },
            selectedRole: "",
            updatedEmployee: false,
            rules: {
                required: value => {
                    if (this.updatingEmployee.role == "Gestionnaire" && !this.updatingEmployee.skillPoints) {
                        return true;
                    } else {
                        return !!value || "Le champ est requis"
                    }
                },
                fieldLength255: value => ((value) ? !(value.length > 254) : true) || "255 caractères maximum.",
                validateEmployeeNumber: value => validEmployeeNumber.test(value) || "# d'employé invalide : doit contenir que 4 chiffres",
                validateName: value => validName.test(value) || "Prénom/Nom invalide : Minimum 2 lettres/mot \n 1ère lettre par mot doit être une majuscule \n Aucun accent accepté",
                validatePhoneNumber: value => validPhoneNumber.test(value) || "# de téléphone invalide -> Respecter ce format : xxx-xxx-xxxx",
                validateEmail: value => validEmail.test(value) || "Adresse courriel invalide",
                validateRole: value => validRole.test(value) || "Rôle invalide",
                validateHexCode: value => validColorHexCode.test(value) || "Couleur invalide",
                invalidColor: value => ((value) ? !(value == "#827717") : true) || 'Veuillez changer la couleur par défaut',
                validateHourlyRate: value => validHourlyRate.test(value) || "Taux horaire invalide -> Respecter un des formats suivant : xx.xx ou xxx.xx \n 1er chiffre ne peut pas être 0",
                validateBarcodeNumber: value => validBarcodeNumber.test(value) || "Code barre invalide : doit contenir que 16 chiffres",
                validateSkillPoints: value => {
                    if (this.selectedRole == "Gestionnaire" && !this.selectedSkillPoints) {
                        return true;
                    } else {
                        return validSkillPoints.test(value) || "Skill Points invalide : doit être entre 1 et 10"
                    }
                },
                validPassword: value => validPassword.test(value) || "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial",
                passwordsMatch: () => this.updatingEmployee.password === this.updatingEmployee.passwordConf || "Les mots de passe ne correspondent pas",
            },
            roleList: [],
            skillPointsRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
    },
    methods: {
        loadEmployeeByNumber(employeeNumber) {
            if (employeeNumber) {
                getEmployeeByEmployeeNumber(employeeNumber).then(employee => {
                    this.updatingEmployee = employee;
                }).catch(err => {
                    console.error(err);
                })
            }
            else {
                console.log("RESET ICI")
                this.updatingEmployee = {};
            }
        },
        async saveUpdatedEmployeeInfos() {
            const formValid = await this.$refs.editEmployeeForm.validate();
            if (!formValid.valid) {
                return;
            }

            if (this.$route.fullPath == `/espace/employee` && this.updatingEmployee.isAdmin) {
                try {
                    await updateEmployeeByAdmin(this.updatingEmployee).then((employee) => {
                        if (employee) {
                            this.updatedEmployee = true;
                            this.loadEmployees();
                            setTimeout(this.closeDialog, 2500);
                        }
                    });
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                    if (err.status === 409) {
                        this.uniqueEmployee = false;
                    }
                    await this.$refs.editEmployeeForm.validate();
                }
            } else {
                try {
                    await updateEmployeeByNonAdmin(this.updatingEmployee, this.updatingEmployee.employeeNumber).then((employee) => {
                        if (employee) {
                            this.updatedEmployee = true;
                            this.loadEmployees();
                            setTimeout(this.closeDialog, 2500);
                        }
                    });
                } catch (err) {
                    console.error(err);
                    alert(err.message);
                    if (err.status === 409) {
                        this.uniqueEmployee = false;
                    }
                    await this.$refs.editEmployeeForm.validate();
                }
            }

        },
        closeDialog() {
            this.updatedEmployee = false;
            this.closeEditEmployeeDialog();
        },
        patternedPhoneNumber() {
            this.employee.phoneNumber = this.formatPhoneNumber(this.employee.phoneNumber);
        },
    },
    mounted() {
        this.loadEmployeeByNumber(this.employeeNumber);
        getAllRoles().then(allRoles => {
            allRoles.forEach(role => {
                this.roleList.push(role.name);
            });
        }).catch(err => {
            console.error(err);
        });
    },
    computed: {
        disableAdminCheckbox() {
            return this.updatingEmployee.role == "Gestionnaire"
        },
        disableSkillPtsDropDown() {
            return this.updatingEmployee.role == "Gestionnaire"
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
    width: 100%;
    max-width: 80rem;
}
</style>