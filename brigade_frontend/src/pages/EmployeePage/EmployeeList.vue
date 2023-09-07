<template>
    <v-sheet width="100%" max-width="30%" height="auto" class="ma-2">
        <v-text-field @input="loadEmployees" v-model="search" hide-details placeholder="Search name..."
            class="ma-2"></v-text-field>
        <v-select class="mx-16" v-model="roleShowed" label="Poste" :items="roleList"></v-select>

        <v-card class="mx-auto" max-height="400" max-width="800">
            <v-list v-model:selected='selected' :items="employeeList" item-title="listInformation"
                item-value="employeeNumber">
            </v-list>
        </v-card>

        <v-dialog v-model="dialogNewEmployee" width="50%">
            <template v-slot:activator="{ props }">
                <div class="ma-2 text-center">
                    <v-btn color="black" v-bind="props">
                        Ajouter un nouvel employe
                    </v-btn>
                </div>
            </template>
            <v-card>
                <v-card-title>
                    Créer un nouvel employé
                </v-card-title>
                <NewEmployeeForm></NewEmployeeForm>
            </v-card>
        </v-dialog>
    </v-sheet>
</template>

  
<script>
import NewEmployeeForm from "../EmployeePage/NewEmployeeForm.vue"
import { getAllEmployees, getAllEmployeesByRole, getAllRoles } from "../../services/EmployeeService";

export default {
    inject: [
        'loadEmployeeNumber'
    ],
    components: {
        NewEmployeeForm
    },
    data()
    {
        return {
            search: "",
            selected: [],
            employeeList: [],
            roleList: [],
            roleShowed: "Tous",
            dialogNewEmployee: false,
        };
    },
    provide()
    {
        return {
            closeNewEmployeeDialog: this.closeNewEmployeeDialog,
        };
    },
    methods: {
        loadEmployees()
        {
            this.employeeList = [];
            getAllEmployees().then(allEmployees =>
            {
                allEmployees.forEach(employee =>
                {
                    if (employee.firstName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                        || employee.lastName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0)
                    {
                        if (this.roleShowed == "Tous")
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
                    }
                });
            }).catch(err =>
            {
                console.error(err);
            });
        },
        loadEmployeesByRole()
        {
            this.employeeList = [];
            getAllEmployeesByRole(this.roleShowed).then(allEmployees =>
            {
                console.log("AllEMPLOYEE BY ROLE ", allEmployees);
                allEmployees.forEach(employee =>
                {
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
            }).catch(err =>
            {
                console.error(err);
            });
        },

        closeNewEmployeeDialog()
        {
            this.dialogNewEmployee = false;
        },
    },
    watch: {
        roleShowed()
        {
            if (this.roleShowed != "Tous")
            {
                console.log("WATCH-1")
                this.loadEmployeesByRole();
            }
            else
            {
                console.log("WATCH-2")
                this.loadEmployees();
            }
            this.selected = [];

        },
        selected()
        {
            console.log("Selection changer", this.selected[0]);
            this.loadEmployeeNumber(this.selected[0]);
        }
    },
    mounted()
    {
        this.roleList.push("Tous");
        this.loadEmployees();
        getAllRoles().then(allRoles => {
            console.log("ALLROLES", allRoles)
            allRoles.forEach(role => {
                this.roleList.push(role.name);
            });
        }).catch(err => {
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
}</style>