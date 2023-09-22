<template>
    <v-sheet class="ma-2" v-if="userSession">
        <v-sheet class="my-2 mx-10" v-if="this.isUserAuthorized()">
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
                                    v-model="weekInformations[0].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[2].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[4].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[6].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[8].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[10].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[12].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
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
                                    v-model="weekInformations[1].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[3].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[5].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[7].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[9].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[11].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="weekInformations[13].averageCostByClient" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
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
        <v-sheet class="mx-15 my-5" v-if="this.isUserAuthorized()">
            <v-row class="justify-space-between">
                <v-btn @click="dialogAddEmployee = true">Ajouter un employe</v-btn>
                <v-btn @click="saveSchedule()">Sauvegarger</v-btn>
            </v-row>
        </v-sheet>
        <v-sheet class="mx-10" v-if="this.isUserAuthorized()">
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
                    <v-row v-for="employee in scheduledEmployeesShow" class="justify-end my-2" no-gutters>
                        <v-col class="ml-2" cols="3">
                            <v-row align="center" class="justify-space-between">
                                <v-col cols="1">
                                    <CloseRedButton @click="removeEmployeeFromSchedule(employee.employeeNumber)">
                                    </CloseRedButton>
                                </v-col>
                                <v-col cols="11">
                                    <p align="center">({{ employee.employeeNumber }}) {{ employee.name }}</p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <p align="center">{{ employee.skillPoints }}</p>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[0].time != null">
                                <v-btn :color="employee.schedules[1].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
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
                                <v-btn :color="employee.schedules[3].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[2].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 2)"
                                    :color="employee.schedules[3].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[4].time != null">
                                <v-btn :color="employee.schedules[5].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[4].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 4)"
                                    :color="employee.schedules[5].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[6].time != null">
                                <v-btn :color="employee.schedules[7].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[6].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 6)"
                                    :color="employee.schedules[7].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[8].time != null">
                                <v-btn :color="employee.schedules[9].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[8].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 8)"
                                    :color="employee.schedules[9].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[10].time != null">
                                <v-btn :color="employee.schedules[11].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[10].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 10)"
                                    :color="employee.schedules[11].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[12].time != null">
                                <v-btn :color="employee.schedules[13].time ? '#dcdcdc' : ''" align="center"
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
                                    <p align="center">({{ employee.employeeNumber }}) {{ employee.name }}</p>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <p align="center"> {{ employee.skillPoints }}</p>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[1].time != null">
                                <v-btn :color="employee.schedules[0].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
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
                                <v-btn :color="employee.schedules[2].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[3].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 3)"
                                    :color="employee.schedules[2].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[5].time != null">
                                <v-btn :color="employee.schedules[4].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[5].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 5)"
                                    :color="employee.schedules[4].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[7].time != null">
                                <v-btn :color="employee.schedules[6].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[7].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 7)"
                                    :color="employee.schedules[6].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[9].time != null">
                                <v-btn :color="employee.schedules[8].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[9].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 9)"
                                    :color="employee.schedules[8].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[11].time != null">
                                <v-btn :color="employee.schedules[10].time ? '#dcdcdc' : ''" align="center"
                                    class="text-caption" height="25" width="100">{{
                                        employee.schedules[11].time }}</v-btn>
                            </div>
                            <div v-else><v-btn @click="addShiftToEmployee(employee, 11)"
                                    :color="employee.schedules[10].time ? '#dcdcdc' : ''" align="center" height="25"
                                    width="100">+</v-btn></div>
                        </v-col>
                        <v-col class="ml-2" cols="1">
                            <div v-if="employee.schedules[13].time != null">
                                <v-btn :color="employee.schedules[12].time ? '#dcdcdc' : ''" align="center"
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

    <v-dialog v-model="dialogAddEmployee" width="75%" persistent>
        <v-card class="pa-5">
            <v-card-title>
                Ajouter un employé a la liste
            </v-card-title>
            <p v-if="warningEmployeeAlreadyInScheduleMessage" align="center" class="warning-message">L'employé est déjà dans
                l'horaire</p>
            <EmployeeList height="600"></EmployeeList>
            <v-row class="justify-end">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="dialogAddEmployee = false"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Sauvegarder" @click="addNewEmployeeToSchedule()"></DarkRedButton>
            </v-row>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNewShift" width="75%" persistent>
        <v-card class="pa-5">
            <v-card-title>
                Ajouter un nouveau shift a {{ employeeNewShift.name }} pour le {{ this.weekDate[dayNewShift] }}
            </v-card-title>
            <v-row class="justify-end">
                <DarkRedButton class="mx-5" textbutton="Annuler" @click="dialogNewShift = false"></DarkRedButton>
                <DarkRedButton class="mx-5" textbutton="Sauvegarder" @click="confirmShiftToEmployee()"></DarkRedButton>
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
</template>



<script>
import CloseRedButton from '../../components/Reusable/CloseRedButton.vue'
import DarkRedButton from '../../components/Reusable/DarkRedButton.vue'
import EmployeeList from '../EmployeePage/EmployeeList.vue'
import { getAllRoles, getEmployeeByEmployeeNumber } from '../../services/EmployeeService'
import { getScheduleWeekInfoByID, getEmployeeScheduleByScheduleWeekId, updateSchedule } from '../../services/ScheduleService'
import userSession from '../../sessions/UserSession'

export default {
    inject: ['isUserAuthorized'],
    components: {
        EmployeeList,
        DarkRedButton,
        CloseRedButton
    },
    data() {
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
            scheduledEmployeesShow: [
            ],
            dialogNewShift: false,
            dialogAddEmployee: false,
            dialogSaved: false,
            employeeNewShift: null,
            dayNewShift: null,
            startTimeNewShift: null,
            endTimeNewShift: null,
            datePropertyMapping: null,
            selectedEmployeeNumberToAdd: null,
            warningEmployeeAlreadyInScheduleMessage: false,
            userSession: userSession
        }
    },
    provide() {
        return {
            loadEmployeeNumber: this.loadSelectedEmployeeNumberToAdd,
        }
    },
    methods: {
        splitWeekAndYear(yearWeek) {
            return {
                year: parseInt(yearWeek.split('-').slice(0)[0]),
                week: parseInt(yearWeek.split('W').slice(0)[1])
            }
        },
        setWeekDayDate() {
            const splittedYearWeek = this.splitWeekAndYear(this.scheduleWeek);
            const monday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 6);
            const tuesday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 5);
            const wednesday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 4);
            const thursday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 3);
            const friday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 2);
            const saturday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7) - 1);
            const sunday = new Date(splittedYearWeek.year, 0, (1 + (splittedYearWeek.week) * 7));
            while (sunday.getDay() !== 0) {
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
        loadScheduleWeekInfo() {
            getScheduleWeekInfoByID(this.scheduleWeek).then(result => {
                result.forEach(element => {
                    const dateKey = element.date;
                    const shiftName = element.shiftName;
                    const mapping = this.datePropertyMapping[dateKey];

                    if (mapping && mapping[shiftName]) {
                        const properties = mapping[shiftName];
                        const shiftIndex = properties.index;
                        this.weekInformations[shiftIndex].id = element.id;
                        this.weekInformations[shiftIndex].traffic = element.averageTraffic;
                        this.weekInformations[shiftIndex].averageCostByClient = element.averageCostByClient;
                    }
                });
            }).catch(err => {
                console.log(err)
            });
        },
        loadEmployee() {
            getEmployeeScheduleByScheduleWeekId(this.scheduleWeek).then(employeeInSchedule => {
                this.scheduledEmployees = [];
                employeeInSchedule.forEach(employee => {
                    const newEmployee = {
                        employeeNumber: employee.employeeNumber,
                        name: employee.name,
                        role: employee.role,
                        skillPoints: employee.skillPoints,
                        schedules: [
                        ]
                    };
                    for (let i = 0; i < 14; i++) {
                        newEmployee.schedules.push({
                            id: this.weekInformations[i].id,
                            startTime: null,
                            endTime: null,
                            time: null
                        })
                    }
                    employee.schedules.forEach(element => {
                        const dateKey = element.date;
                        const shiftName = element.shiftName;
                        const mapping = this.datePropertyMapping[dateKey];

                        if (mapping && mapping[shiftName]) {
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
            }).catch(err => {
                console.log(err)
            });
        },
        refreshEmployee()
        {
            let newEmployeeList = [];
            this.scheduledEmployees.forEach(employee => {
                if (this.roleShowed == "Tous" || employee.role == this.roleShowed) {
                    newEmployeeList.push(employee);
                }
            });
            this.scheduledEmployeesShow = newEmployeeList;
        },
        addShiftToEmployee(employee, dayIndex) {
            this.employeeNewShift = employee;
            this.dayNewShift = dayIndex;
            this.dialogNewShift = true;
        },
        confirmShiftToEmployee() {
            let shiftId = this.employeeNewShift.schedules[this.dayNewShift].id;
            if (this.dayNewShift % 2 == 0) {
                this.employeeNewShift.schedules[this.dayNewShift] =
                {
                    id: shiftId,
                    startTime: "10:00",
                    endTime: "16:00",
                    time: "10:00 - 16:00"
                }
            } else {
                this.employeeNewShift.schedules[this.dayNewShift] =
                {
                    id: shiftId,
                    startTime: "16:00",
                    endTime: "23:00",
                    time: "16:00 - 23:00"
                }
            }
            this.dialogNewShift = false;
        },
        addNewEmployeeToSchedule() {
            //if (!this.selectedEmployeeNumberToAdd) { return }
            let found = this.scheduledEmployees.find(({ employeeNumber }) => employeeNumber == this.selectedEmployeeNumberToAdd);
            if (found)
            {
                this.warningEmployeeAlreadyInScheduleMessage = true;
            }
            else {
                this.warningEmployeeAlreadyInScheduleMessage = false;
                getEmployeeByEmployeeNumber(this.selectedEmployeeNumberToAdd).then(employee => {
                    const newEmployee = {
                        employeeNumber: employee.employeeNumber,
                        name: employee.firstName + " " + employee.lastName,
                        role: employee.role,
                        skillPoints: employee.skillPoints,
                        schedules: []
                    }
                    for (let i = 0; i < 14; i++) {
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

                }).catch(err => {
                    console.log(err);
                })

            }
        },
        removeEmployeeFromSchedule(employeeNumberToRemove) {
            let found = this.scheduledEmployees.find(({ employeeNumber }) => employeeNumber == employeeNumberToRemove);
            if (found)
            {
                const index = this.scheduledEmployees.indexOf(found);
                const x = this.scheduledEmployees.splice(index, 1);
                this.refreshEmployee();
            }
        },
        loadSelectedEmployeeNumberToAdd(employeeNumber) {
            this.selectedEmployeeNumberToAdd = employeeNumber;
        },
        saveSchedule() {
            const weekInformations = {
                scheduleWeekId: this.scheduleWeek,
                weekInformations: this.weekInformations,
                scheduledEmployees: this.scheduledEmployees
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
        closeDialogSaved() {
            this.dialogSaved = false;
        },
        setDatePropertyMappingateMap() {
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
    },
    watch: {
        scheduleWeek() {
            this.showedShift = "Lunch";
            this.roleShowed = "Tous";
            this.setWeekDayDate();
            this.setDatePropertyMappingateMap();
            this.loadScheduleWeekInfo()
            this.loadEmployee();

        },
        roleShowed() {
            this.refreshEmployee();
        }
    },
    created() {
        this.userSession = userSession;
        if (!this.userSession) {
            this.$router.push('/espace');
        }
    },
    beforeMount() {
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), 0, 1);
        let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        let weekNumber = Math.ceil(days / 7);
        this.scheduleWeek = currentDate.getFullYear() + "-W" + weekNumber;
        //this.scheduleWeek = "2024-W41";
        this.setWeekDayDate();
        for (let i = 0; i < 14; i++) {
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
        getAllRoles().then(allRoles => {
            allRoles.forEach(role => {
                this.roleList.push(role.name)
            });
        })
        this.loadEmployee();
        this.setDatePropertyMappingateMap();
        this.loadScheduleWeekInfo();
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