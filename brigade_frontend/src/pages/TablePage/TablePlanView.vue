<template>
Plan de salle
    
</template>


<script>
import OperationMenu from '../../components/OperationMenu.vue';
import operationSession from "../../sessions/OperationSession"

    export default {
        name: 'TablePlanView',
        components : {
            OperationMenu
        },
        data()
  {
    return {
      operationSession: operationSession
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