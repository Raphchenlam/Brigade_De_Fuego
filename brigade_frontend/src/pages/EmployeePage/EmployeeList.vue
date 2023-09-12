<template>
    <v-sheet class="pl-10 py-5">
        <v-card class="h-100">
            <v-row class="mb-0">
                <v-text-field @input="loadEmployees" v-model="search" hide-details placeholder="Nom a rechercher..."
                    class="ma-2"></v-text-field>
                <v-dialog v-model="dialogNewEmployee" width="50%" persistent>
                    <template v-slot:activator="{ props }">
                        <div class="ma-2 text-center">
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
            <v-list v-model:selected='selected' :items="employeeList" item-title="listInformation"
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
    inject: [
        'loadEmployeeNumber'
    ],
    components: {
        NewEmployeeForm,
        EditBlackButton,
        BlackButton
    },
    data() {
        return {
            search: "",
            selected: [],
            employeeList: [],
            roleList: [],
            roleShowed: "Tous",
            dialogNewEmployee: false,
        };
    },
    provide() {
        return {
            closeNewEmployeeDialog: this.closeNewEmployeeDialog,
            loadEmployees: this.loadEmployees,
        };
    },
    methods: {
        loadEmployees() {
            this.employeeList = [];
            getAllEmployees().then(allEmployees => {
                allEmployees.forEach(employee => {
                    if (employee.firstName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                        || employee.lastName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0) {
                        if (this.roleShowed == "Tous") {
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
                    }
                });
            }).catch(err => {
                console.error(err);
            });
        },
        loadEmployeesByRole() {
            this.employeeList = [];
            getAllEmployeesByRole(this.roleShowed).then(allEmployees => {
                console.log("AllEMPLOYEE BY ROLE ", allEmployees);
                allEmployees.forEach(employee => {
                    if (employee.firstName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                        || employee.lastName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0)
                    {
                        const newEmployee = {
                            "listInformation": employee.employeeNumber + " - " + employee.firstName + " " + employee.lastName,
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
            }).catch(err => {
                console.error(err);
            });
        },
        closeNewEmployeeDialog()
        {
            this.dialogNewEmployee = false;
        },
    },
    watch: {
        roleShowed() {
            if (this.roleShowed != "Tous") {
                console.log("WATCH-1")
                this.loadEmployeesByRole();
            }
            else {
                console.log("WATCH-2")
                this.loadEmployees();
            }
            this.selected = [];

        },
        selected() {
            console.log("Selection changer", this.selected[0]);
            this.loadEmployeeNumber(this.selected[0]);
        }
    },
    mounted() {
        this.roleList.push("Tous");

        this.loadEmployees();

        getAllRoles().then(allRoles => {
            console.log("ALLROLES", allRoles)
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