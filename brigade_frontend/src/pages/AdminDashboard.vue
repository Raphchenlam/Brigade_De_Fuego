<template>
    Admin Dashboard
    <v-container>
        <v-row>
            <v-col cols="12" md="6" lg="6">
                <NextShift />
            </v-col>
            <v-col cols="12" md="6" lg="6">
                <CurrentLeave />
            </v-col>
            <v-col cols="12" sm="6" lg="4">
                <v-card height="20rem">
                    <v-row class="justify-center ma-5">
                        <p style="font-size: 28px;font-weight: bold;text-align: center;">DEMANDE DE CONGÉS EN ATTENTE</p>
                        <div>
                            <p class="ma-5" style="font-size: 45px;font-weight: bold;text-align: center;">6</p>
                        </div>
                    </v-row>
                    <v-row class="justify-center ma-5">
                        <router-link to="/espace/leave"  @click="displayDrawer = false" style="text-decoration: none; color: inherit;"><BlackButton textbutton="Voir les demandes en attente"></BlackButton></router-link>
                        
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" ms="6" lg="4">
                <v-card height="20rem">
                    fsd
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
                <v-card height="20rem">
                    fsd
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
                <v-card height="20rem">
                    fsd
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import NextShift from './NextShift.vue'
import CurrentLeave from './LeavePeage/CurrentLeave.vue'
import BlackButton from '../components/Reusable/BlackButton.vue';

export default {
    components: {
        NextShift,
        CurrentLeave,
        BlackButton
    }
}
</script>