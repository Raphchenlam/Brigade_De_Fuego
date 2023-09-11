<template>
    <svg-icon size="75" type="mdi" :path="path"></svg-icon>
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