<template>
  <v-app>
    <OperationMenu
      v-if="$route.fullPath.split('/').slice(1)[0] == 'operation' && ($route.fullPath.split('/').slice(1)[1] || operationSession.isActive == true)">
    </OperationMenu>
    <EspaceMenu v-if="$route.fullPath.split('/').slice(1)[0] == 'espace' && userSession.user">
    </EspaceMenu>
    <v-main>
      {{ $route.fullPath.split('/').slice(1)[0] }}
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import operationSession from "./sessions/OperationSession"
import userSession from "./sessions/UserSession"

import OperationMenu from "./components/OperationMenu.vue"
import EspaceMenu from "./components/DesktopMenu.vue"

export default {
  components: {
    OperationMenu,
    EspaceMenu
  },
  data()
  {
    return {
      operationSession: operationSession,
      userSession: userSession
    }
  }
};
</script>

<style>
.boxed-center {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 40%;
  max-width: 80rem;
}

.boxed-center-large {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 80%;
  max-width: 80rem;
}
</style>