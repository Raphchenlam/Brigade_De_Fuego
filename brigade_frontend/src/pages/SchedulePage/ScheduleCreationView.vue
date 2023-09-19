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
                                <p align="center" class="text-caption">{{ weekDate.monday.getDate() + "/" +
                                    weekDate.monday.getMonth()
                                    + "/" + weekDate.monday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Mardi</p>
                                <p align="center" class="text-caption">{{ weekDate.tuesday.getDate() + "/" +
                                    weekDate.tuesday.getMonth() + "/" + weekDate.tuesday.getFullYear() }}</p>

                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Mercredi</p>
                                <p align="center" class="text-caption">{{ weekDate.wednesday.getDate() + "/" +
                                    weekDate.wednesday.getMonth() + "/" + weekDate.wednesday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Jeudi</p>
                                <p align="center" class="text-caption">{{ weekDate.thursday.getDate() + "/" +
                                    weekDate.thursday.getMonth() + "/" + weekDate.thursday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Vendredi</p>
                                <p align="center" class="text-caption">{{ weekDate.friday.getDate() + "/" +
                                    weekDate.friday.getMonth() + "/" + weekDate.friday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Samedi</p>
                                <p align="center" class="text-caption">{{ weekDate.saturday.getDate() + "/" +
                                    weekDate.saturday.getMonth() + "/" + weekDate.saturday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Dimanche</p>
                                <p align="center" class="text-caption">{{ weekDate.sunday.getDate() + "/" +
                                    weekDate.sunday.getMonth() + "/" + weekDate.sunday.getFullYear() }}</p>
                            </v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col cols="3">
                                <p align="right" class="text-caption">Achalendage Moyen</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.mondayLunch"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.tuesdayLunch"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.wednesdayLunch"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.thursdayLunch"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.fridayLunch"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.saturdayLunch"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.sundayLunch"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="3">
                                <p align="right" class="text-caption">Facture moyenne par client</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.mondayLunch" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.tuesdayLunch" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.wednesdayLunch" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.thursdayLunch" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.fridayLunch" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.saturdayLunch" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.sundayLunch" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">$
                                    {{ traffic.mondayLunch * averageCostByClient.mondayLunch }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.tuesdayLunch *
                                    averageCostByClient.tuesdayLunch }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.wednesdayLunch *
                                    averageCostByClient.wednesdayLunch }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.thursdayLunch *
                                    averageCostByClient.thursdayLunch }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.fridayLunch *
                                    averageCostByClient.fridayLunch }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.saturdayLunch *
                                    averageCostByClient.saturdayLunch }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.sundayLunch *
                                    averageCostByClient.sundayLunch }}</p>
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
                                <p align="center" class="text-caption">{{ weekDate.monday.getDate() + "/" +
                                    weekDate.monday.getMonth()
                                    + "/" + weekDate.monday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Mardi</p>
                                <p align="center" class="text-caption">{{ weekDate.tuesday.getDate() + "/" +
                                    weekDate.tuesday.getMonth() + "/" + weekDate.tuesday.getFullYear() }}</p>

                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Mercredi</p>
                                <p align="center" class="text-caption">{{ weekDate.wednesday.getDate() + "/" +
                                    weekDate.wednesday.getMonth() + "/" + weekDate.wednesday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Jeudi</p>
                                <p align="center" class="text-caption">{{ weekDate.thursday.getDate() + "/" +
                                    weekDate.thursday.getMonth() + "/" + weekDate.thursday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Vendredi</p>
                                <p align="center" class="text-caption">{{ weekDate.friday.getDate() + "/" +
                                    weekDate.friday.getMonth() + "/" + weekDate.friday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Samedi</p>
                                <p align="center" class="text-caption">{{ weekDate.saturday.getDate() + "/" +
                                    weekDate.saturday.getMonth() + "/" + weekDate.saturday.getFullYear() }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption elevation-1">Dimanche</p>
                                <p align="center" class="text-caption">{{ weekDate.sunday.getDate() + "/" +
                                    weekDate.sunday.getMonth() + "/" + weekDate.sunday.getFullYear() }}</p>
                            </v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col cols="3">
                                <p align="right" class="text-caption">Achalendage Moyen</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.mondayDinner"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.tuesdayDinner"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.wednesdayDinner"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.thursdayDinner"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.fridayDinner"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.saturdayDinner"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="traffic.sundayDinner"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="3">
                                <p align="right" class="text-caption">Facture moyenne par client</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.mondayDinner" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.tuesdayDinner" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.wednesdayDinner" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.thursdayDinner" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.fridayDinner" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.saturdayDinner" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="averageCostByClient.sundayDinner" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">$
                                    {{ traffic.mondayDinner * averageCostByClient.mondayDinner }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.tuesdayDinner *
                                    averageCostByClient.tuesdayDinner }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.wednesdayDinner *
                                    averageCostByClient.wednesdayDinner }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.thursdayDinner *
                                    averageCostByClient.thursdayDinner }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.fridayDinner *
                                    averageCostByClient.fridayDinner }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.saturdayDinner *
                                    averageCostByClient.saturdayDinner }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ traffic.sundayDinner *
                                    averageCostByClient.sundayDinner }}</p>
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
                    <v-col class="ml-2" cols="1">Poste:</v-col>
                    <v-col class="ml-2" cols="2">
                        <v-select v-model="roleShowed" :items="roleList" density="compact"></v-select>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center">Point de competence</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Lundi</p>
                        <p align="center" class="text-caption">{{ weekDate.monday.getDate() + "/" +
                            weekDate.monday.getMonth() + "/" +
                            weekDate.monday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 45</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:red">35</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mardi</p>
                        <p align="center" class="text-caption">{{ weekDate.tuesday.getDate() + "/" +
                            weekDate.tuesday.getMonth() + "/" +
                            weekDate.tuesday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">3</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mercredi</p>
                        <p align="center" class="text-caption">{{ weekDate.wednesday.getDate() + "/" +
                            weekDate.wednesday.getMonth() + "/" +
                            weekDate.wednesday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">3</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Jeudi</p>
                        <p align="center" class="text-caption">{{ weekDate.thursday.getDate() + "/" +
                            weekDate.thursday.getMonth() + "/" +
                            weekDate.thursday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Vendredi</p>
                        <p align="center" class="text-caption">{{ weekDate.friday.getDate() + "/" +
                            weekDate.friday.getMonth() + "/" +
                            weekDate.friday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Samedi</p>
                        <p align="center" class="text-caption">{{ weekDate.saturday.getDate() + "/" +
                            weekDate.saturday.getMonth() + "/" +
                            weekDate.saturday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Dimanche</p>
                        <p align="center" class="text-caption">{{ weekDate.sunday.getDate() + "/" +
                            weekDate.sunday.getMonth() + "/" +
                            weekDate.sunday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56 - 35 >= 5"
                                style="color:green">0</span></p>
                    </v-col>
                </v-row>
                <v-divider class="border-opacity-50 mt-2"></v-divider>
                <v-row v-for="employee in scheduledEmployees" class="justify-end my-2" no-gutters>
                    <v-col class="ml-2" cols="3">
                        <p align="right">{{ employee.employeeNumber + "-" + employee.name }}</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center"> {{ employee.skillPoint }}</p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedule[1].monday != null">
                            <p class="text-caption" align="center"> {{ employee.schedule[1].monday }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedule[2].tuesday != null">
                            <p class="text-caption" align="center">{{ employee.schedule[2].tuesday }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedule[3].wednesday != null">
                            <p class="text-caption" align="center"> {{ employee.schedule[3].wednesday }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedule[4].thursday != null">
                            <p class="text-caption" align="center">{{ employee.schedule[4].thursday }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedule[5].friday != null">
                            <p class="text-caption" align="center">{{ employee.schedule[5].friday }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedule[6].saturday != null">
                            <p class="text-caption" align="center">{{ employee.schedule[6].saturday }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.schedule[0].sunday != null">
                            <p class="text-caption" align="center">{{ employee.schedule[0].sunday }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-divider class="border-opacity-50 mt-2"></v-divider>
                </v-row>


            </v-card>
        </v-sheet>
    </v-sheet>
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
            weekDate: {
                monday: "",
                tuesday: "",
                wednesday: "",
                thursday: "",
                friday: "",
                saturday: "",
                sunday: ""
            },
            traffic: {
                mondayLunch: null,
                mondayDinner: null,
                tuesdayLunch: null,
                tuesdayDinner: null,
                wednesdayLunch: null,
                wednesdayDinner: null,
                thursdayLunch: null,
                thursdayDinner: null,
                fridayLunch: null,
                fridayDinner: null,
                saturdayLunch: null,
                saturdayDinner: null,
                sundayLunch: null,
                sundayDinner: null
            },
            averageCostByClient: {
                mondayLunch: null,
                mondayDinner: null,
                tuesdayLunch: null,
                tuesdayDinner: null,
                wednesdayLunch: null,
                wednesdayDinner: null,
                thursdayLunch: null,
                thursdayDinner: null,
                fridayLunch: null,
                fridayDinner: null,
                saturdayLunch: null,
                saturdayDinner: null,
                sundayLunch: null,
                sundayDinner: null
            },
            scheduledEmployees: [
            ],
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
            this.weekDate.monday = monday;
            this.weekDate.tuesday = tuesday;
            this.weekDate.wednesday = wednesday;
            this.weekDate.thursday = thursday;
            this.weekDate.friday = friday;
            this.weekDate.saturday = saturday;
            this.weekDate.sunday = sunday;

        },
        loadScheduleWeekInfo()
        {
            getScheduleWeekInfoByID(this.scheduleWeek).then(result =>
            {
                //console.log("result de getScheduleWeekInfoByID", result)
                //console.log("date du monday dans le data", this.weekDate.monday.toISOString())
                //console.log("date du monday recu", result[0].date)
                //console.log("est ce egal ?", this.weekDate.monday.toISOString() == result[0].date)

                const datePropertyMapping = {
                    [this.weekDate.monday.toISOString()]: {
                        Midi: { traffic: 'mondayLunch', averageCostByClient: 'mondayLunch' },
                        Soir: { traffic: 'mondayDinner', averageCostByClient: 'mondayDinner' }
                    },
                    [this.weekDate.tuesday.toISOString()]: {
                        Midi: { traffic: 'tuesdayLunch', averageCostByClient: 'tuesdayLunch' },
                        Soir: { traffic: 'tuesdayDinner', averageCostByClient: 'tuesdayDinner' }
                    },
                    [this.weekDate.wednesday.toISOString()]: {
                        Midi: { traffic: 'wednesdayLunch', averageCostByClient: 'wednesdayLunch' },
                        Soir: { traffic: 'wednesdayDinner', averageCostByClient: 'wednesdayDinner' }
                    },
                    [this.weekDate.thursday.toISOString()]: {
                        Midi: { traffic: 'thursdayLunch', averageCostByClient: 'thursdayLunch' },
                        Soir: { traffic: 'thursdayDinner', averageCostByClient: 'thursdayDinner' }
                    },
                    [this.weekDate.friday.toISOString()]: {
                        Midi: { traffic: 'fridayLunch', averageCostByClient: 'fridayLunch' },
                        Soir: { traffic: 'fridayDinner', averageCostByClient: 'fridayDinner' }
                    },
                    [this.weekDate.saturday.toISOString()]: {
                        Midi: { traffic: 'saturdayLunch', averageCostByClient: 'saturdayLunch' },
                        Soir: { traffic: 'saturdayDinner', averageCostByClient: 'saturdayDinner' }
                    },
                    [this.weekDate.sunday.toISOString()]: {
                        Midi: { traffic: 'sundayLunch', averageCostByClient: 'sundayLunch' },
                        Soir: { traffic: 'sundayDinner', averageCostByClient: 'sundayDinner' }
                    }
                };

                result.forEach(element =>
                {
                    const dateKey = element.date;
                    const shiftName = element.shiftName;
                    const mapping = datePropertyMapping[dateKey];

                    if (mapping && mapping[shiftName])
                    {
                        const properties = mapping[shiftName];
                        this.traffic[properties.traffic] = element.averageTraffic;
                        this.averageCostByClient[properties.averageCostByClient] = element.averageCostByClient;
                    }
                });
            }).catch(err =>
            {
                console.log(err)
            });
        },
        loadEmployee()
        {
            getEmployeeScheduleByScheduleWeekId(this.scheduleWeek).then(employeeSchedule =>
            {
                console.log("employeeSchedule", employeeSchedule)
                console.log("weekdate", this.weekDate.friday.getDay())


            }).catch(err =>
            {
                console.log(err)
            });
            const allEmployessTemporaire = [
                {
                    employeeNumber: 3333,
                    name: "Maxime Marchand",
                    role: "Hotesse",
                    skillPoint: 2,
                    schedule: [
                        { sunday: null },
                        { monday: "10:00-16:00" },
                        { tuesday: null },
                        { wednesday: null },
                        { friday: "10:00-16:00" },
                        { saturday: null },
                        { sunday: null }
                    ]
                },
                {
                    employeeNumber: 2222,
                    name: "David Beaudry",
                    role: "Serveur",
                    skillPoint: 9,
                    schedule: [
                        { sunday: "10:00-16:00" },
                        { monday: null },
                        { tuesday: null },
                        { wednesday: null },
                        { friday: null },
                        { saturday: "10:00-16:00" },
                        { sunday: null }
                    ]
                },
                {
                    employeeNumber: 1111,
                    name: "Raphael Chenard-Lamothe",
                    role: "Serveur",
                    skillPoint: 7,
                    schedule: [
                        { sunday: null },
                        { monday: null },
                        { tuesday: null },
                        { wednesday: "10:00-16:00" },
                        { friday: "10:00-16:00" },
                        { saturday: null },
                        { sunday: null }
                    ]
                },
                {
                    employeeNumber: 4444,
                    name: "Francis Maynard",
                    role: "Serveur",
                    skillPoint: 5,
                    schedule: [
                        { sunday: null },
                        { monday: "10:00-16:00" },
                        { tuesday: null },
                        { wednesday: null },
                        { friday: "10:00-16:00" },
                        { saturday: null },
                        { sunday: "10:00-16:00" }
                    ]
                }
            ]
            this.scheduledEmployees = allEmployessTemporaire;
        },
    },
    watch: {
        scheduleWeek()
        {
            this.setWeekDayDate();
            this.loadScheduleWeekInfo(this.scheduleWeek)
        }
    },
    beforeMount()
    {
        this.scheduleWeek = "2024-W41";
        this.setWeekDayDate();
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