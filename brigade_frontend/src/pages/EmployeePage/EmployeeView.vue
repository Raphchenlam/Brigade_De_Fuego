<template>
    <v-sheet v-if="userSession.user">
        <v-row class="mx-5 justify-space-between">
            <EmployeeList v-if="userSession.user.isAdmin"></EmployeeList>
            <EmployeeInformation v-if="selectedEmployeeNumber" :employeeNumber="selectedEmployeeNumber">
            </EmployeeInformation>
        </v-row>
    </v-sheet>
    <v-sheet v-else>
        <v-row class="m-10 justify-center">
            <h1>Vous devez etre connecter pour avoir acces a cette page</h1>
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
        if (!userSession.user)
        {
            this.$router.push('/espace');
        }
    }
}
</script>