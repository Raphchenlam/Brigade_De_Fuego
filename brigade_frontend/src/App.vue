<template>
  <v-app>
    <OperationMenu
      v-if="$route.fullPath.split('/').slice(1)[0] == 'operation' && ($route.fullPath.split('/').slice(1)[1] || operationSession.isActive == true)">
    </OperationMenu>
    <EspaceMenu v-if="$route.fullPath.split('/').slice(1)[0] == 'espace' && userSession.user">
    </EspaceMenu>
    <v-main>
      <router-view class="my-5"></router-view>
    </v-main>
  </v-app>
</template>

<script>

import operationSession from "./sessions/OperationSession"
import userSession from "./sessions/UserSession"

import OperationMenu from "./components/OperationMenu.vue"
import EspaceMenu from "./components/DesktopMenu.vue"

export default {
  provide() {
    return {
      capitalizeWords: this.capitalizeWords,
      formatPhoneNumber: this.formatPhoneNumber
    }
  },
  components: {
    OperationMenu,
    EspaceMenu
  },
  data() {
    return {
      operationSession: operationSession,
      userSession: userSession
    }
  },
  methods: {
    capitalizeWords(inputString) {
      if (!!inputString) {

        const words = inputString
          .replace(/-+/g, '-')
          .replace(/[^a-zA-Z\s-]/g, '')
          .replace(/\s+/g, ' ')
          .split(' ')
          .map(word => {
            const parts = word.split('-');
            const capitalizedParts = parts.map(part => {
              return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            });
            return capitalizedParts.join('-');
          });

        return words
          .join(' ')
          .replace(/-\s+/g, '-')
          .replace(/\s+-/g, '-')
          .trim()
          .replace(/^-+|-+$/g, '')
          .replace(/[^a-zA-Z]-[^a-zA-Z]/g, '');
      };

    },
    formatPhoneNumber(phoneNumber) {
      if (!!phoneNumber) {

        const cleanedNumber = phoneNumber.replace(/\D/g, '');

        if (cleanedNumber.length === 10) {
          return cleanedNumber.slice(0, 3) + '-' + cleanedNumber.slice(3, 6) + '-' + cleanedNumber.slice(6);
        } else {
          return phoneNumber;
        }
      };
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