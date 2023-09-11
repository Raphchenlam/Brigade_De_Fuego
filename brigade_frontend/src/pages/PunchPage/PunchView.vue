<template>
    <v-row class="justify-center">
        <v-sheet width="70%" class="pa-16">
            <v-form @submit.prevent="punch" class="pa-10" validate-on="submit lazy" ref="punchForm">
                <v-text-field autofocus v-model="employeeBarcodeNumber" height="20px" class="mb-16"
                    label="Scanner votre carte employe">
                </v-text-field>
                <v-row class="justify-space-around">
                    <DarkRedButton textbutton="EFFACER" class="ml-5 h- w-25" height="8rem"></DarkRedButton>
                    <DarkRedButton type="submit" textbutton="PUNCHER" class="ml-5 w-25" height="8rem"></DarkRedButton>
                </v-row>
            </v-form>
        </v-sheet>
    </v-row>
</template>
    
    
<script>
import OperationMenu from '../../components/OperationMenu.vue';
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue';
import operationSession from "../../sessions/OperationSession"


export default {
    name: 'PunchView',
    components: {
        OperationMenu,
        DarkRedButton
    },
    data()
    {
        return {
            operationSession: operationSession,
            employeeBarcodeNumber: null
        }
    },
    methods: {
        punch()
        {
            console.log("PUNCH TIME");
            this.employeeBarcodeNumber = null;
        }
    },
    mounted()
    {
        if (!operationSession.isActive)
        {
            this.$router.push('/operation');
        }
    }
}
</script>