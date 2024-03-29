<template>
    <v-row class="justify-center pa-5 ma-5">
        <div id="clock">
            <p class="time">{{ time }}</p>
        </div>
    </v-row>
    <v-row class="justify-center">
        <v-sheet width="70%" class="pa-16">
            <v-form @submit.prevent="punchEmployee" class="pa-10" validate-on="submit lazy" ref="punchForm">
                <span v-if="isWrongBarcode" style="color: red;">{{wrongBarcodeMessage}}</span>
                <v-text-field label="Scanner votre carte employe" v-model.trim="punch.barcodeNumber" autofocus clearable
                    :rules="[rules.required, rules.validateBarcodeNumber]" maxlength="16" :counter="16" height="20px"
                    class="mb-16">
                </v-text-field>
                <v-row class="justify-space-around">
                    <DarkRedButton textbutton="EFFACER" class="ml-5 h- w-25" height="8rem"></DarkRedButton>
                    <DarkRedButton type="submit" textbutton="PUNCHER" :disabled="disablePunchButton" class="ml-5 w-25"
                        height="8rem"></DarkRedButton>
                </v-row>
                <v-dialog v-model="dialogPunchIn" width="50%" persistent>
                    <v-card height="100px">
                        <v-card-title>Confirmation Punch In</v-card-title>
                        <v-card-text>
                            <v-row class="justify-center">
                                <p> Bon Shift !</p>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogPunchOut" width="50%" persistent>
                    <v-card height="100px">
                        <v-card-title>Confirmation Punch Out</v-card-title>
                        <v-card-text>
                            <v-row class="justify-center">
                                <p>Merci de ton travail !</p>
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
    data()
    {
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
            interval: null,
            time: null,
            dialogPunchIn: false,
            dialogPunchOut: false,
            isWrongBarcode: false,
            wrongBarcodeMessage: null,
            rules: {
                required: value => !!value || 'Le champ est requis',
                validateBarcodeNumber: value => validBarcodeNumber.test(value) || "Code barre invalide : doit être composé de 16 chiffres uniquement"
            }
        }
    },
    methods: {
        async punchEmployee() {

            const validForm = await this.$refs.punchForm.validate();
            if (!validForm.valid)
            {
                return;
            }

            getLastPunchFromEmployee(this.punch.barcodeNumber).then(result =>
            {
                if (result.noShift || (result.startTime && result.endTime))
                {

                    this.punch.dateIn = this.toLocale(new Date().toLocaleDateString('en-GB')).date.fullDate;

                    this.punch.startTime = new Date().toLocaleTimeString('en-GB');

                    punchInEmployee(this.punch).then(result =>
                    {
                        if (result)
                        {
                            this.dialogPunchIn = true;
                            this.punch.barcodeNumber = null;
                            this.isWrongBarcode = false;
                            this.wrongBarcodeMessage = null;
                            setTimeout(this.closeAllDialog, 2500);
                        }
                    }).catch(err =>
                    {
                        console.error(err);
                        this.isWrongBarcode = true;
                        this.wrongBarcodeMessage = err.message;
                    });
                }
                if (result.startTime && !result.endTime)
                {

                    this.punch.dateIn = this.toLocale(result.dateIn).date.fullDate;
                    this.punch.startTime = result.startTime;
                    this.punch.dateOut = this.toLocale(new Date().toLocaleDateString('en-GB')).date.fullDate;
                    this.punch.endTime = new Date().toLocaleTimeString('en-GB');

                    punchOutEmployee(this.punch).then(result =>
                    {
                        if (result)
                        {
                            this.dialogPunchOut = true;
                            this.punch.barcodeNumber = null;
                            setTimeout(this.closeAllDialog, 2500);
                        }
                    }).catch(err =>
                    {
                        console.error(err);
                        alert(err.message);
                    });
                }
            }).catch(err =>
            {
                console.error(err);
                alert(err.message);
            });
        },
        // convertToTimeObject(timeStr) {
        //     const match = timeStr.match(/(\d+)\sh\s(\d+)\smin\s(\d+)\ss/);

        //     if (match) {
        //         return {
        //             hours: parseInt(match[1], 10),
        //             minutes: parseInt(match[2], 10),
        //             seconds: parseInt(match[3], 10),
        //             fullTime: match[1] + ":" + match[2] + ":" + match[3]
        //         }
        //     } else {
        //         console.error("Invalid time string format.");
        //     }
        // },
        closeAllDialog()
        {
            this.dialogPunchIn = false;
            this.dialogPunchOut = false;
        }
    },
    beforeDestroy()
    {
        // prevent memory leak
        clearInterval(this.interval);
    },
    created()
    {
        // update the time every second
        this.interval = setInterval(() =>
        {
            // Concise way to format time according to system locale.
            // In my case this returns "3:48:00 am"
            this.time = Intl.DateTimeFormat(navigator.language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format()
        }, 1000)
    },
    mounted()
    {
        if (!operationSession.isActive)
        {
            this.$router.push('/operation');
        }
        this.time = Intl.DateTimeFormat(navigator.language, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format()
    },
    computed: {
        disablePunchButton()
        {
            return !this.punch.barcodeNumber;
        }
    }
}
</script>

<style scoped>
#clock {
    font-family: 'Share Tech Mono', monospace;
    color: #000000;
    text-align: center;
    left: 50%;
    color: #b11616;
    text-shadow: 0 0 20px rgb(192, 42, 42), 0 0 20px rgba(212, 241, 29, 0);

    .time {
        letter-spacing: 0.05em;
        font-size: 90px;
    }
}
</style>