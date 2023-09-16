<template>
    <v-sheet v-if="(userSession.employee && userSession.employee.isActive) && (userSession.employee.isAdmin || userSession.employee.isSuperAdmin)">
        <v-row class="justify-space-between">
            <EmployeeList v-if="(userSession.employee && userSession.employee.isActive) && (userSession.employee.isAdmin || userSession.employee.isSuperAdmin)" class="h-screen" width="35%"></EmployeeList>
            <EmployeeInformation v-if="selectedEmployeeNumber" :employeeNumber="selectedEmployeeNumber" class="h-screen" width="65%">
            </EmployeeInformation>
        </v-row>
    </v-sheet>
    <v-sheet v-else>
        <v-row class="m-10 justify-center">
            <h1>Vous devez être connecté et avoir les droits administrateurs pour avoir accès à cette page</h1>
        </v-row>
    </v-sheet>
</template>

<script>
import userSession from "../../sessions/UserSession"
import EmployeeList from "./EmployeeList.vue"
import EmployeeInformation from "./EmployeeInformation.vue"

export default {
    components: {
        EmployeeList,
        EmployeeInformation
    },
    data()
    {
        return {
            userSession: userSession,
            selectedEmployeeNumber: null,
        }
    },
    methods: {
        loadEmployeeNumber(employeeNumber)
        {
            this.selectedEmployeeNumber = employeeNumber
        }
    },
    provide()
    {
        return {
            loadEmployeeNumber: this.loadEmployeeNumber
        };
    },
    mounted()
    {
        if (!userSession)
        {
            this.$router.push('/espace/dashboard');
        }
    }
}
</script>