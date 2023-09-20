<template>
    <v-btn color="red" height="30px" elevation="4" >
        <svg-icon type="mdi" :path="path"></svg-icon>
    </v-btn>
</template>
  
<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiTrashCanOutline } from '@mdi/js';

export default {
    name: "my-component",
    components: {
        SvgIcon
    },
    data() {
        return {
            path: mdiTrashCanOutline,
        }
    }
}
</script>

<style scoped>

.v-btn {
  min-width: 0;
}

</style>