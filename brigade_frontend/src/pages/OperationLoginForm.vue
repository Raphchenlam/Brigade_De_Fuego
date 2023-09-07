<template>
  <div class="boxed-center-large">
    <v-sheet class="ma-2" max-width="80rem">
      <v-form @submit.prevent="unlockOperationSession" validate-on="submit lazy" ref="loginform">

        <div>
          <p>LESPACE OPERATION NE PEUX ETRE DEBLOQUER QUE PAR UN GESTIONNAIRE</p>
          <p>(pour le test, pas obliger de rentrer un numero pour debloquer)</p>
        </div>
        <v-text-field v-model="adminNumber" label="Scanner votre carte gestionnaire"></v-text-field>
        <DarkRedButton type="submit" class="ml-5" height="4rem" textbutton="DEBLOQUER LESPACE OPERATION"></DarkRedButton>
      </v-form>
    </v-sheet>
  </div>
</template>

<script>
import DarkRedButton from "../components/Reusable/DarkRedButton.vue";
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
  },
  components: { DarkRedButton }
};
</script>