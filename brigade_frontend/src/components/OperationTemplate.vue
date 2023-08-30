<template>

    <OperationMenu @change-view="changeView"></OperationMenu>
    <component :is="currentView" />
    <router-view></router-view>

</template>

<script>
import OperationMenu from "../components/OperationMenu.vue"

export default {
  components: {
    OperationMenu
  },
  data() {
    return {
      currentView: 'PunchView', 
    };
  },
  methods: {
    changeView(newView) {
      this.currentView = newView;
    },
  },
};
</script>
