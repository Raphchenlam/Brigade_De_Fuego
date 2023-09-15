<template>
<AdminDashboard v-if="userSession.employee && userSession.employee.isActive && (userSession.employee.isAdmin || userSession.employee.isSuperAdmin)"></AdminDashboard>
<EmployeeDashboard v-if="userSession.employee && userSession.employee.isActive && !userSession.employee.isAdmin"></EmployeeDashboard>
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
        if (!userSession || !userSession.employee)
        {
            this.$router.push('/espace');
        }
    }
}

</script>