<template>
  <v-navigation-drawer width="200" color="#8b0000" theme="dark" permanent>
    <p class="ma-5">Bonjour, {{ userSession.user.firstName }}</p>

    <!-- Menu de l'admin -->
    <v-list v-if="userSession.user.isAdmin" color="red">
      <router-link to="/espace/dashboard" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"></v-list-item></router-link>

      <router-link to="/espace/schedule" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-account-box" title="Horaires" value="schedule"></v-list-item></router-link>

      <router-link to="/espace/employee" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-account-box" title="Employes" value="employee"></v-list-item></router-link>

      <router-link to="/espace/event" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-account-box" title="Evenements" value="event"></v-list-item></router-link>

      <router-link to="/espace/leave" style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-gavel"
          title="Conges" value="leave"></v-list-item></router-link>

      <router-link to="/espace/punch" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-account-box" title="Punch" value="punch"></v-list-item></router-link>

      <router-link to="/espace/report" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-gavel" title="Rapports" value="report"></v-list-item></router-link>

      <v-divider :thickness="5" class="border-opacity-100 ma-5"></v-divider>


      <router-link to="/operation" style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-gavel"
          title="OPERATION" value="operation"></v-list-item></router-link>
    </v-list>

    <!-- Menu de l'employee -->
    <v-list v-else color="red">
      <router-link to="/espace/dashboard" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-view-dashboard" title="Dashboard" value="Dashboard"></v-list-item></router-link>

      <router-link to="/espace/leave" style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-gavel"
          title="Mes congés" value="Mes conges"></v-list-item></router-link>
    </v-list>

    <template v-slot:append>
      <router-link :to="employeeDetailUrl" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-account-box" title="Mon profil" value="profil"></v-list-item></router-link>
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
  data()
  {
    return {
      userSession: userSession
    }
  },
  methods: {
    disconnect()
    {
      userSession.disconnect()
      this.$router.push('/espace');
    }
  },
  computed: {
    employeeDetailUrl()
    {
      return "/espace";
    },
  }
};

</script>