<template>
    <v-row class="justify-center">
        <v-sheet width="70%" class="pa-16">
            <v-form @submit.prevent="punchEmployee" class="pa-10" validate-on="submit lazy" ref="punchForm">
                <v-text-field label="Scanner votre carte employe" v-model.trim="punch.employeeBarcodeNumber" autofocus
                    clearable :rules="[rules.required, rules.validateEmployeeNumber]" maxlength="16" :counter="16"
                    height="20px" class="mb-16">
                </v-text-field>
                <v-row class="justify-space-around">
                    <DarkRedButton textbutton="EFFACER" class="ml-5 h- w-25" height="8rem"></DarkRedButton>
                    <DarkRedButton type="submit" textbutton="PUNCHER" :disabled="disablePunchButton()" class="ml-5 w-25"
                        height="8rem"></DarkRedButton>
                </v-row>
                <v-dialog v-model="dialogPunchIn" width="50%" persistent>
                    <v-card height="100px">
                        <v-card-title>Confirmation Punch-In</v-card-title>
                        <v-card-text>
                            <v-row class="justify-center">
                                <p>{{ this.punch.employeeBarcodeNumber }} - Bon Shift !</p>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogPunchOut" width="50%" persistent>
                    <v-card height="100px">
                        <v-card-title>Confirmation Punch-In</v-card-title>
                        <v-card-text>
                            <v-row class="justify-center">
                                <p>{{ this.punch.employeeBarcodeNumber }} - Merci de ton travail !</p>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-form>
        </v-sheet>
    </v-row>
</template>
    
    
<script>
import OperationMenu from '../../components/OperationMenu.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import operationSession from "../../sessions/OperationSession";
import { validBarcodeNumber } from "../../../../REGEX/REGEX_frontend";
import { punchInEmployee, punchOutEmployee, getEmployeePunch } from '../../services/PunchService';


export default {
    name: 'PunchView',
    inject: ['toLocale'],
    components: {
        OperationMenu,
        DarkRedButton
    },
    data() {
        return {
            operationSession: operationSession,
            punch: {
                employeeBarcodeNumber: null,
                currentDate: null,
                dateIn: null,
                dateOut: null,
                startTime: null,
                endTime: null
            },
            dialogPunchIn: false,
            dialogPunchOut: false,
            rules: {
                required: value => !!value || 'Le champ est requis',
                validateEmployeeNumber: value => validBarcodeNumber.test(value) || "Code barre invalide : doit être composé de 16 chiffres uniquement"
            }
        }
    },
    methods: {
        async punchEmployee() {
            console.log("PUNCH TIME");

            const validForm = await this.$refs.punchForm.validate();
            if (!validForm.valid) {
                return;
            }

            getEmployeePunch(this.punch).then(result => {
                if (!result.punchIn) {

                    const dateInObject = this.punch.dateIn;
                    this.punch.dateIn = dateInObject.time.fullTime;

                    punchInEmployee(this.punch).then(result => {
                        if (result) {
                            this.dialogPunchIn = true;
                            setTimeout(this.closeAllDialog, 2000);
                        }
                    }).catch(err => {
                        console.error(err);
                        alert(err.message);
                    });
                } else {

                    //TROUVER UN MOYEN DE PUNCH-OUT LA JOURNEE MEME OU VERIFIER QUE LA dateOut EST LA MEME que dateIn

                    this.punch.dateOut = this.toLocale(new Date().toLocaleDateString()).date.fulldate;
                    const dateOutObject = this.punch.dateOut;

                    let endHour = dateOutObject.time.hours + 3;
                    let endMinute = dateOutObject.time.minutes;
                    if (endHour >= 24) {
                        endHour = 23;
                        endMinute = 59;
                    }
                    const endTimeHours = (endHour < 10) ? "0" + endHour : "" + endHour;
                    const endTimeMinutes = (endMinute < 10) ? "0" + endMinute : "" + endMinute;
                    this.punch.endTime = endTimeHours + ":" + endTimeMinutes;

                    punchOutEmployee(this.punch).then(result => {
                        if (result) {
                            this.dialogPunchOut = true;
                            setTimeout(this.closeAllDialog, 2000);
                        }
                    }).catch(err => {
                        console.error(err);
                        alert(err.message);
                    });
                }
            }).catch(err => {
                console.error(err);
                alert(err.message);
            });
        },
        closeAllDialog() {
            this.dialogPunchIn = false;
            this.dialogPunchOut = false;
        }
    },
    mounted() {
        if (!operationSession.isActive) {
            this.$router.push('/operation');
        }
        this.punch.currentDate = this.toLocale(new Date().toLocaleDateString()).date.fulldate;
        this.punch.dateIn = this.punch.currentDate;
    },
    computed: {
        disablePunchButton() {
            return this.punch.employeeBarcodeNumber;
        }
    }
}
</script>