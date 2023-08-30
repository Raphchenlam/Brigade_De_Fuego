<template>
<div class="text-right">
        <v-btn align-left @click="disconnect()" color="black" width="150px" class="mx-5 mt-5">DECONNEXION</v-btn>
    </div>
    <div class="d-flex justify-space-around pa-2">
        <router-link to="/operation/punch"> <v-btn width="20rem" height=" 60px" color="#8b0000"> Punch </v-btn></router-link>
        <router-link to="/operation/plansalle"><v-btn width="20rem" height=" 60px" color="#8b0000"> Plan de salle
        </v-btn></router-link>
        <router-link to="/operation/reservation"><v-btn width="20rem" height=" 60px" color="#8b0000"> Reservation
        </v-btn></router-link>
        <router-link to="/operation/client"><v-btn width="20rem" height=" 60px" color="#8b0000"> Clients </v-btn></router-link>
    </div>

</template> 

<script>
import operationSession from '../sessions/OperationSession'

export default {
data() {
    return {
        operationSession: operationSession
    }
},
    methods: {
        disconnect() {
            operationSession.disconnect()
            this.$router.push('/operation');
        }
    },
}
</script>

<style scoped></style>