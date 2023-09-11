<template>
    <Icon size="75" type="mdi" :path="path"></Icon>
</template>


<script>

import Icon from '@jamescoyle/vue-icon';
import { mdiCalendarOutline } from '@mdi/js';
export default {
    name: "edit-black-button",
    components: {
		Icon
    },
    data() {
		return {
	  		path: mdiCalendarOutline,
		}
	}
}
</script>