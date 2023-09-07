<template>
    <v-btn :class="class" color="#8b0000" width=40% :height="height" elevation="4" rounded="lg" :text="textbutton">
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