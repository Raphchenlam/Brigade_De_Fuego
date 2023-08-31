<template>
  <div class="boxed-center-large">
    <v-sheet class="ma-2" max-width="80rem">
      <v-form @submit.prevent="unlockOperationSession" validate-on="submit lazy" ref="loginform">

        <div>
          <p>LESPACE OPERATION NE PEUX ETRE DEBLOQUER QUE PAR UN GESTIONNAIRE</p>
        </div>
        <v-text-field v-model="adminNumber" label="Scanner votre carte gestionnaire"></v-text-field>
        <v-btn type="submit" class="ml-5" color="#8b0000" width=40% height="4rem" elevation="4" rounded="lg">
          DEBLOQUER LESPACE OPERATION
        </v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<script>
import operationSession from "../sessions/OperationSession"

export default {
  data()
  {
    return {
      adminNumber: ''
    };
  },
  methods: {
    unlockOperationSession()
    {
      operationSession.adminNumber = this.adminNumber;
      operationSession.isActive = true;
      this.$router.push('/operation/punch');
    }
  },
  mounted()
  {
    if (operationSession.isActive)
    {
      this.$router.push('/operation/punch');
    }
  }
};
</script>