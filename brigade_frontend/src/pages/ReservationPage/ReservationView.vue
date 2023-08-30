<template>
    Reservation
        
    </template>
    
    
    <script>
    import OperationMenu from '../../components/OperationMenu.vue';
    import operationSession from "../../sessions/OperationSession"

        export default {
            name: 'ReservationView',
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