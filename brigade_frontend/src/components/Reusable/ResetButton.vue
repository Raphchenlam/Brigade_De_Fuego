<template>
    <v-btn color="grey" class="rounded-pill" height="40px" elevation="4" >
        <svg-icon type="mdi" :path="path"></svg-icon>
    </v-btn>
</template>
  
<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiRestore } from '@mdi/js';

export default {
    name: "my-component",
    components: {
        SvgIcon
    },
    data() {
        return {
            path: mdiRestore,
        }
    }
}
</script>