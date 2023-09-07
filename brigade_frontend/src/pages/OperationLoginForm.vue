<template>
  <div class="boxed-center-large">
    <v-sheet class="ma-2" max-width="80rem">
      <v-form @submit.prevent="unlockOperationSession" validate-on="submit lazy" ref="loginform">
        <p v-if="warningLoginMessage" class="warningLogin">Vous devez être un gestionnaire pour débloquer l'accès à
          l'espace OPERATION </p>
        <p v-if="warningLenghtMessage" class="warningLogin">Le numero doit avoir 16 chiffres pour etre valide</p>
        <p v-if="warningNumberMessage" class="warningLogin">Le numero ne peut pas comporter de lettre</p>
        <v-text-field v-model="loginNumber" label="Scanner votre carte gestionnaire"></v-text-field>
        <DarkRedButton type="submit" class="ml-5" height="4rem" textbutton="DEBLOQUER LESPACE OPERATION"></DarkRedButton>
      </v-form>
    </v-sheet>
    <p>P.S Le seul numero qui permet de debloquer presentement est le : 3998765498762980</p>
  </div>
</template>

<script>
import DarkRedButton from "../components/Reusable/DarkRedButton.vue";
import operationSession from "../sessions/OperationSession"
import { getEmployeeByBarcodeNumber } from "../services/EmployeeService";

export default {
  data()
  {
    return {
      warningNumberMessage: false,
      warningLenghtMessage: false,
      warningLoginMessage: false,
      loginNumber: ''
    };
  },
  methods: {
    unlockOperationSession()
    {
      this.warningNumberMessage = false;
      this.warningLenghtMessage = false;
      this.warningLoginMessage = false;
      if (isNaN(this.loginNumber))
      {
        this.warningNumberMessage = true;
        return;
      }
      if (this.loginNumber.length != 16)
      {
        this.warningLenghtMessage = true;
        return;
      }
      getEmployeeByBarcodeNumber(this.loginNumber).then(employee =>
      {
        if (employee && (employee.isAdmin || employee.isSuperAdmin))
        {
          operationSession.unlock(employee)
          this.warningLoginMessage = false;
          this.$router.push('/operation/punch');
        } else
        {
          this.warningLoginMessage = true;
        }
      });
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

<style scoped>
.warningLogin {
  color: red
}
</style>