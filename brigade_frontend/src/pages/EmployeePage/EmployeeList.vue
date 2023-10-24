<template>
    <v-sheet class="pl-10 py-5">
        <v-card height="600px">
            <v-row class="mb-0">
                <v-text-field v-model="search" hide-details placeholder="Nom à rechercher" class="ma-2"></v-text-field>
                <v-dialog v-model="dialogNewEmployee" width="50%" persistent>
                    <template v-slot:activator="{ props }">
                        <div v-if="$route.fullPath == '/espace/employee'" class="ma-2 text-center">
                            <BlackButton class="h-100 w-100" v-bind="props" textbutton="+"> </BlackButton>
                        </div>
                    </template>
                    <v-card>
                        <v-card-title>
                            Créer un nouvel employé
                        </v-card-title>
                        <NewEmployeeForm></NewEmployeeForm>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-select class="w-50" v-model="roleShowed" label="Poste" :items="roleList"></v-select>

            <v-list v-model:selected='selected' :items="filteredEmployeeList" item-title="listInformation"
                item-value="employeeNumber" class="h-75">
            </v-list>
        </v-card>
    </v-sheet>
</template>

  
<script>
import NewEmployeeForm from "../EmployeePage/NewEmployeeForm.vue"
import { getAllEmployees, getAllEmployeesByRole, getAllRoles } from "../../services/EmployeeService";
import EditBlackButton from "../../components/Reusable/EditBlackButton.vue";
import BlackButton from "../../components/Reusable/BlackButton.vue";

export default {
    inject: ['loadEmployeeNumber'],
    components: {
        NewEmployeeForm,
        EditBlackButton,
        BlackButton
    },
    data()
    {
        return {
            search: "",
            selected: [],
            employeeList: [],
            filteredEmployeeList: [],
            roleList: [],
            roleShowed: "Tous",
            dialogNewEmployee: false,
        };
    },
    provide()
    {
        return {
            closeNewEmployeeDialog: this.closeNewEmployeeDialog,
            loadEmployees: this.loadEmployees,
        };
    },
    methods: {
        filterEmployeeList()
        {
            this.filteredEmployeeList = [];
            this.employeeList.forEach(employee =>
            {
                if (employee.listInformation.toUpperCase().indexOf(this.search.toUpperCase()) >= 0)
                {
                    if (this.roleShowed == "Tous" || this.roleShowed == employee.role)
                    {
                        this.filteredEmployeeList.push(employee);
                    }
                }
            });
        },
        closeNewEmployeeDialogAdmin()
        {
            this.dialogNewEmployee = false;
        },
        loadEmployees()
        {
            this.employeeList = [];
            this.filteredEmployeeList = [];
            getAllEmployees().then(allEmployees =>
            {
                allEmployees.forEach(employee =>
                {
                    if ((this.$route.fullPath.split('/').slice(1)[1] == 'schedule' && employee.isActive)
                    || (this.$route.fullPath.split('/').slice(1)[1] == 'leave' && employee.isActive)
                        || (this.$route.fullPath.split('/').slice(1)[1] == 'employee'))
                    {
                        const newEmployee = {
                            "listInformation": employee.employeeNumber + " - " + employee.firstName + " " + employee.lastName + " (" + employee.role + ")",
                            "employeeNumber": employee.employeeNumber,
                            "firstName": employee.firstName,
                            "lastName": employee.lastName,
                            "role": employee.role,
                            props: {
                                color: 'red',
                            },
                        };
                        this.employeeList.push(newEmployee);
                    }
                });
                this.filteredEmployeeList = this.employeeList;
            }).catch(err =>
            {
                console.error(err);
            });
        },
        closeNewEmployeeDialog() {
            this.dialogNewEmployee = false;
        },
    },
    watch: {
        roleShowed()
        {
            this.filterEmployeeList();
        },
        selected()
        {
            if(this.selected != []) {
                this.loadEmployeeNumber(this.selected[0]);
            }
        },
        search()
        {
            this.filterEmployeeList();
        },
    },
    mounted()
    {
        this.roleList.push("Tous");
        this.loadEmployees();
        getAllRoles().then(allRoles =>
        {
            allRoles.forEach(role =>
            {
                this.roleList.push(role.name);
            });
        }).catch(err =>
        {
            console.error(err);
        });
    },
}
</script>


<style scoped>
.v-list {
    height: 400px;
    /* or any height you want */
    overflow-y: auto
}
</style>