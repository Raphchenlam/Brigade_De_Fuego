<template>
    <v-sheet v-if="userSession">
        <v-row class="justify-space-between" v-if="this.isUserAuthorized()">
            <v-col cols="12" md="6" lg="4">
                <EmployeeList v-if="this.isUserAuthorized()" class="h-100 mr-5"></EmployeeList>
            </v-col>
            <v-col cols="12" md="6" lg="8">
                <EmployeeInformation v-if="selectedEmployeeNumber" :employeeNumber="selectedEmployeeNumber" class="h-100">
            </EmployeeInformation>
            </v-col>
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
    inject:['isUserAuthorized'],
    components: {
        EmployeeList,
        EmployeeInformation
    },
    data() {
        return {
            userSession: userSession,
            selectedEmployeeNumber: null,
            loading: true
        }
    },
    methods: {
        loadEmployeeNumber(employeeNumber) {
            this.selectedEmployeeNumber = employeeNumber
        }
    },
    provide() {
        return {
            loadEmployeeNumber: this.loadEmployeeNumber,
        };
    },
    created() {
        
        if (!userSession.employeeNumber && !userSession.password) {
            this.$router.push('/espace');
        }
    },
}
</script>