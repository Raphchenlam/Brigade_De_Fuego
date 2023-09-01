<template>
    <v-sheet width="30%" height="auto" class="ma-2">
        <v-text-field @input="loadEmployees" v-model="search" hide-details placeholder="Search name..."
            class="ma-2"></v-text-field>
        <v-select class="mx-16" v-model="roleShowed" label="Poste" :items="roleList"></v-select>

        <v-card class="mx-auto" max-height="400" max-width="800">
            <v-list v-model:selected='selection' :items="employeeList" item-title="listInformation"
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
                    Creer un nouvel employe
                </v-card-title>
                <NewEmployeeForm></NewEmployeeForm>
            </v-card>
        </v-dialog>
    </v-sheet>
</template>

  
<script>
import NewEmployeeForm from "../EmployeePage/NewEmployeeForm.vue"

export default {
    components: {
        NewEmployeeForm
    },
    data()
    {
        return {
            search: "",
            selection: [],
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
            // liste temporaire demployee
            const allEmployees = [
                {
                    listInformation: "1111 - Maxime Marchand",
                    employeeNumber: 1111,
                    firstName: "Maxime",
                    lastName: "Marchand",
                    role: "Serveur",
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "2222 - Francis Maynard",
                    employeeNumber: 2222,
                    firstName: "Francis",
                    lastName: "Maynard",
                    role: "Bussboy",
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "3333 - David Beaudry",
                    employeeNumber: 3333,
                    firstName: "David",
                    lastName: "Beaudry",
                    role: "Serveur",
                    props: {
                        color: 'red',
                    },
                },
                {
                    listInformation: "4444 - Raphael Chenard Lamothe",
                    employeeNumber: 4444,
                    firstName: "Raphael",
                    lastName: "Chenard Lamothe",
                    role: "Hotesse",
                    props: {
                        color: 'red',
                    },
                },
            ];
            this.employeeList = [];
            allEmployees.forEach(employee =>
            {
                if (employee.firstName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0
                    || employee.lastName.toUpperCase().indexOf(this.search.toUpperCase()) >= 0)
                {
                    if (this.roleShowed == "Tous")
                    {
                        this.employeeList.push(employee);
                    } else { }
                    //faire une fonction qui permet de seulement ajouter les event que son attribut eventType == this.eventTypeShowed au eventList
                }
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
            this.loadEmployees();
            this.selection = "";
        },
        selection()
        {
            console.log("Selection changer");
        }
    },
    mounted()
    {
        this.roleList = ["Tous", "Serveur", "Bussboy", "Hotesse"];
        this.loadEmployees();
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