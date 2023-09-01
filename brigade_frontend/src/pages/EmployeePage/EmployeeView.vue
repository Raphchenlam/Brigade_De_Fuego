<template>
    <v-row class="mx-5 justify-space-between">
        <EmployeeList></EmployeeList>
        <EmployeeInformation></EmployeeInformation>
    </v-row>
</template>

<script>

import EmployeeList from "./EmployeeList.vue"
import EmployeeInformation from "./EmployeeInformation.vue"

export default {
    components: {
        EmployeeList,
        EmployeeInformation
    }

}
</script>