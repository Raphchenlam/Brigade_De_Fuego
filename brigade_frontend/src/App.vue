<template>
  <v-app>
    <h1>Hello World!</h1>
    <v-main>
    <v-data-table-server
      v-model="selected"
      :headers="headers"
      :items-length="employees.length"
      :items="employees"
      :loading="loading"
      :search="search"
      class="elevation-1"
      item-value="employeeNumber"
      @update:options="loadEmployees"
      show-select
    >
    </v-data-table-server>
    <router-view></router-view>
</v-main>
  </v-app>
</template>

<script>
import { VDataTable } from "vuetify/labs/VDataTable";

import { fetchEmployee } from "../src/services/EmployeeService";

export default {
  components: {
    VDataTable,
  },
  data() {
    return {
      selected: "",
      name: "",
      loading: false,
      totalItems: 0,
      search: "",
      employees: [],
      headers: [
        {
          align: "start",
          key: "employeeNumber",
          sortable: false,
          title: "Numero Employe",
          width: "10%",
        },
        {
          key: "firstName",
          sortable: false,
          title: "Prenom",
          width: "45%",
        },
        {
          key: "lastName",
          sortable: false,
          title: "Nom de famille",
          width: "45%",
        },
      ],
    };
  },
  methods: {
    loadEmployees() {
      fetchEmployee()
        .then((employees) => {
          this.employees = employees;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    this.loadEmployees();
  },
};
</script>
