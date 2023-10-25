<template>
    <v-sheet class="ma-2 h-50 hidden-md-and-up" v-if="this.isUserAuthorized()">
        <v-row class="justify-center mx-10 my-2">
            <h2>Cette section est seulement disponible sur un ordinateur</h2>
        </v-row>
    </v-sheet>
    <v-sheet class="ma-2 h-50 hidden-sm-and-down" v-if="this.isUserAuthorized()">
        <v-sheet class="my-5 mx-10" v-if="this.isUserAuthorized()">

            <v-row class="justify-center">
                <v-col cols="2">
                    <v-switch v-model="showedShift" :label="`Shift: ${translateShiftName}`" false-value="Lunch"
                        true-value="Dinner" inset />
                </v-col>
                <v-col cols="4">
                    Sélection de la semaine pour l'horaire
                    <v-text-field density="compact" type="week" v-model="scheduleWeek">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row class="justify-center">
                <span v-if="!isPublished">Cette horaire n'est pas encore publiée</span>
                <span v-else>Cette horaire est déja publiée. Vous pouvez la modifier</span>

            </v-row>
            <div>
                <v-row class="justify-space-around">
                    <v-col cols="12">
                        <v-card v-if="showedShift == 'Lunch'" class="pa-1">
                            <v-row class="justify-left ma-0 pa-0" no-gutters>
                                <v-col class="ma-1" cols="4">
                                    <p align="right" class="text-caption">Ajouter un événement</p>
                                </v-col>
                                <v-col v-if="loaded && weekInformations[0].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(0)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[0].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(0)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[0].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[2].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(2)" class="elevation-0">+s</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[2].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(2)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[2].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[4].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(4)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[4].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(4)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[4].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[6].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(6)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[6].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(6)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[6].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[8].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(8)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[8].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(8)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[8].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[10].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(10)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[10].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(10)" class="elevation-0"
                                        style="font-size:8px">{{ weekInformations[10].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[12].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(12)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[12].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(12)" class="elevation-0"
                                        style="font-size:8px">{{ weekInformations[12].events[0] }}</v-btn></v-col>
                            </v-row>
                            <v-row class="justify-left ma-0 pa-0" no-gutters>
                                <v-col class="ma-1" cols="4">
                                    <p align="right" class="text-caption"></p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Lundi</p>
                                    <p align="center" class="text-caption">{{ weekDate[0].getDate() + "/" +
                                        (weekDate[0].getMonth() + 1)
                                        + "/" + weekDate[0].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Mardi</p>
                                    <p align="center" class="text-caption">{{ weekDate[2].getDate() + "/" +
                                        (weekDate[2].getMonth() + 1) + "/" + weekDate[2].getFullYear() }}</p>

                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Mercredi</p>
                                    <p align="center" class="text-caption">{{ weekDate[4].getDate() + "/" +
                                        (weekDate[4].getMonth() + 1) + "/" + weekDate[4].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Jeudi</p>
                                    <p align="center" class="text-caption">{{ weekDate[6].getDate() + "/" +
                                        (weekDate[6].getMonth() + 1) + "/" + weekDate[6].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Vendredi</p>
                                    <p align="center" class="text-caption">{{ weekDate[8].getDate() + "/" +
                                        (weekDate[8].getMonth() + 1) + "/" + weekDate[8].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Samedi</p>
                                    <p align="center" class="text-caption">{{ weekDate[10].getDate() + "/" +
                                        (weekDate[10].getMonth() + 1) + "/" + weekDate[10].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Dimanche</p>
                                    <p align="center" class="text-caption">{{ weekDate[12].getDate() + "/" +
                                        (weekDate[12].getMonth() + 1) + "/" + weekDate[12].getFullYear() }}</p>
                                </v-col>
                            </v-row>
                            <v-row class="justify-left" no-gutters>
                                <v-col class="ma-1" cols="4">
                                    <p align="right">Achalandage Moyen (nombre de clients)</p>
                                </v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[0].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[2].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[4].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[6].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[8].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[10].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[12].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                            </v-row>
                            <v-row class="justify-left" no-gutters>
                                <v-col class="ml-2" cols="4">
                                    <p align="right">Facture moyenne par client</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <v-text-field type="number" v-model="weekInformations[0].averageCostByClient"
                                        density="compact" class=" pa-0" hide-spin-buttons>
                                        <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[2].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons><template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[4].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[6].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[8].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[10].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[12].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                            </v-row>
                            <v-row class="justify-left" no-gutters>
                                <v-col class="ml-2" cols="4">
                                    <p class="text-caption" align="right">Prévision pour le shift :</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">$
                                        {{ weekInformations[0].traffic * weekInformations[0].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[2].traffic *
                                        weekInformations[2].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[4].traffic *
                                        weekInformations[4].averageCostByClient }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[6].traffic *
                                        weekInformations[6].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[8].traffic *
                                        weekInformations[8].averageCostByClient }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[10].traffic *
                                        weekInformations[10].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[12].traffic *
                                        weekInformations[12].averageCostByClient }}</p>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-card v-else class="pa-1">
                            <v-row class="justify-left ma-0 pa-0" no-gutters>
                                <v-col class="ma-1" cols="4">
                                    <p align="right" class="text-caption">Ajouter un événement</p>
                                </v-col>
                                <v-col v-if="loaded && weekInformations[1].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(1)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[1].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(1)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[1].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[3].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(3)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[3].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(3)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[3].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[5].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(5)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[5].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(5)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[5].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[7].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(7)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[7].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(7)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[7].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[9].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(9)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[9].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(9)" class="elevation-0" style="font-size:8px">{{
                                        weekInformations[9].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[11].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(11)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[11].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(11)" class="elevation-0"
                                        style="font-size:8px">{{ weekInformations[11].events[0] }}</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[13].events.length < 1" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(13)" class="elevation-0">+</v-btn></v-col>
                                <v-col v-if="loaded && weekInformations[13].events.length > 0" align="center" class="ma-1"
                                    cols="1"><v-btn @click="addEventToShift(13)" class="elevation-0"
                                        style="font-size:8px">{{ weekInformations[13].events[0] }}</v-btn></v-col>
                            </v-row>
                            <v-row class="justify-left ma-0 pa-0" no-gutters>
                                <v-col class="ma-1" cols="4">
                                    <p></p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Lundi</p>
                                    <p align="center" class="text-caption">{{ weekDate[1].getDate() + "/" +
                                        (weekDate[1].getMonth() + 1)
                                        + "/" + weekDate[1].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Mardi</p>
                                    <p align="center" class="text-caption">{{ weekDate[3].getDate() + "/" +
                                        (weekDate[3].getMonth() + 1) + "/" + weekDate[3].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Mercredi</p>
                                    <p align="center" class="text-caption">{{ weekDate[5].getDate() + "/" +
                                        (weekDate[5].getMonth() + 1) + "/" + weekDate[5].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Jeudi</p>
                                    <p align="center" class="text-caption">{{ weekDate[7].getDate() + "/" +
                                        (weekDate[7].getMonth() + 1) + "/" + weekDate[7].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Vendredi</p>
                                    <p align="center" class="text-caption">{{ weekDate[9].getDate() + "/" +
                                        (weekDate[9].getMonth() + 1) + "/" + weekDate[9].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Samedi</p>
                                    <p align="center" class="text-caption">{{ weekDate[11].getDate() + "/" +
                                        (weekDate[11].getMonth() + 1) + "/" + weekDate[11].getFullYear() }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption elevation-1">Dimanche</p>
                                    <p align="center" class="text-caption">{{ weekDate[13].getDate() + "/" +
                                        (weekDate[13].getMonth() + 1) + "/" + weekDate[13].getFullYear() }}</p>
                                </v-col>
                            </v-row>
                            <v-row class="justify-left" no-gutters>
                                <v-col class="ma-1" cols="4">
                                    <p align="right">Achalandage Moyen (nombre de clients)</p>
                                </v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[1].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[3].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[5].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[7].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[9].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[11].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[13].traffic" density="compact" class=" pa-0"
                                        hide-spin-buttons></v-text-field></v-col>
                            </v-row>
                            <v-row class="justify-left" no-gutters>
                                <v-col class="ml-2" cols="4">
                                    <p align="right">Facture moyenne par client</p>
                                </v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[1].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[3].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[5].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[7].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[9].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[11].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                                <v-col class="ml-2" cols="1"><v-text-field type="number"
                                        v-model="weekInformations[13].averageCostByClient" density="compact" class=" pa-0"
                                        hide-spin-buttons> <template v-slot:prepend-inner>
                                            <div style="font-size: 12px;">$</div>
                                        </template></v-text-field></v-col>
                            </v-row>
                            <v-row class="justify-left" no-gutters>
                                <v-col class="ml-2" cols="4">
                                    <p class="text-caption" align="right">Prévision pour le shift :</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">$
                                        {{ weekInformations[1].traffic * weekInformations[1].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[3].traffic *
                                        weekInformations[3].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[5].traffic *
                                        weekInformations[5].averageCostByClient }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[7].traffic *
                                        weekInformations[7].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[9].traffic *
                                        weekInformations[9].averageCostByClient }}</p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[11].traffic *
                                        weekInformations[11].averageCostByClient }}
                                    </p>
                                </v-col>
                                <v-col class="ml-2" cols="1">
                                    <p align="center" class="text-caption">${{ weekInformations[13].traffic *
                                        weekInformations[13].averageCostByClient }}</p>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-sheet>
        <v-sheet class="mx-15 my-7" v-if="this.isUserAuthorized()">
            <v-row class="justify-space-around">
                <v-btn @click="dialogAddEmployee = true">Ajouter un employé</v-btn>
                <v-btn v-if="!isPublished" @click="saveSchedule()">Sauvegarger (sans la publier)</v-btn>
                <DarkRedButton v-if="!isPublished" @click="publishSchedule()" textbutton="Publier un nouvel
                    horaire"></DarkRedButton>
                <DarkRedButton v-else @click="publishSchedule()" textbutton="Publier les modifications de
                    l'horaire"></DarkRedButton>

            </v-row>
        </v-sheet>
        <v-sheet class="mx-10" v-if="this.isUserAuthorized()">
            <v-card class="pa-2 w-100 elevation-4">
                <v-row class="justify-end" no-gutters>
                    <v-col class="ml-2" cols="3">
                        <v-row class="justify-start" no-gutters>
                            <v-col class="ml-2" cols="12">Poste</v-col>
                            <v-col class="ml-2" cols="10">
                                <v-select v-model="roleShowed" :items="roleList" density="compact"></v-select>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Points de compétences</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Lundi</p>
                        <p align="center" class="text-caption">{{ weekDate[0].getDate() + "/" +
                            (weekDate[0].getMonth() + 1) + "/" +
                            weekDate[0].getFullYear() }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC requis : {{
                            requiredSkillPoints(0) }}</p>
                        <p v-else align="center" class="text-caption">PC requis : {{ requiredSkillPoints(1) }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC actuel : 
                            <span v-if="requiredSkillPoints(0) - weekInformations[0].scheduledSkillPoints >= 5 || requiredSkillPoints(0) - weekInformations[0].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[0].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[0].scheduledSkillPoints }}</span>
                        </p>
                        <p v-else align="center" class="text-caption">PC actuel :
                            <span v-if="requiredSkillPoints(1) - weekInformations[1].scheduledSkillPoints >= 5 || requiredSkillPoints(1) - weekInformations[1].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[1].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[1].scheduledSkillPoints }}</span>
                        </p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mardi</p>
                        <p align="center" class="text-caption">{{ weekDate[2].getDate() + "/" +
                            (weekDate[2].getMonth() + 1) + "/" +
                            weekDate[2].getFullYear() }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC requis : {{
                            requiredSkillPoints(2) }}</p>
                        <p v-else align="center" class="text-caption">PC requis : {{ requiredSkillPoints(3) }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC actuel : 
                            <span v-if="requiredSkillPoints(2) - weekInformations[2].scheduledSkillPoints >= 5 || requiredSkillPoints(2) - weekInformations[2].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[2].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[2].scheduledSkillPoints }}</span>
                        </p>
                        <p v-else align="center" class="text-caption">PC actuel :
                            <span v-if="requiredSkillPoints(3) - weekInformations[3].scheduledSkillPoints >= 5 || requiredSkillPoints(3) - weekInformations[3].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[3].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[3].scheduledSkillPoints }}</span>
                        </p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mercredi</p>
                        <p align="center" class="text-caption">{{ weekDate[4].getDate() + "/" +
                            (weekDate[4].getMonth() + 1) + "/" +
                            weekDate[4].getFullYear() }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC requis : {{
                            requiredSkillPoints(4) }}</p>
                        <p v-else align="center" class="text-caption">PC requis : {{ requiredSkillPoints(5) }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC actuel : 
                            <span v-if="requiredSkillPoints(4) - weekInformations[4].scheduledSkillPoints >= 5 || requiredSkillPoints(4) - weekInformations[4].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[4].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[4].scheduledSkillPoints }}</span>
                        </p>
                        <p v-else align="center" class="text-caption">PC actuel :
                            <span v-if="requiredSkillPoints(5) - weekInformations[5].scheduledSkillPoints >= 5 || requiredSkillPoints(5) - weekInformations[5].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[5].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[5].scheduledSkillPoints }}</span>
                        </p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Jeudi</p>
                        <p align="center" class="text-caption">{{ weekDate[6].getDate() + "/" +
                            (weekDate[6].getMonth() + 1) + "/" +
                            weekDate[6].getFullYear() }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC requis : {{
                            requiredSkillPoints(6) }}</p>
                        <p v-else align="center" class="text-caption">PC requis : {{ requiredSkillPoints(7) }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC actuel : 
                            <span v-if="requiredSkillPoints(6) - weekInformations[6].scheduledSkillPoints >= 5 || requiredSkillPoints(6) - weekInformations[6].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[6].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[6].scheduledSkillPoints }}</span>
                        </p>
                        <p v-else align="center" class="text-caption">PC actuel :
                            <span v-if="requiredSkillPoints(7) - weekInformations[7].scheduledSkillPoints >= 5 || requiredSkillPoints(7) - weekInformations[7].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[7].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[7].scheduledSkillPoints }}</span>
                        </p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Vendredi</p>
                        <p align="center" class="text-caption">{{ weekDate[8].getDate() + "/" +
                            (weekDate[8].getMonth() + 1) + "/" +
                            weekDate[8].getFullYear() }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC requis : {{
                            requiredSkillPoints(8) }}</p>
                        <p v-else align="center" class="text-caption">PC requis : {{ requiredSkillPoints(9) }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC actuel : 
                            <span v-if="requiredSkillPoints(8) - weekInformations[8].scheduledSkillPoints >= 5 || requiredSkillPoints(8) - weekInformations[8].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[8].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[8].scheduledSkillPoints }}</span>
                        </p>
                        <p v-else align="center" class="text-caption">PC actuel :
                            <span v-if="requiredSkillPoints(9) - weekInformations[9].scheduledSkillPoints >= 5 || requiredSkillPoints(9) - weekInformations[9].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[9].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[9].scheduledSkillPoints }}</span>
                        </p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Samedi</p>
                        <p align="center" class="text-caption">{{ weekDate[10].getDate() + "/" +
                            (weekDate[10].getMonth() + 1) + "/" +
                            weekDate[10].getFullYear() }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC requis : {{
                            requiredSkillPoints(10) }}</p>
                        <p v-else align="center" class="text-caption">PC requis : {{ requiredSkillPoints(11) }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC actuel : 
                            <span v-if="requiredSkillPoints(10) - weekInformations[10].scheduledSkillPoints >= 5 || requiredSkillPoints(10) - weekInformations[10].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[10].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[10].scheduledSkillPoints }}</span>
                        </p>
                        <p v-else align="center" class="text-caption">PC actuel :
                            <span v-if="requiredSkillPoints(11) - weekInformations[11].scheduledSkillPoints >= 5 || requiredSkillPoints(11) - weekInformations[11].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[11].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[11].scheduledSkillPoints }}</span>
                        </p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Dimanche</p>
                        <p align="center" class="text-caption">{{ weekDate[12].getDate(12) + "/" +
                            (weekDate[12].getMonth() + 1) + "/" +
                            weekDate[12].getFullYear() }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC requis : {{
                            requiredSkillPoints(12) }}</p>
                        <p v-else align="center" class="text-caption">PC requis : {{ requiredSkillPoints(13) }}</p>
                        <p v-if="showedShift == 'Lunch'" align="center" class="text-caption">PC actuel : 
                            <span v-if="requiredSkillPoints(12) - weekInformations[12].scheduledSkillPoints >= 5 || requiredSkillPoints(12) - weekInformations[12].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[12].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[12].scheduledSkillPoints }}</span>
                        </p>
                        <p v-else align="center" class="text-caption">PC actuel :
                            <span v-if="requiredSkillPoints(13) - weekInformations[13].scheduledSkillPoints >= 5 || requiredSkillPoints(13) - weekInformations[13].scheduledSkillPoints <= -5" style="color:red"> {{ weekInformations[13].scheduledSkillPoints }}</span>
                            <span v-else> {{ weekInformations[13].scheduledSkillPoints }}</span>
                        </p>
                    </v-col>
                </v-row>
                <v-divider class="border-opacity-50 mt-2"></v-divider>
                <v-sheet v-if="showedShift == 'Lunch'">
                    <v-row v-for="employee in scheduledEmployeesShow" class="justify-end my-2" no-gutters>
                        <v-col class="ml-2" cols="3">
                            <v-row align="center" class="justify-space-between">
                                <v-col cols="1">
                                    <CloseRedButton @click="removeEmployeeFromSchedule(employee.employeeNumber)">
                                    </CloseRedButton>
                                </v-col>
                                <v-col cols="11">
                                    <p align="center"> {{ employee.role.substring(0,1) }} - ({{ employee.employeeNumber }}) {{ employee.name }}</p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <p align="center">{{ employee.skillPoints }}</p>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[0].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 0)"
                                    :color="employee.schedules[1].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[0].time }}</v-btn>
                            </div>
                            <div v-else>
                                <v-btn @click="addShiftToEmployee(employee, 0)"
                                    :color="employee.schedules[1].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn>
                            </div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[2].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 2)"
                                    :color="employee.schedules[3].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[2].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 2)"
                                    :color="employee.schedules[3].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[4].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 4)"
                                    :color="employee.schedules[5].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[4].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 4)"
                                    :color="employee.schedules[5].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[6].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 6)"
                                    :color="employee.schedules[7].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[6].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 6)"
                                    :color="employee.schedules[7].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[8].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 8)"
                                    :color="employee.schedules[9].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[8].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 8)"
                                    :color="employee.schedules[9].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[10].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 10)"
                                    :color="employee.schedules[11].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[10].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 10)"
                                    :color="employee.schedules[11].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[12].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 12)"
                                    :color="employee.schedules[13].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[12].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 12)"
                                    :color="employee.schedules[13].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-divider class="border-opacity-50 mt-2"></v-divider>
                    </v-row>
                </v-sheet>

                <v-sheet v-else>
                    <v-row v-for="employee in scheduledEmployeesShow" class="justify-end my-2" no-gutters>
                        <v-col class="ml-2" cols="3">
                            <v-row align="center" class="justify-space-between">
                                <v-col cols="1">
                                    <CloseRedButton @click="removeEmployeeFromSchedule(employee.employeeNumber)">
                                    </CloseRedButton>
                                </v-col>
                                <v-col cols="11">
                                    <p align="center"> {{ employee.role.substring(0,1) }} - ({{ employee.employeeNumber }}) {{ employee.name }}</p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <p align="center"> {{ employee.skillPoints }}</p>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[1].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 1)"
                                    :color="employee.schedules[0].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[1].time }}</v-btn>
                            </div>
                            <div v-else>
                                <v-btn :color="employee.schedules[0].time ? '#dcdcdc' : ''"
                                    @click="addShiftToEmployee(employee, 1)" align="center" height="25"
                                    width="100">+</v-btn>
                            </div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[3].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 3)"
                                    :color="employee.schedules[2].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[3].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 3)"
                                    :color="employee.schedules[2].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[5].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 5)"
                                    :color="employee.schedules[4].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[5].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 5)"
                                    :color="employee.schedules[4].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[7].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 7)"
                                    :color="employee.schedules[6].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[7].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 7)"
                                    :color="employee.schedules[6].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[9].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 9)"
                                    :color="employee.schedules[8].time ? '#dcdcdc' : ''" align="center" class="text-caption"
                                    height="25" width="100">{{
                                        employee.schedules[9].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 9)"
                                    :color="employee.schedules[8].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[11].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 11)"
                                    :color="employee.schedules[10].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[11].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 11)"
                                    :color="employee.schedules[10].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[13].time != null">
                                <v-btn @click="editShiftToEmployee(employee, 13)"
                                    :color="employee.schedules[12].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[13].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 13)"
                                    :color="employee.schedules[12].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-divider class="border-opacity-50 mt-2"></v-divider>
                    </v-row>
                </v-sheet>
            </v-card>
        </v-sheet>
    </v-sheet>

    <v-sheet v-else>
        <v-row class="m-10 justify-center">
            <h1>Vous devez être connecté et avoir les droits administrateurs pour avoir accès à cette page</h1>
        </v-row>
    </v-sheet>

    <v-dialog v-model="dialogAddEmployee" width="75%" persistent>
        <v-card class="pa-5">
            <v-card-title>
                Ajouter un employé a la liste
            </v-card-title>
            <v-row class="justify-center">
                <p v-if="warningEmployeeAlreadyInScheduleMessage" align="center" class="warning-message">L'employé est déjà
                    dans
                    l'horaire</p>
            </v-row>
            <v-row>
                <EmployeeList width="100%" height="100%"></EmployeeList>
            </v-row>
            <v-row class="justify-end">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="dialogAddEmployee = false"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Sauvegarder" :disabled="!selectedEmployeeNumberToAdd"
                    @click="addNewEmployeeToSchedule()"></DarkRedButton>
            </v-row>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNewShift" width="50%" persistent>
        <v-card class="pa-5">
            <v-card-title>
                Ajouter un nouveau shift à {{ employeeNewShift.name }} pour le {{ this.weekDate[dayNewShift].getDate() }}
                {{ this.weekDate[dayNewShift].toLocaleString('fr-FR', { month: 'long' }) }}
            </v-card-title>
            <v-card-text v-if="employeeHaveApprovedLeave">
                <v-row class="justify-center">
                    <div class="my-10" v-if="employeeHaveApprovedLeave">
                        <p align="center" class="warning-message">Vous ne pouvez pas ajouter {{ employeeNewShift.name }} à ce shift car il a un congé qui a été approuvé pour cette date</p>
                    </div>

                    </v-row>
            </v-card-text>
            <v-card-text v-else>
                <v-row class="justify-center">
                    <p v-if="warningNewShiftEndTimeMessage" align="center" class="warning-message">L'heure de fin doit
                        être après l'heure de début</p>
                    <p v-if="warningNewShiftEmptyMessage" align="center" class="warning-message">Les champs pour les
                        heures ne peuvent
                        pas être vides</p>
                </v-row>
                <v-row class="justify-center">
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field type="time" v-model="startTimeNewShift" label="Heure Debut"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field type="time" v-model="endTimeNewShift" label="Heure Fin"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-row class="justify-end">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeNewShiftDialog()"></DarkRedButton>
                <DarkRedButton v-if="!employeeHaveApprovedLeave" class="mx-5" textbutton="Sauvegarder" @click="confirmShiftToEmployee()"
                    :disabled="!startTimeNewShift || !endTimeNewShift"></DarkRedButton>
            </v-row>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEditShift" width="50%" persistent>
        <v-card class="pa-5">
            <v-card-title>
                Modifier le shift de {{ employeeNewShift.name }} pour le {{ this.weekDate[dayNewShift].getDate() }}
                {{ this.weekDate[dayNewShift].toLocaleString('fr-FR', { month: 'long' }) }}
            </v-card-title>
            <v-card-text>
                <v-row class="justify-center">
                    <p v-if="warningNewShiftEndTimeMessage" align="center" class="warning-message">L'heure de fin doit
                        être après l'heure de début</p>
                    <p v-if="warningNewShiftEmptyMessage" align="center" class="warning-message">Les champs pour les
                        heures ne peuvent
                        pas être vides</p>
                </v-row>
                <v-row class="justify-center">
                    <v-col cols="6" sm="6" md="6">
                        <v-text-field type="time" v-model="startTimeNewShift" label="Heure Debut"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                        <v-text-field type="time" v-model="endTimeNewShift" label="Heure Fin"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-row class="justify-center">
                <v-col cols="2">
                    <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeEditShiftDialog()"></DarkRedButton>
                </v-col>
                <v-col cols="4">
                    <DarkRedButton class="mx-5" textbutton="Supprimer le shift" @click="removeShiftToEmployee()">
                    </DarkRedButton>
                </v-col>
                <v-col cols="6">
                    <DarkRedButton class="mx-5" textbutton="Sauvegarder les modifications" @click="confirmShiftToEmployee()"
                        :disabled="!startTimeNewShift || !endTimeNewShift"></DarkRedButton>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSaved" width="75%" persistent>
        <v-card class="pa-5">
            <v-card-title>
                Sauvegarde de l'horaire
            </v-card-title>
            <v-row class="justify-center">
                <p>Votre horaire a bien été sauvegardé</p>
            </v-row>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAddEvent" width="75%" persistent>
        <v-sheet class="pa-5">
            <v-card-title>
                Ajouter un événement à la liste
            </v-card-title>
            <v-row class="justify-center">
                <p v-if="warningEventAlreadyInScheduleMessage" align="center" class="warning-message">L'événement est déjà
                    dans ce shift</p>
            </v-row>
            <v-row>
                <EventList width="100%" height="100%" :activeEvent=true :scheduledEvent="selectedEvent"></EventList>
            </v-row>
            <v-row class="justify-end">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="closeDialogAddEvent"></DarkRedButton>
                <DarkRedButton v-if="selectedEvent" class="mx-5" textbutton="Ajouter l'événement à ce shift"
                    :disabled="!selectedEvent" @click="addNewEventToShift()">
                </DarkRedButton>.
                <DarkRedButton v-if="!selectedEvent" class="mx-5" textbutton="Ne pas ajouter d'événement à ce shift"
                    @click="removeNewEventToShift()">
                </DarkRedButton>
            </v-row>
        </v-sheet>
    </v-dialog>
</template>


<script>
import CloseRedButton from '../../components/Reusable/CloseRedButton.vue'
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue'
import EmployeeList from '../EmployeePage/EmployeeList.vue'
import EventList from '../EventPage/EventList.vue'
import { getAllRoles, getEmployeeByEmployeeNumber } from '../../services/EmployeeService'
import { fetchEventByName } from '../../services/EventService'
import { getScheduleWeekInfoByID, getAllEmployeeScheduleByScheduleWeekId, getAllEventByScheduleWeekId, updateSchedule } from '../../services/ScheduleService'
import userSession from '../../sessions/UserSession'
import { getApprovedLeavesByEmployeeNumberAndDate } from '../../services/LeaveService'
import { getHowManyPeopleByDateAndShiftName } from '../../services/ReservationService'
import { watch } from 'vue'

export default {
    inject: ['isUserAuthorized'],
    components: {
        EmployeeList,
        EventList,
        DarkRedButton,
        CloseRedButton
    },
    data()
    {
        return {
            roleList: [],
            roleShowed: "Tous",
            scheduleWeek: null,
            isPublished: false,
            isModified: false,
            showedShift: "Lunch",
            weekDate: [
            ],
            weekInformations: [
            ],
            scheduledEmployees: [
            ],
            scheduledEmployeesShow: [
            ],
            dialogAddEvent: false,
            dialogNewShift: false,
            dialogEditShift: false,
            dialogAddEmployee: false,
            dialogSaved: false,
            employeeNewShift: null,
            dayNewShift: null,
            startTimeNewShift: null,
            endTimeNewShift: null,
            employeeHaveApprovedLeave: false,
            datePropertyMapping: null,
            selectedEmployeeNumberToAdd: null,
            warningEmployeeAlreadyInScheduleMessage: false,
            warningEventAlreadyInScheduleMessage: false,
            warningNewShiftEndTimeMessage: false,
            warningNewShiftEmptyMessage: false,
            selectedEvent: "",
            tempSelectedEvent: "",
            shiftToAddEvent: "",
            userSession: userSession,
            loaded: false
        }
    },
    provide()
    {
        return {
            loadEmployeeNumber: this.loadSelectedEmployeeNumberToAdd,
            loadEvent: this.loadEvent
        }
    },
    methods: {
        splitWeekAndYear(yearWeek)
        {
            return {
                year: parseInt(yearWeek.split('-').slice(0)[0]),
                week: parseInt(yearWeek.split('W').slice(0)[1])
            }
        },
        setWeekDayDate()
        {
            const splittedYearWeek = this.splitWeekAndYear(this.scheduleWeek);
            const monday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 6);
            const tuesday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 5);
            const wednesday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 4);
            const thursday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 3);
            const friday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 2);
            const saturday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 1);
            const sunday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7));
            while (sunday.getDay() !== 0)
            {
                sunday.setDate(sunday.getDate() - 1);
                monday.setDate(sunday.getDate() - 6)
                tuesday.setDate(sunday.getDate() - 5)
                wednesday.setDate(sunday.getDate() - 4)
                thursday.setDate(sunday.getDate() - 3)
                friday.setDate(sunday.getDate() - 2)
                saturday.setDate(sunday.getDate() - 1)
            }
            this.weekDate[0] = monday;
            this.weekDate[1] = monday;
            this.weekDate[2] = tuesday;
            this.weekDate[3] = tuesday;
            this.weekDate[4] = wednesday;
            this.weekDate[5] = wednesday;
            this.weekDate[6] = thursday;
            this.weekDate[7] = thursday;
            this.weekDate[8] = friday;
            this.weekDate[9] = friday;
            this.weekDate[10] = saturday;
            this.weekDate[11] = saturday;
            this.weekDate[12] = sunday;
            this.weekDate[13] = sunday;
        },
        loadScheduleWeekInfo()
        {
            getScheduleWeekInfoByID(this.scheduleWeek).then(result =>
            {
                result.forEach(element =>
                {
                    if (element.isPublished != null)
                    {
                        if (element.isPublished)
                        {
                            this.isPublished = true;
                        } else
                        {
                            this.isPublished = false;
                        }
                    }
                    else
                    {
                        const dateKey = element.date;
                        const shiftName = element.shiftName;
                        const mapping = this.datePropertyMapping[dateKey];
                        if (mapping && mapping[shiftName])
                        {
                            const properties = mapping[shiftName];
                            const shiftIndex = properties.index;
                            this.weekInformations[shiftIndex].id = element.id;
                            this.weekInformations[shiftIndex].traffic = element.averageTraffic;
                            this.weekInformations[shiftIndex].averageCostByClient = element.averageCostByClient;
                            this.weekInformations[shiftIndex].scheduledSkillPoints = element.scheduledSkillPoints;
                            this.weekInformations[shiftIndex].events = [];
                            
                            //Aller chercher le nombre de personne en reservation pour chaque date et chaque shift
                            getHowManyPeopleByDateAndShiftName(element.date, element.shiftName).then(result =>
                            {
                                this.weekInformations[shiftIndex].peopleReservation = parseInt(result);
                            }).catch(err =>
                            {
                                console.error(err);
                            })
                        }
                    }
                });
                this.loaded = true;
            }).catch(err =>
            {
                console.error(err)
            });
        },
        loadEmployee()
        {
            getAllEmployeeScheduleByScheduleWeekId(this.scheduleWeek).then(employeeInSchedule =>
            {
                this.scheduledEmployees = [];
                employeeInSchedule.forEach(employee =>
                {
                    const newEmployee = {
                        employeeNumber: employee.employeeNumber,
                        name: employee.name,
                        role: employee.role,
                        skillPoints: employee.skillPoints,
                        schedules: [
                        ]
                    };
                    for (let i = 0; i < 14; i++)
                    {
                        newEmployee.schedules.push({
                            id: this.weekInformations[i].id,
                            startTime: null,
                            endTime: null,
                            time: null
                        })
                    }
                    employee.schedules.forEach(element =>
                    {
                        const dateKey = element.date;
                        const shiftName = element.shiftName;
                        const mapping = this.datePropertyMapping[dateKey];

                        if (mapping && mapping[shiftName])
                        {
                            const properties = mapping[shiftName];
                            const shiftIndex = properties.index;

                            newEmployee.schedules[shiftIndex] = {
                                id: element.id,
                                shiftName: element.shiftName,
                                startTime: element.startTime.split(':').slice(0, 2).join(':'),
                                endTime: element.endTime.split(':').slice(0, 2).join(':'),
                                time: element.startTime.split(':').slice(0, 2).join(':') + " - " + element.endTime.split(':').slice(0, 2).join(':')
                            }
                        }
                    });
                    this.scheduledEmployees.push(newEmployee);
                    this.scheduledEmployeesShow = this.scheduledEmployees;
                });
                this.refreshEmployee();
            }).catch(err =>
            {
                console.error(err)
            });
        },
        refreshEmployee()
        {
            let newEmployeeList = [];
            this.scheduledEmployees.forEach(employee =>
            {
                if (this.roleShowed == "Tous" || employee.role == this.roleShowed)
                {
                    newEmployeeList.push(employee);
                }
            });
            this.scheduledEmployeesShow = newEmployeeList;
        },
        loadEvents()
        {
            getAllEventByScheduleWeekId(this.scheduleWeek).then(result =>
            {

                for (let i = 0; i < 14; i++)
                {
                    this.weekInformations[i].events = [];
                }
                result.forEach(element =>
                {
                    if (element.isActive)
                    {
                        const dateKey = element.date;
                        const shiftName = element.shiftName;
                        const mapping = this.datePropertyMapping[dateKey];

                        if (mapping && mapping[shiftName])
                        {
                            const properties = mapping[shiftName];
                            const shiftIndex = properties.index;
                            this.weekInformations[shiftIndex].events.push(element.eventName);
                            this.weekInformations[shiftIndex].eventImpact = element.impact;
                        }
                    }
                });
            }).catch(err =>
            {
                console.error(err);
            })
        },
        addShiftToEmployee(employee, dayIndex)
        {
            const date = this.weekDate[dayIndex];
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajoute un zéro devant si le mois est inférieur à 10
            let day = date.getDate().toString().padStart(2, '0'); // Ajoute un zéro devant si le jour est inférieur à 10
            let formattedDate = `${year}-${month}-${day}`;

            this.employeeNewShift = employee;
            this.dayNewShift = dayIndex;
            this.employeeHaveApprovedLeave = false;
            getApprovedLeavesByEmployeeNumberAndDate(employee.employeeNumber, formattedDate).then(allLeaves =>
            {
                if (allLeaves.length > 0)
                {
                    this.employeeHaveApprovedLeave = true;
                }
                this.dialogNewShift = true;
            })

        },
        editShiftToEmployee(employee, dayIndex)
        {
            this.employeeNewShift = employee;
            this.dayNewShift = dayIndex;
            this.startTimeNewShift = this.employeeNewShift.schedules[this.dayNewShift].startTime;
            this.endTimeNewShift = this.employeeNewShift.schedules[this.dayNewShift].endTime;
            this.dialogEditShift = true;
        },
        removeShiftToEmployee(employee, dayIndex)
        {
            this.employeeNewShift.schedules[this.dayNewShift].startTime = null;
            this.employeeNewShift.schedules[this.dayNewShift].endTime = null;
            this.employeeNewShift.schedules[this.dayNewShift].time = null;
            this.employeeNewShift.schedules[this.dayNewShift].shiftName = null;
            this.weekInformations[this.dayNewShift].scheduledSkillPoints -= this.employeeNewShift.skillPoints;
            this.closeEditShiftDialog();
        },
        confirmShiftToEmployee()
        {
            if (!this.startTimeNewShift || !this.endTimeNewShift)
            {
                this.warningNewShiftEmptyMessage = true;
                return;
            } else
            {
                this.warningNewShiftEmptyMessage = false;
            }
            if (this.endTimeNewShift <= this.startTimeNewShift)
            {
                this.warningNewShiftEndTimeMessage = true;
                return;
            }
            let shiftId = this.employeeNewShift.schedules[this.dayNewShift].id;
            this.employeeNewShift.schedules[this.dayNewShift] =
            {
                id: shiftId,
                startTime: this.startTimeNewShift,
                endTime: this.endTimeNewShift,
                time: this.startTimeNewShift + " - " + this.endTimeNewShift
            }
            if (!this.weekInformations[this.dayNewShift].scheduledSkillPoints) this.weekInformations[this.dayNewShift].scheduledSkillPoints = 0;
            this.weekInformations[this.dayNewShift].scheduledSkillPoints += this.employeeNewShift.skillPoints;
            this.closeNewShiftDialog();
            this.closeEditShiftDialog();
        },
        closeNewShiftDialog()
        {
            this.dialogNewShift = false;
            this.warningNewShiftEndTimeMessage = false;
            this.warningNewShiftEmptyMessage = false;
            this.startTimeNewShift = null;
            this.endTimeNewShift = null;
        },
        closeEditShiftDialog()
        {
            this.dialogEditShift = false;
            this.warningNewShiftEndTimeMessage = false;
            this.warningNewShiftEmptyMessage = false;
            this.startTimeNewShift = null;
            this.endTimeNewShift = null;
        },
        addNewEmployeeToSchedule()
        {
            //if (!this.selectedEmployeeNumberToAdd) { return }
            let found = this.scheduledEmployees.find(({ employeeNumber }) => employeeNumber == this.selectedEmployeeNumberToAdd);
            if (found)
            {
                this.warningEmployeeAlreadyInScheduleMessage = true;
            }
            else
            {
                this.warningEmployeeAlreadyInScheduleMessage = false;
                getEmployeeByEmployeeNumber(this.selectedEmployeeNumberToAdd).then(employee =>
                {
                    const newEmployee = {
                        employeeNumber: employee.employeeNumber,
                        name: employee.firstName + " " + employee.lastName,
                        role: employee.role,
                        skillPoints: employee.skillPoints,
                        schedules: []
                    }
                    for (let i = 0; i < 14; i++)
                    {
                        newEmployee.schedules.push({
                            id: this.weekInformations[i].id,
                            startTime: null,
                            endTime: null,
                            time: null
                        });
                    }
                    this.scheduledEmployees.push(newEmployee);
                    this.dialogAddEmployee = false;
                    this.refreshEmployee();

                }).catch(err =>
                {
                    console.error(err);
                })

            }
        },
        removeEmployeeFromSchedule(employeeNumberToRemove)
        {
            let found = this.scheduledEmployees.find(({ employeeNumber }) => employeeNumber == employeeNumberToRemove);
            if (found)
            {
                const index = this.scheduledEmployees.indexOf(found);

                this.scheduledEmployees[index].schedules.forEach((schedule, indexForEach) => {
                    if (schedule.startTime && schedule.endTime)
                    {
                        this.weekInformations[indexForEach].scheduledSkillPoints -= this.scheduledEmployees[index].skillPoints;
                    }

                });


                const x = this.scheduledEmployees.splice(index, 1);
                this.refreshEmployee();
            }
        },
        loadSelectedEmployeeNumberToAdd(employeeNumber)
        {
            this.selectedEmployeeNumberToAdd = employeeNumber;
            this.warningEmployeeAlreadyInScheduleMessage = false;
        },
        saveSchedule()
        {
            const weekInformations = {
                scheduleWeekId: this.scheduleWeek,
                weekInformations: this.weekInformations,
                weekMonday: this.weekDate[0],
                weekSunday: this.weekDate[13],
                scheduledEmployees: this.scheduledEmployees,
                isPublished: this.isPublished,
                isModified: this.isModified,
            }
            updateSchedule(weekInformations).then((result) =>
            {
                if (result)
                {
                    this.dialogSaved = true;
                    setTimeout(this.closeDialogSaved, 2000);
                }
            }).catch(err =>
            {
                console.error(err);
            });
        },
        publishSchedule()
        {
            this.isModified = false;
            if (this.isPublished) this.isModified = true;

            const weekInformations = {
                scheduleWeekId: this.scheduleWeek,
                weekInformations: this.weekInformations,
                weekMonday: this.weekDate[0],
                weekSunday: this.weekDate[13],
                scheduledEmployees: this.scheduledEmployees,
                isPublished: true,
                isModified: this.isModified,
            }
            updateSchedule(weekInformations).then((result) =>
            {
                if (result == "Mise a jour reussi")
                {
                    this.isPublished = true;
                    this.dialogSaved = true;
                    setTimeout(this.closeDialogSaved, 2000);
                }
                else
                {
                    console.error(result)
                }
            }).catch(err =>
            {
                console.error(err);
            });
        },
        closeDialogSaved()
        {
            this.dialogSaved = false;
        },
        addEventToShift(shift)
        {
            this.shiftToAddEvent = shift;
            this.dialogAddEvent = true;
        },
        loadEvent(selectedEvent)
        {
            this.selectedEvent = selectedEvent;
        },
        closeDialogAddEvent()
        {
            this.dialogAddEvent = false;
        },
        addNewEventToShift()
        {
            this.weekInformations[this.shiftToAddEvent].events[0] = this.selectedEvent; // A Enlever lorsque que plusieurs event pourront se mettre sur le meme shift
            //this.weekInformations[this.shiftToAddEvent].events.push(this.selectedEvent); // Sera utile pour eventuellement mettre plusieurs event sur un meme shift
            fetchEventByName(this.selectedEvent).then(result =>
            {
                if (result)
                {
                    this.weekInformations[this.shiftToAddEvent].eventImpact = result.impact;
                }
            }).catch(err =>
            {
                console.error(err);
            })
            this.selectedEvent = "";
            this.dialogAddEvent = false;
        },
        removeNewEventToShift()
        {
            this.weekInformations[this.shiftToAddEvent].events = [];
            this.weekInformations[this.shiftToAddEvent].eventImpact = 100;
            this.selectedEvent = "";
            this.dialogAddEvent = false;
        },
        setDatePropertyMappingateMap()
        {
            this.datePropertyMapping = {
                [this.weekDate[0].toISOString()]: {
                    Midi: { index: 0 },
                    Soir: { index: 1 }
                },
                [this.weekDate[2].toISOString()]: {
                    Midi: { index: 2 },
                    Soir: { index: 3 }
                },
                [this.weekDate[4].toISOString()]: {
                    Midi: { index: 4 },
                    Soir: { index: 5 }
                },
                [this.weekDate[6].toISOString()]: {
                    Midi: { index: 6 },
                    Soir: { index: 7 }
                },
                [this.weekDate[8].toISOString()]: {
                    Midi: { index: 8 },
                    Soir: { index: 9 }
                },
                [this.weekDate[10].toISOString()]: {
                    Midi: { index: 10 },
                    Soir: { index: 11 }
                },
                [this.weekDate[12].toISOString()]: {
                    Midi: { index: 12 },
                    Soir: { index: 13 }
                }
            }
        },
        requiredSkillPoints(shiftIndex)
        {
            let resultRequired;
            if (!this.weekInformations[shiftIndex].eventImpact) this.weekInformations[shiftIndex].eventImpact = 100;

            if (this.weekInformations[shiftIndex].peopleReservation < this.weekInformations[shiftIndex].traffic)
            {
                resultRequired = this.weekInformations[shiftIndex].traffic / 4;
                resultRequired = resultRequired * (this.weekInformations[shiftIndex].eventImpact / 100);
            }
            else
            {
                resultRequired = this.weekInformations[shiftIndex].peopleReservation / 4;
                if (this.weekInformations[shiftIndex].eventImpact == 100) this.weekInformations[shiftIndex].eventImpact = 100;
                else resultRequired = resultRequired * (this.weekInformations[shiftIndex].eventImpact / 130);
            }
            this.weekInformations[shiftIndex].requiredSkillPoints = Math.ceil(parseFloat(resultRequired));
            return Math.ceil(parseFloat(resultRequired));
        }
    },
    computed: {
        translateShiftName()
        {
            if (this.showedShift == "Lunch") return "Midi"
            else return "Souper"
        },
    },
    watch: {
        scheduleWeek()
        {
            this.loaded = false;
            this.showedShift = "Lunch";
            this.roleShowed = "Tous";
            this.setWeekDayDate();
            this.setDatePropertyMappingateMap();
            this.loadScheduleWeekInfo()
            this.loadEmployee();
            this.loadEvents();

        },
        roleShowed()
        {
            this.refreshEmployee();
        },
        weekInformations: {
            handler(newArray, oldArray)
            {
                // Cette fonction sera appelée à chaque modification de myArray
                for (let i = 0; i < newArray.length; i++)
                {
                    if (newArray[i].traffic < 0 || newArray[i].traffic == '' || newArray[i].traffic == 'e') 
                    {
                        newArray[i].traffic = 0;
                    }
                    if (newArray[i].averageCostByClient < 0 || newArray[i].averageCostByClient == '' || newArray[i].averageCostByClient == 'e') 
                    {
                        newArray[i].averageCostByClient = 0;
                    }
                }
            },
            deep: true,
        },
    },
    beforeMount()
    {
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), 0, 1);
        let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        let weekNumber = Math.ceil(days / 7);
        this.scheduleWeek = currentDate.getFullYear() + "-W" + weekNumber;
        //this.scheduleWeek = "2024-W41";
        this.setWeekDayDate();
        for (let i = 0; i < 14; i++)
        {
            this.weekInformations.push({
                id: 0,
                traffic: 0,
                averageCostByClient: 0
            });
        }
        this.loadScheduleWeekInfo();
    },
    created()
    {

        if (!userSession.employeeNumber && !userSession.password)
        {
            this.$router.push('/espace');
        }
    },
    mounted()
    {
        this.roleList.push("Tous");
        getAllRoles().then(allRoles =>
        {
            allRoles.forEach(role =>
            {
                this.roleList.push(role.name)
            });
        })
        this.loadEmployee();
        this.loadEvents();
        this.setDatePropertyMappingateMap();
    }
}
</script>

<style scoped>
:deep(input)::-webkit-outer-spin-button,
:deep(input)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.slds-form-element__control .slds-radio {
    display: inline !important;
}
</style>