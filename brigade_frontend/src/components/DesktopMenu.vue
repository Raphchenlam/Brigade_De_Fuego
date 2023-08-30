<template>
  <v-navigation-drawer color="#8b0000" theme="dark" permanent>
    <p class="ma-5">Bonjour, {{ username }}</p>


    <v-list v-if="userSession.isAdmin" color="red">
      <router-link style="text-decoration: none; color: inherit;" to="/espace/dashboard"><v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"
          value="Dashboard"></v-list-item></router-link>
      <router-link :to="employeeDetailUrl" style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-account-box" title="Mes informations"
          value="Mes informations"></v-list-item></router-link>
      <router-link style="text-decoration: none; color: inherit;" to="/espace/leave"><v-list-item prepend-icon="mdi-gavel" title="Admin"
          value="admin"></v-list-item></router-link>
    </v-list>

    <v-list v-else color="red">
      <router-link style="text-decoration: none; color: inherit;" to="/espace/dashboard"><v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard"
          value="Dashboard"></v-list-item></router-link>
      <router-link :to="employeeDetailUrl" style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-account-box" title="Mes informations"
          value="Mes informations"></v-list-item></router-link>
      <router-link style="text-decoration: none; color: inherit;" to="/espace/leave"><v-list-item prepend-icon="mdi-gavel" title="Mes congés"
          value="Mes conges"></v-list-item></router-link>
    </v-list>



    <template v-slot:append>
      <div class="pa-2">
        <v-btn @click="disconnect()" color="black" block>
          Se Deconnecter
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import userSession from "../sessions/UserSession"

export default {
  props: {
    username: String
  },
  data() {
    return {
      userSession : userSession
    }
  },
  methods: {
        disconnect() {
            userSession.disconnect()
            this.$router.push('/espace');
        }
    },
  computed: {
        employeeDetailUrl() {
            return "/espace/employees/" + userSession.user.name;
        },
    }
};

</script>