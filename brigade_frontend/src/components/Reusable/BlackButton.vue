<template>
    <v-btn :class="class" color="black" elevation="4" rounded="lg" :text="textbutton">
    </v-btn>
</template>


<script>
export default {
    props: {
        class: String,
        textbutton: String,
        height: String,
    }
}
</script>