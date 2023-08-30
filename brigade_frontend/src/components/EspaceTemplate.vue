<template>
  <v-app>
    <DesktopMenu></DesktopMenu>
    <v-main>
   
    <router-view></router-view>
</v-main>
  </v-app>
</template>

<script>
import DesktopMenu from './DesktopMenu.vue';

export default {
  components: {
    DesktopMenu
  }
};
</script>
