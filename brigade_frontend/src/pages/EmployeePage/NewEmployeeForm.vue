<template>
    <div class="ma-2" width="auto" v-if="this.isUserAuthorized()">
        <v-form @submit.prevent="createEmployee" validate-on="blur" ref="newEmployeeForm" class="pa-10">
            <v-row>
                <v-col cols="3">
                    <v-text-field label="# Employé" v-model.trim="employee.employeeNumber" clearable
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateEmployeeNumber]" maxlength="4"
                        :counter="4">
                    </v-text-field>
                </v-col>

                <v-col cols="4">
                    <v-select :items="roleList" id="" label="Rôle" v-model.trim="selectedRole"
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateRole]">
                    </v-select>
                </v-col>

                <v-col cols="5">
                    <v-select :disabled="disableSkillPtsDropDown" :items="skillPointsRange" label="Points de compétences"
                        v-model="selectedSkillPoints"
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateSkillPoints]">
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field label="Code barre (Carte)" v-model.trim="employee.barcodeNumber" clearable
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateBarcodeNumber, rules.fieldLength255]"
                        maxlength="16" :counter="16">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field label="Prénom" v-model.trim="employee.firstName" @blur="capitalizeFirstName()" clearable
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateName, rules.fieldLength255]"
                        maxlength="255">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="Nom de famille" v-model.trim="employee.lastName" @blur="capitalizeLastName()"
                        clearable :rules="[rules.required, rules.uniqueEmployee, rules.validateName, rules.fieldLength255]"
                        maxlength="255">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field label="Numéro de téléphone : xxx-xxx-xxxx" density="compact"
                        v-model.trim="employee.phoneNumber" @blur="patternedPhoneNumber()" clearable
                        :rules="[rules.required, rules.uniqueEmployee, rules.validatePhoneNumber, rules.fieldLength255]"
                        maxlength="12">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="Adresse Courriel" density="compact" v-model.trim="employee.email" clearable
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateEmail, rules.fieldLength255]"
                        maxlength="255">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field label="Taux Horaire" density="compact" v-model.trim="employee.hourlyRate" clearable
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateHourlyRate]" maxlength="6">
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field v-model.trim="employee.colorHexCode" label="Couleur de l'employé" density="compact"
                        :rules="[rules.required, rules.uniqueEmployee, rules.validateHexCode, rules.invalidColor, rules.fieldLength255]"
                        maxlength="7">
                    </v-text-field>
                    <!-- <p v-if="employee.colorHexCode == '#827717'" class="warning-message">Changez la couleur par défaut</p> -->
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-color-picker v-model.trim="employee.colorHexCode" :mode="colorMode" hide-canvas hide-inputs
                        show-swatches></v-color-picker>
                </v-col>
            </v-row>
            <v-col class="mt-5">
                <v-text-field type="password" label="Mot de passe temporaire" density="compact"
                    v-model.trim="employee.password" clearable maxlength="255">
                </v-text-field>
            </v-col>

            <v-checkbox :disabled="disableCheckbox" v-model="employee.isAdmin" color="red"
                label="Accès Administrateur"></v-checkbox>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton type="submit" class="mx-5" textbutton="Créer" :disabled="disableCreateEmployeeBtn">
                </DarkRedButton>
            </v-row>
            <v-dialog v-model="dialogOKEmployee" width="50%" persistent>
                <v-card height="100px">
                    <v-card-title>
                        Confirmation de création d'employé
                    </v-card-title>
                    <v-card-text>
                        <v-row class="justify-center">
                            <p>{{ employee.firstName }} {{ employee.lastName }} / {{ employee.employeeNumber }} a bien été
                                enregistré(e).</p>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-form>
    </div>
</template>


<script>

//import session from '../../sessions/UserSession';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { validEmployeeNumber, validName, validPhoneNumber, validEmail, validRole, validColorHexCode, validHourlyRate, validBarcodeNumber, validSkillPoints } from '../../../../REGEX/REGEX_frontend';
import { createEmployee, getAllRoles } from '../../services/EmployeeService';

export default {
    inject: ['closeNewEmployeeDialog', 'loadEmployees', 'isUserAuthorized', 'capitalizeWords', 'formatPhoneNumber'],
    components: {
        DarkRedButton
    },
    data() {
        return {
            //session: session
            employee: {
                employeeNumber: "",
                firstName: "",
                lastName: "",
                role: "",
                colorHexCode: "#827717",
                hourlyRate: "",
                barcodeNumber: "",
                email: "",
                phoneNumber: "",
                isAdmin: false,
                skillPoints: "",
                password: ""
            },
            colorMode: "hexa",
            selectedRole: "",
            selectedSkillPoints: "",
            warningColorMessage: false,
            dialogOKEmployee: false,
            rules: {
                required: value => {
                    if (this.selectedRole == "Gestionnaire" && !this.selectedSkillPoints) {
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
                uniqueEmployee: () => this.uniqueEmployee || "Un employé ayant ces informations existe déjà. Veuillez modifier le(s) champs ou consulter l'employé associé"
            },
            roleList: [],
            skillPointsRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            uniqueEmployee: true
        }
    },
    methods: {
        async createEmployee() {
            this.uniqueEmployee = true;
            const validForm = await this.$refs.newEmployeeForm.validate();
            if (!validForm.valid) {
                return;
            }

            try {
                await createEmployee(this.employee).then((employee) => {
                    if (employee) {
                        this.dialogOKEmployee = true;
                        this.loadEmployees();
                        setTimeout(this.closeDialog, 2500);
                    }
                    this.uniqueEmployee = true;
                });
            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.uniqueEmployee = false;
                }
                await this.$refs.createClientForm.validate();
            }
        },
        closeDialog() {
            this.dialogOKEmployee = false;
            this.closeNewEmployeeDialog();
        },
        updateEmployeeNumberValue(event) {
            const value = event.target.value;
            if (String(value).length <= 4) {
                this.employee.employeeNumber = value;
            }
            this.$forceUpdate;
        },
        capitalizeFirstName() {
            this.employee.firstName = this.capitalizeWords(this.employee.firstName);
        },
        capitalizeLastName() {
            this.employee.lastName = this.capitalizeWords(this.employee.lastName);
        },
        patternedPhoneNumber() {
            this.employee.phoneNumber = this.formatPhoneNumber(this.employee.phoneNumber);
        }
    },
    watch: {
        selectedRole() {
            this.employee.role = this.selectedRole;
            if (this.employee.role == "Gestionnaire") {
                this.selectedSkillPoints = null;
                this.employee.isAdmin = true;
            }
        },
        selectedSkillPoints() {
            this.employee.skillPoints = this.selectedSkillPoints;
        }
    },
    mounted() {
        if (this.isUserAuthorized()) {
            getAllRoles().then(allRoles => {
                allRoles.forEach(role => {
                    this.roleList.push(role.name);
                });
            }).catch(err => {
                console.error(err);
            });
        }
    },
    computed: {
        disableCreateEmployeeBtn() {
            if (this.selectedRole == "Gestionnaire" && !this.selectedSkillPoints) {
                return !this.employee.employeeNumber
                    || !this.employee.role
                    || !this.employee.barcodeNumber
                    || !this.employee.firstName
                    || !this.employee.lastName
                    || !this.employee.phoneNumber
                    || !this.employee.email
                    || !this.employee.hourlyRate
                    || !this.employee.colorHexCode
                    || !this.employee.password;
            } else {
                return !this.employee.employeeNumber
                    || !this.employee.role
                    || !this.employee.skillPoints
                    || !this.employee.barcodeNumber
                    || !this.employee.firstName
                    || !this.employee.lastName
                    || !this.employee.phoneNumber
                    || !this.employee.email
                    || !this.employee.hourlyRate
                    || !this.employee.colorHexCode
                    || !this.employee.password;
            }
        },
        disableCheckbox() {
            return this.selectedRole == "Gestionnaire"
        },
        disableSkillPtsDropDown() {
            return this.selectedRole == "Gestionnaire"
        }
    }
}
</script>
<style scoped>
.warning-message {
    color: red
}

.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 100%;
    max-width: 80rem;
}</style>