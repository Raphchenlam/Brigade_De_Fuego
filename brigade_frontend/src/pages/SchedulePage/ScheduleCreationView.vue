<template>
    <v-sheet class="ma-2">
        <v-sheet class="my-2 mx-10">
            <v-row class="justify-space-around">
                <v-col cols="9">
                    <v-card v-if="showedShift == 'Lunch'" class="pa-1">
                        <v-row class="justify-end ma-0 pa-0" no-gutters>
                            <v-col class="ma-1" cols="3">
                                <p align="right" class="text-caption">Ajouter un evenement</p>
                            </v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                        </v-row>
                        <v-row class="justify-end ma-0 pa-0" no-gutters>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Lundi</p>
                                <p align="center" class="text-caption">{{ weekDate[0].getDate() + "/" +
                                    (weekDate[0].getMonth() + 1)
                                    + "/" +  weekDate[0].getFullYear() }}</p>
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
                        <v-row class="justify-end" no-gutters>
                            <v-col cols="3">
                                <p align="right" class="text-caption">Achalendage Moyen</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[0].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[2].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[4].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[6].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[8].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[10].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[12].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="3">
                                <p align="right" class="text-caption">Facture moyenne par client</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[0].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[2].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[4].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[6].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[8].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[10].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[12].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
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
                        <v-row class="justify-end ma-0 pa-0" no-gutters>
                            <v-col class="ma-1" cols="3">
                                <p align="right" class="text-caption">Ajouter un evenement</p>
                            </v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                            <v-col align="center" class="ma-1" cols="1"><v-btn class="elevation-0">+</v-btn></v-col>
                        </v-row>
                        <v-row class="justify-end ma-0 pa-0" no-gutters>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Lundi</p>
                                <p align="center" class="text-caption">{{ weekDate[1].getDate() + "/" +
                                    (weekDate[1].getMonth() + 1)
                                    + "/" + weekDate[1].getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Mardi</p>
                                <p align="center" class="text-caption">{{  weekDate[3].getDate() + "/" +
                                    ( weekDate[3].getMonth() + 1) + "/" +  weekDate[3].getFullYear() }}</p>

                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Mercredi</p>
                                <p align="center" class="text-caption">{{  weekDate[5].getDate() + "/" +
                                    ( weekDate[5].getMonth() + 1) + "/" +  weekDate[5].getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Jeudi</p>
                                <p align="center" class="text-caption">{{  weekDate[7].getDate() + "/" +
                                    ( weekDate[7].getMonth() + 1) + "/" +  weekDate[7].getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Vendredi</p>
                                <p align="center" class="text-caption">{{  weekDate[9].getDate() + "/" +
                                    ( weekDate[9].getMonth() + 1) + "/" +  weekDate[9].getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Samedi</p>
                                <p align="center" class="text-caption">{{  weekDate[11].getDate() + "/" +
                                    ( weekDate[11].getMonth() + 1) + "/" +  weekDate[11].getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Dimanche</p>
                                <p align="center" class="text-caption">{{ weekDate[13].getDate() + "/" +
                                    ( weekDate[13].getMonth() + 1) + "/" +  weekDate[13].getFullYear() }}</p>
                            </v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col cols="3">
                                <p align="right" class="text-caption">Achalendage Moyen</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[1].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[3].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[5].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[7].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[9].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[11].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="weekInformations[13].traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="3">
                                <p align="right" class="text-caption">Facture moyenne par client</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[1].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[3].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[5].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[7].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[9].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[11].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[13].averageCostByClient" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
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
                <v-col cols="3">
                    <v-text-field density="compact" type="week" v-model="scheduleWeek" label="Semaine">
                    </v-text-field>
                    <v-radio-group label="Shift" v-model="showedShift">
                        <v-radio label="Midi" value="Lunch"> </v-radio>
                        <v-radio label="Souper" value="Dinner"> </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
        </v-sheet>
        <v-sheet class="mx-15 my-5">
            <v-row class="justify-space-between">
                <v-btn>Ajouter un employe</v-btn>
                <v-btn>Sauvegarger</v-btn>
            </v-row>
        </v-sheet>
        <v-sheet class="mx-10">
            <v-card class="pa-2 w-100 h-screen elevation-4">
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
                        <p align="center" class="text-caption">Point de competence</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Lundi</p>
                        <p align="center" class="text-caption">{{ weekDate[0].getDate() + "/" +
                            (weekDate[0].getMonth() + 1) + "/" +
                            weekDate[0].getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 45</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:red">35</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mardi</p>
                        <p align="center" class="text-caption">{{ weekDate[2].getDate() + "/" +
                            (weekDate[2].getMonth() + 1) + "/" +
                            weekDate[2].getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">3</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mercredi</p>
                        <p align="center" class="text-caption">{{ weekDate[4].getDate() + "/" +
                            (weekDate[4].getMonth() + 1) + "/" +
                            weekDate[4].getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">3</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Jeudi</p>
                        <p align="center" class="text-caption">{{ weekDate[6].getDate() + "/" +
                            (weekDate[6].getMonth() + 1) + "/" +
                            weekDate[6].getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Vendredi</p>
                        <p align="center" class="text-caption">{{ weekDate[8].getDate() + "/" +
                            (weekDate[8].getMonth() + 1) + "/" +
                            weekDate[8].getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Samedi</p>
                        <p align="center" class="text-caption">{{ weekDate[10].getDate() + "/" +
                            (weekDate[10].getMonth() + 1) + "/" +
                            weekDate[10].getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Dimanche</p>
                        <p align="center" class="text-caption">{{ weekDate[12].getDate() + "/" +
                            (weekDate[12].getMonth() + 1) + "/" +
                            weekDate[12].getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                </v-row>
                <v-divider class="border-opacity-50 mt-2"></v-divider>
                <v-sheet v-if="showedShift == 'Lunch'">
                <v-row v-for="employee in scheduledEmployees" class="justify-end my-2" no-gutters>
                    <v-col class="ml-2" cols="3">
                        <p align="right" class="text-caption">{{ employee.employeeNumber + "-" + employee.name }}</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption"> {{ employee.skillPoint }}</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[0].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[0].time }}</v-btn>
                        </div>
                        <div v-else><v-btn @click="addShiftToEmployee(employee, 0)" align="center" height="25"
                                width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[2].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[2].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[4].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[4].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[6].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[6].time }}</v-btn>
                        </div>

                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[8].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[8].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[10].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[10].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[12].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[12].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-divider class="border-opacity-50 mt-2"></v-divider>
                </v-row>
            </v-sheet>

            <v-sheet v-else>
                <v-row v-for="employee in scheduledEmployees" class="justify-end my-2" no-gutters>
                    <v-col class="ml-2" cols="3">
                        <p align="right" class="text-caption">{{ employee.employeeNumber + "-" + employee.name }}</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption"> {{ employee.skillPoint }}</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[1].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[1].time }}</v-btn>
                        </div>
                        <div v-else><v-btn @click="addShiftToEmployee(employee, 1)" align="center" height="25"
                                width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[3].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[3].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[5].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[5].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[7].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[7].time }}</v-btn>
                        </div>

                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[9].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[9].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[11].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[11].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedules[13].time != null">
                            <v-btn align="center" class="text-caption" height="25" width="100">{{
                                employee.schedules[13].time }}</v-btn>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-divider class="border-opacity-50 mt-2"></v-divider>
                </v-row>
            </v-sheet>
            </v-card>
        </v-sheet>



        
    </v-sheet>
    <v-dialog v-model="dialogNewShift" width="75%">
        <v-card>
            <v-card-title>
                Ajouter un nouveau shift a {{ employeeNewShift }} pour le {{ dayNewShift }}
            </v-card-title>
            <v-card-actions>
                <v-btn @click="dialogNewShift = false">Annuler</v-btn>
                <v-btn>Sauvegarder</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>



<script>

import { getAllRoles } from '../../services/EmployeeService'
import { getScheduleWeekInfoByID, getEmployeeScheduleByScheduleWeekId } from '../../services/ScheduleService'

export default {

    data()
    {
        return {
            roleList: [],
            roleShowed: "Tous",
            scheduleWeek: null,
            showedShift: "Lunch",
            weekDate: [
            ],
            weekInformations: [
            ],
            scheduledEmployees: [
            ],
            dialogNewShift: false,
            employeeNewShift: null,
            dayNewShift: null,
            startTimeNewShift: null,
            endTimeNewShift: null,
            datePropertyMapping: null
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
                //console.log("result de getScheduleWeekInfoByID", result)
                //console.log("date du monday dans le data", this.weekDate.monday.toISOString())
                //console.log("date du monday recu", result[0].date)
                //console.log("est ce egal ?", this.weekDate.monday.toISOString() == result[0].date)


                console.log("result", result);
                result.forEach(element =>
                {
                    console.log("element", element)
                    const dateKey = element.date;
                    const shiftName = element.shiftName;
                    const mapping = this.datePropertyMapping[dateKey];
                    console.log("datekey", dateKey);
                    console.log("shiftName", shiftName);
                    console.log("mapping", mapping);

                    if (mapping && mapping[shiftName])
                    {
                        const properties = mapping[shiftName];
                        console.log("properties",properties)
                        const shiftIndex = properties.index;
                        console.log("shiftIndex",shiftIndex)
                        this.weekInformations[shiftIndex].id = element.id;
                        this.weekInformations[shiftIndex].traffic = element.averageTraffic;
                        this.weekInformations[shiftIndex].averageCostByClient = element.averageCostByClient;
                        console.log("blabla",this.weekInformations)
                    }
                });
            }).catch(err =>
            {
                console.log(err)
            });
        },
        loadEmployee()
        {
            getEmployeeScheduleByScheduleWeekId(this.scheduleWeek).then(employeeInSchedule =>
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

                            const newSchedule = {
                                id: element.id,
                            }

                            newEmployee.schedules[shiftIndex] = {
                                shiftName: element.shiftName,
                                startTime: element.startTime.split(':').slice(0, 2).join(':'),
                                endTime: element.endTime.split(':').slice(0, 2).join(':'),
                                time: element.startTime.split(':').slice(0, 2).join(':') + " - " + element.endTime.split(':').slice(0, 2).join(':')
                            }
                        }
                    });
                    this.scheduledEmployees.push(newEmployee);
                });
            }).catch(err =>
            {
                console.log(err)
            });
        },
        addShiftToEmployee(employee, dayIndex)
        {

            employee.schedules[dayIndex] =
            {
                startTime: "10:00",
                endTime: "20:00",
                time: "10:00 - 20:00"
            }
            this.employeeNewShift = employee.name;
            this.dayNewShift = this.weekDate[dayIndex];
            this.dialogNewShift = true;
        }
    },
    watch: {
        scheduleWeek()
        {
            this.setWeekDayDate();
            this.loadScheduleWeekInfo(this.scheduleWeek);
            this.loadEmployee();
        }
    },
    beforeMount()
    {
        this.scheduleWeek = "2024-W41";
        this.setWeekDayDate();
        for (let i = 0; i < 14; i++)
        {
            this.weekInformations.push({
                id: 0,
                traffic: 0,
                averageCostByClient: 0
            });
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
        this.loadScheduleWeekInfo();
        this.loadEmployee();
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
    }
}
</script>

<style scoped>
:deep(input)::-webkit-outer-spin-button,
:deep(input)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>