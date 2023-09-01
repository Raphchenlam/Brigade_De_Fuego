<template>
<v-list :height="height" scrollable density="compact" :items="leaveList" item-title="showName" item-value="id"></v-list>

</template>

<script>


export default {
props : {
    height : String
},
data() {
    return {
        leaveList: [
        {
                id : 332,
                showName : "25 Decembre 2023 (Accepte)",
                startDate : "2023-12-25",
                endDate: "2023-12-25",
                status: "Accepte",
                category : "Personnel",
                reason : "Noel en famille"
            },
            {
                id : 111,
                showName : "1 Janvier 2024 - 7 Janvier 2024 (En attente)",
                startDate : "2024-01-01",
                endDate: "2024-01-07",
                status: "En attente",
                category : "Vacance",
                reason : null
            },
            {
                id : 443,
                showName : "14 fevrier 2024 (Refuser)",
                startDate : "2024-02-14",
                endDate: "2024-02-14",
                status: "Refusé",
                category : "Personnel",
                reason : "St-Valentin"
            },
            {
                id : 443,
                showName : "14 fevrier 2024 (Refuser)",
                startDate : "2024-02-14",
                endDate: "2024-02-14",
                status: "Refusé",
                category : "Personnel",
                reason : "St-Valentin"
            },
            {
                id : 443,
                showName : "14 fevrier 2024 (Refuser)",
                startDate : "2024-02-14",
                endDate: "2024-02-14",
                status: "Refusé",
                category : "Personnel",
                reason : "St-Valentin"
            }
        ]
    }
}


}

</script>

<style scoped>
/*
.v-list{
  height:100px;
  overflow-y:auto
}
*/


</style>