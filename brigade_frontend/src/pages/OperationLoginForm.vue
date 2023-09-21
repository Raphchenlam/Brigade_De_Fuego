<template>
  <div class="boxed-center-large mt-16">
    <v-sheet class="ma-2" max-width="80rem">
      <v-form @submit.prevent="unlockOperationSession" validate-on="submit lazy" ref="loginform">
        <p v-if="warningLoginMessage" class="warning-message">Vous devez être un gestionnaire pour débloquer l'accès à
          l'espace OPERATION </p>
        <p v-if="warningLenghtMessage" class="warning-message">Le numéro doit avoir 16 chiffres pour être valide</p>
        <p v-if="warningNumberMessage" class="warning-message">Le numéro ne peut pas comporter de lettre(s)</p>
        <v-row class="my-5">
          <v-text-field autofocus :counter="16" v-model="loginNumber"
            label="Scanner votre carte gestionnaire"></v-text-field>
        </v-row>
        <DarkRedButton type="submit" class="ml-5" height="4rem" textbutton="DÉBLOQUER ESPACE OPÉRATION"
          :disabled="!loginNumber"></DarkRedButton>
      </v-form>
    </v-sheet>
    <p>P.S Les seuls numéros qui permettent de débloquer présentement est le : 3998765498762980 ou 1999199919991999</p>
  </div>
</template>

<script>
import DarkRedButton from "../components/Reusable/DarkRedButton.vue";
import operationSession from "../sessions/OperationSession"
import { getEmployeeByBarcodeNumber } from "../services/EmployeeService";

export default {

  data() {
    return {
      warningNumberMessage: false,
      warningLenghtMessage: false,
      warningLoginMessage: false,
      loginNumber: '',
    };
  },
  methods: {
    unlockOperationSession() {
      this.warningNumberMessage = isNaN(this.loginNumber) ? true : false;
      this.warningLengthMessage = this.loginNumber.length !== 16 ? true : false;
      this.warningLoginMessage = false;

      getEmployeeByBarcodeNumber(this.loginNumber).then(employee => {
        if (employee && (employee.isAdmin || employee.isSuperAdmin)) {
          console.log("login employee", employee);
          operationSession.unlock(employee);
          this.warningLoginMessage = false;
          this.$router.push('/operation/punch');
        } else {
          this.warningLoginMessage = true;
        }
      }).catch(err => {
        this.warningLoginMessage = true;
      });
    }
  },
  mounted() {
    if (operationSession.isActive) {
      this.$router.push('/operation/punch');
    }
  },
  components: { DarkRedButton }
};
</script>
