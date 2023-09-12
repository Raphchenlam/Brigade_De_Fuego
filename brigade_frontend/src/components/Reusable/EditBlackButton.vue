<template>
    <v-btn color="black" rounded="lg" height="60" width="60">
        <svg-icon size="40" type="mdi" :path="path"></svg-icon>
    </v-btn>
</template>


<script>

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAccountEditOutline } from '@mdi/js';
export default {
    name: "edit-black-button",
    components: {
		SvgIcon
    },
    data() {
		return {
	  		path: mdiAccountEditOutline,
		}
	}
}
</script>