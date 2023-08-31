<template>
<p>Dashboard</p>


</template>



<script>
import userSession from "../sessions/UserSession"

export default {
    components: {
        userSession,
    },
mounted()
    {
        if (!userSession.user)
        {
            this.$router.push('/espace');
        }
    }
}

</script>