<template>
  <v-app-bar>
    <v-app-bar-nav-icon class="hidden-sm-and-up" @click="displayDrawer = !displayDrawer"> </v-app-bar-nav-icon>
    <v-app-bar-title>
      <h6>Del Fuego - Espace Employee</h6>
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn @click="disconnect()" icon="mdi-power"></v-btn>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-if="$vuetify.display.smAndUp || displayDrawer == true" width="200" color="#8b0000" theme="dark"
    permanent>
    <p class="ma-5">Bonjour, {{ userSession.employee.firstName }}</p>

    <!-- Menu de l'admin -->
    <v-list v-if="this.isUserAuthorized()" color="red">
      <router-link to="/espace/dashboard" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"></v-list-item></router-link>

      <router-link to="/espace/schedule" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-calendar-outline" title="Horaires" value="schedule"></v-list-item></router-link>

      <router-link to="/espace/employee" @click="displayDrawer = false"
        style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-account-box-outline"
          title="Employes" value="employee"></v-list-item></router-link>

      <router-link to="/espace/event" @click="displayDrawer = false"
        style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-party-popper" title="Evenements"
          value="event"></v-list-item></router-link>

      <router-link to="/espace/leave" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-timer-off-outline" title="Conges" value="leave"></v-list-item></router-link>

      <router-link to="/espace/punch" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-timer-edit-outline" title="Punch" value="punch"></v-list-item></router-link>

      <router-link to="/espace/report" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-chart-bar" title="Rapports" value="report"></v-list-item></router-link>

      <v-divider :thickness="5" class="border-opacity-100 ma-5"></v-divider>


      <router-link to="/operation" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-arrow-left-bold-hexagon-outline" title="OPERATION"
          value="operation"></v-list-item></router-link>
      <router-link :to="employeeDetailUrl" @click="displayDrawer = false"
        style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-account-circle-outline"
          title="Mon profil" value="profil"></v-list-item></router-link>
    </v-list>

    <!-- Menu de l'employee -->
    <v-list v-if="(userSession.employee && userSession.employee.isActive) && !userSession.employee.isAdmin" color="red">
      <router-link to="/espace/dashboard" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-view-dashboard" title="Dashboard" value="Dashboard"></v-list-item></router-link>

      <router-link to="/espace/schedule" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-clock-outline" title="Mon horaire" value="Mon horaire"></v-list-item></router-link>

      <router-link :to="employeeDetailUrlLeave" style="text-decoration: none; color: inherit;"><v-list-item
          prepend-icon="mdi-timer-off-outline" title="Mes congés" value="Mes conges"></v-list-item></router-link>
      <v-divider :thickness="5" class="border-opacity-100 ma-5"></v-divider>
      <router-link :to="employeeDetailUrl" @click="displayDrawer = false"
        style="text-decoration: none; color: inherit;"><v-list-item prepend-icon="mdi-account-circle-outline"
          title="Mon profil" value="profil"></v-list-item></router-link>

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
  inject:['isUserAuthorized'],
  props: {
    username: String,
  },
  data() {
    return {
      userSession: userSession,
      displayDrawer: false
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
      return "/espace/employee/" + userSession.employee.employeeNumber;
    },
    employeeDetailUrlLeave() {
      return "/espace/leave/" + userSession.employee.employeeNumber;
    },
  },
  mounted() {
    if (!userSession) {
      this.$router.push('/espace');
    }
  }
};
</script>

<style>
.routerlink {
  display: block;
  color: rgb(240, 20, 20)
}</style>