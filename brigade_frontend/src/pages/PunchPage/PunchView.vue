<template>
    <v-row class="justify-center">
        <v-sheet width="70%" class="pa-16">
            <v-form @submit.prevent="punch" class="pa-10" validate-on="submit lazy" ref="punchForm">
                <v-text-field autofocus v-model="employeeBarcodeNumber" height="20px" class="mb-16"
                    label="Scanner votre carte employe">

                </v-text-field>
                <v-row class="justify-space-between">
                    <v-btn class="mr-5" color="#8b0000" width=40% height="8rem" elevation="4" rounded="lg">
                        EFFACER
                    </v-btn>
                    <v-btn type="submit" class="ml-5" color="#8b0000" width=40% height="8rem" elevation="4" rounded="lg">
                        PUNCHER
                    </v-btn>
                </v-row>
            </v-form>
        </v-sheet>
    </v-row>
</template>
    
    
<script>
import OperationMenu from '../../components/OperationMenu.vue';
import operationSession from "../../sessions/OperationSession"


export default {
    name: 'PunchView',
    components: {
        OperationMenu
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