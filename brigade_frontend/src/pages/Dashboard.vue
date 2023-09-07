<template>
<AdminDashboard v-if="userSession.user && userSession.user.isAdmin"></AdminDashboard>
<EmployeeDashboard v-else></EmployeeDashboard>


</template>



<script>
import userSession from "../sessions/UserSession"
import EmployeeDashboard from "./EmployeeDashboard.vue"
import AdminDashboard from "./AdminDashboard.vue"


export default {
    components: {
        EmployeeDashboard,
        AdminDashboard
    },
    data()
  {
    return {
      userSession: userSession
    }
  },
mounted()
    {
        if (!userSession || !userSession.user)
        {
            this.$router.push('/espace');
        }
    }
}

</script>