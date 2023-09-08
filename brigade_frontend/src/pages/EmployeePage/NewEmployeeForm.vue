<template>
    <div class="ma-2" width="auto">
        <v-form @submit.prevent="createEmployee" validate-on="blur" ref="newEmployeeForm" class="pa-10">
            <v-row>
                <v-text-field class="mx-2" label="Numéro Employé" v-model.trim="employee.employeeNumber" clearable
                    :rules="[rules.required, rules.validateEmployeeNumber]">
                </v-text-field>
                <v-select :items="roleList" class="mx-2" id="" label="Rôle" v-model.trim="selectedRole"
                    :rules="[rules.required, rules.validateRole]">
                </v-select>
                <v-select :disabled="disableSkillPtsDropDown" :items="skillPointsRange" class="mx-2" label="Points de compétences"
                    v-model="selectedSkillPoints" :rules="[rules.required, rules.validateSkillPoints]">
                </v-select>
            </v-row>
            <v-row>
                <v-text-field class="mx-2" label="Code barre (Carte)" v-model.trim="employee.barcodeNumber" clearable
                    :rules="[rules.required, rules.validateBarcodeNumber]">
                </v-text-field>
            </v-row>
            <v-row>
                <v-text-field class="mx-2" label="Prénom" v-model.trim="employee.firstName" clearable
                    :rules="[rules.required, rules.validateName]">
                </v-text-field>
                <v-text-field class="mx-2" label="Nom de famille" v-model.trim="employee.lastName" clearable
                    :rules="[rules.required, rules.validateName]">
                </v-text-field>
            </v-row>
            <v-row>
                <v-text-field class="mx-2" label="Numéro de téléphone (xxx-xxx-xxxx)" density="compact"
                    v-model.trim="employee.phoneNumber" clearable :rules="[rules.required, rules.validatePhoneNumber]">
                </v-text-field>
                <v-text-field class="mx-2" label="Adresse Courriel" density="compact" v-model.trim="employee.email"
                    clearable :rules="[rules.required, rules.validateEmail]">
                </v-text-field>
            </v-row>
            <v-row>
                <v-text-field class="mx-2" label="Taux Horaire" density="compact" v-model.trim="employee.hourlyRate"
                    clearable :rules="[rules.required, rules.validateHourlyRate]">
                </v-text-field>
                <v-text-field v-model.trim="employee.colorHexCode" class="mx-2" label="Couleur de l'employé"
                    density="compact" :rules="[rules.required, rules.validateHexCode]">
                </v-text-field>
            </v-row>
            <v-row class="mx-2">
                <v-color-picker v-model.trim="employee.colorHexCode" class="ma-2" hide-canvas hide-inputs
                    show-swatches></v-color-picker>
            </v-row>
            <v-text-field type="password" class="mx-2 mt-5" label="Mot de passe temporaire" density="compact"
                v-model.trim="employee.password" clearable>
            </v-text-field>
            <v-checkbox :disabled="disableCheckbox" v-model="employee.isAdmin" color="red" label="Accès Administrateur"></v-checkbox>
            <v-row class="justify-center">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialog()"></DarkRedButton>
                <DarkRedButton type="submit" class="mx-5" textbutton="Créer" :disabled="enableCreateEmployeeBtn"></DarkRedButton>
            </v-row>
        </v-form>
    </div>
</template>


<script>

//import session from '../../sessions/UserSession';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import { validEmployeeNumber, validName, validPhoneNumber, validEmail, validRole, validColorHexCode, validHourlyRate, validBarcodeNumber, validSkillPoints } from '../../../../REGEX/REGEX_frontend';
import { createEmployee, getAllRoles } from '../../services/EmployeeService';

export default {
    inject: ['closeNewEmployeeDialog', 'loadEmployees'],
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
                colorHexCode: "",
                hourlyRate: "",
                barcodeNumber: "",
                email: "",
                phoneNumber: "",
                isAdmin: false,
                skillPoints: "",
                password: ""
            },
            selectedRole: "",
            selectedSkillPoints: "",
            rules: {
                required: value => !!value || "Le champ est requis",
                validateEmployeeNumber: value => validEmployeeNumber.test(value) || "Numéro d'employé invalide : doit contenir que 4 chiffres",
                validateName: value => validName.test(value) || "Prénom/Nom invalide : Minimum 2 lettres/mot \n 1ère lettre par mot doit être une majuscule \n Aucun accent accepté",
                validatePhoneNumber: value => validPhoneNumber.test(value) || "# de téléphone invalide -> Respecter ce format : xxx-xxx-xxxx",
                validateEmail: value => validEmail.test(value) || "Adresse courriel invalide",
                validateRole: value => validRole.test(value) || "Rôle invalide",
                validateHexCode: value => validColorHexCode.test(value) || "Couleur invalide",
                validateHourlyRate: value => validHourlyRate.test(value) || "Taux horaire invalide -> Respecter un des formats suivant : xx.xx ou xxx.xx \n 1er chiffre ne peut pas être 0",
                validateBarcodeNumber: value => validBarcodeNumber.test(value) || "Code barre invalide : doit contenir que 16 chiffres",
                validateSkillPoints: value => validSkillPoints.test(value) || "Skill points invalide : doit être entre 1 et 10"
            },
            roleList: [],
            skillPointsRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
    },
    methods: {
        async createEmployee() {
            const validForm = await this.$refs.newEmployeeForm.validate();
            if (!validForm.valid) {
                return;
            }
            //session.createEmployee...
            if (validForm.valid) {
                createEmployee(this.employee).then(() => {
                    console.log("THERE BITCH");
                    alert(`${this.employee.firstName} ${this.employee.lastName} / ${this.employee.employeeNumber} créé(e) avec succès`);
                    this.updateEmployeeList();
                    this.closeDialog();
                }).catch(error => {
                    console.log(error)
                });
                //utiliser authError lorsqu'on utilisera session
                // .catch(authError => {
                //     alert(authError.message);
                //     if (authError.status === 409) {
                //         this.$refs.newEmployeeForm.validate();
                //     }
                // });
            }
        },
        closeDialog() {
            this.closeNewEmployeeDialog();
        },
        updateEmployeeList() {
            this.loadEmployees();
        }
    },
    watch: {
        selectedRole() {
            this.employee.role = this.selectedRole;
            if (this.employee.role == "Gestionnaire") {
                //disable v-select skillPoints
                //disabled + mettre à true isAdmin du checkbox Acces Admin
                this.selectedSkillPoints = null;
                this.employee.isAdmin = true;
            }
        },
        selectedSkillPoints(){
            this.employee.skillPoints = this.selectedSkillPoints;
        }
    },
    mounted() {
        getAllRoles().then(allRoles => {
            allRoles.forEach(role => {
                this.roleList.push(role.name);
            });
        }).catch(err => {
            console.error(err);
        });
    },
    computed: {
        enableCreateEmployeeBtn() {
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
        },
        disableCheckbox(){
            return this.selectedRole == "Gestionnaire"
        },
        disableSkillPtsDropDown() {
            return this.selectedRole == "Gestionnaire"
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