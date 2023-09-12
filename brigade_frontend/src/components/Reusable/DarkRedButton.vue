<template>
    <v-btn :class="class" :height="height" color="#8b0000" elevation="4" rounded="lg" :text="textbutton">
    </v-btn>
</template>
    
    
<script>
export default {
    props: {
        class: String,
        textbutton: String,
        height: String
    }
}
</script>