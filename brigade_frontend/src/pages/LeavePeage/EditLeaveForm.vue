<template>
    <v-container>
        <v-row class=" ma-2 justify-space-between">
            <p>Nom Employee : {{ editedItem.employeeName }}</p>
            <p>Numero Employee : {{ editedItem.employeeNumber }}</p>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6" md="6">
                <v-text-field type="date" v-model="editedItem.startDate" label="Date Debut"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
                <v-text-field type="date" v-model="editedItem.endDate" label="Date fin"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <p> Categorie : {{ editedItem.category }}</p>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <p> Raison : {{ editedItem.reason }}</p>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <span>
                    Etat :
                </span>
                <span v-if="editedItem.status == 'En Attente'" style="color:red">{{ editedItem.status }}</span>
                <span v-if="editedItem.status == 'Accepté'" style="color:green">{{ editedItem.status }}</span>
                <span v-if="editedItem.status == 'Refusé'" style="color:red">{{ editedItem.status }}</span>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>


export default {

    props: {
        editedItem: Object
    },
    mounted()
    {
        this.leaveCategoryList = ['Personnel', 'Vacances', 'Maladie']
    }

}

</script>