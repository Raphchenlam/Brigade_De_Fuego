<template>
<AdminDashboard v-if="this.isUserAuthorized()"></AdminDashboard>
<EmployeeDashboard v-if="(userSession.employee && userSession.employee.isActive) && !userSession.employee.isAdmin "></EmployeeDashboard>
</template>


<script>
import userSession from "../sessions/UserSession"
import EmployeeDashboard from "./EmployeeDashboard.vue"
import AdminDashboard from "./AdminDashboard.vue"


export default {
  inject:['isUserAuthorized'],
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
        if (!this.userSession)
        {
            this.$router.push('/espace');
        }
    }
}

</script>