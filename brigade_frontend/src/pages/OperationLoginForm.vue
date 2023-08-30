<template>
Operation Login
</template>

<script>
import operationSession from "../sessions/OperationSession"

export default {

  data()
  {
    return {
      operationSession: operationSession
        }
  },
  mounted() {
    if (operationSession.isActive) {
        this.$router.push('/operation/punch');
    }
  }
};
</script>