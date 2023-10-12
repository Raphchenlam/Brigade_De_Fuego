<template>
    <v-row class="justify-center">
        <v-sheet width="70%" class="pa-16">
            <v-form @submit.prevent="punchEmployee" class="pa-10" validate-on="submit lazy" ref="punchForm">
                <v-text-field label="Scanner votre carte employe" v-model.trim="punch.employeeBarcodeNumber" autofocus
                    clearable :rules="[rules.required, rules.validateBarcodeNumber]" maxlength="16" :counter="16"
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
                                <p>{{ this.punch.barcodeNumber }} - Merci de ton travail !</p>
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
import { punchInEmployee, punchOutEmployee, getLastPunchFromEmployee } from '../../services/PunchService';


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
                employeeNumber: null,
                barcodeNumber: null,
                dateIn: null,
                dateOut: null,
                startTime: null,
                endTime: null
            },
            currentDate: null,
            dialogPunchIn: false,
            dialogPunchOut: false,
            rules: {
                required: value => !!value || 'Le champ est requis',
                validateBarcodeNumber: value => validBarcodeNumber.test(value) || "Code barre invalide : doit être composé de 16 chiffres uniquement"
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

            getLastPunchFromEmployee(this.punch.barcodeNumber).then(result => {
                if (result.noShift || (result.startTime && result.endTime)) {

                    const punchInObject = this.toLocale(new Date().toLocaleDateString());
                    let startHour = punchInObject.time.hours;
                    let startMinute = punchInObject.time.minutes;
                    this.punch.startTime = startHour + ":" + startMinute;

                    punchInEmployee(this.punch).then(result => {
                        if (result) {
                            this.dialogPunchIn = true;
                            setTimeout(this.closeAllDialog, 2000);
                        }
                    }).catch(err => {
                        console.error(err);
                        alert(err.message);
                    });
                } 
                if (result.startTime && !result.endTime) {

                    const punchOutObject = this.toLocale(new Date().toLocaleDateString());
                    this.punch.dateOut = this.currentDate;

                    let endHour = punchOutObject.time.hours;
                    let endMinute = punchOutObject.time.minutes;
                    this.punch.endTime = endHour + ":" + endMinute;

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
        this.currentDate = this.toLocale(new Date().toLocaleDateString()).date.fulldate;
        this.punch.dateIn = this.currentDate;
    },
    computed: {
        disablePunchButton() {
            return this.punch.employeeNumber;
        }
    }
}
</script>