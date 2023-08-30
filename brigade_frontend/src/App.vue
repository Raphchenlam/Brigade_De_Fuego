<template>
  <v-app>
    <OperationMenu
      v-if="$route.fullPath.split('/').slice(1)[0] == 'operation' && ($route.fullPath.split('/').slice(1)[1] || operationSession.isActive == true)">
    </OperationMenu>
    <EspaceMenu
      v-if="$route.fullPath.split('/').slice(1)[0] == 'espace' && userSession.user"
      :username=userSession.user.name
      >
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
