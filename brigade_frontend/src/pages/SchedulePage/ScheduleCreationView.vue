<template>
    <v-sheet class="ma-2">
        <v-sheet class="my-2 mx-10">
            <v-row class="justify-space-around">
                <v-col cols="9">
                    <v-card class="pa-1">
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
                                <p align="center" class="text-caption">{{ weekDate.monday.getDate() + "/" + weekDate.monday.getMonth()
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
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="mondayLunch.traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" v-model="tuesdayLunch.traffic"
                                    density="compact" class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="3">
                                <p align="right" class="text-caption">Facture moyenne par client</p>
                            </v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="mondayLunch.averageInvoice" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$"
                                    v-model="tuesdayLunch.averageInvoice" density="compact" class="traffic-input pa-0"
                                    hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                            <v-col class="ml-2" cols="1"><v-text-field type="number" prefix="$" density="compact"
                                    class="traffic-input pa-0" hide-spin-buttons></v-text-field></v-col>
                        </v-row>
                        <v-row class="justify-end" no-gutters>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">$
                                    {{ mondayLunch.traffic * mondayLunch.averageInvoice }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ tuesdayLunch.traffic *
                                    tuesdayLunch.averageInvoice }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ }}</p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ }}
                                </p>
                            </v-col>
                            <v-col class="ml-2" cols="1">
                                <p align="center" class="text-caption">${{ }}</p>
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
                        <p align="center" class="text-caption">{{ weekDate.monday.getDate() + "/" + weekDate.monday.getMonth() + "/" +
                            weekDate.monday.getFullYear() }}</p>
                            <p align="center" class="text-caption">PC requis : 45</p>
                            <p align="center" class="text-caption">PC actuel : <span v-if="56-35 >=5" style="color:red">35</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mardi</p>
                        <p align="center" class="text-caption">{{ weekDate.tuesday.getDate() + "/" + weekDate.tuesday.getMonth() + "/" +
                            weekDate.tuesday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56-35 >=5" style="color:green">3</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Mercredi</p>
                        <p align="center" class="text-caption">{{ weekDate.wednesday.getDate() + "/" + weekDate.wednesday.getMonth() + "/" +
                            weekDate.wednesday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56-35 >=5" style="color:green">3</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Jeudi</p>
                        <p align="center" class="text-caption">{{ weekDate.thursday.getDate() + "/" + weekDate.thursday.getMonth() + "/" +
                            weekDate.thursday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                            <p align="center" class="text-caption">PC actuel : <span v-if="56-35 >=5" style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Vendredi</p>
                        <p align="center" class="text-caption">{{ weekDate.friday.getDate() + "/" + weekDate.friday.getMonth() + "/" +
                            weekDate.friday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56-35 >=5" style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Samedi</p>
                        <p align="center" class="text-caption">{{ weekDate.saturday.getDate() + "/" + weekDate.saturday.getMonth() + "/" +
                            weekDate.saturday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56-35 >=5" style="color:green">0</span></p>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <p align="center" class="text-caption">Dimanche</p>
                        <p align="center" class="text-caption">{{ weekDate.sunday.getDate() + "/" + weekDate.sunday.getMonth() + "/" +
                            weekDate.sunday.getFullYear() }}</p>
                        <p align="center" class="text-caption">PC requis : 0</p>
                        <p align="center" class="text-caption">PC actuel : <span v-if="56-35 >=5" style="color:green">0</span></p>
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
                        <div v-if="employee.monday">
                            <p class="text-caption" align="center"> {{ employee.monday.time }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.tuesday">
                            <p class="text-caption" align="center">{{ employee.tuesday.time }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.wednesday">
                            <p class="text-caption" align="center"> {{ employee.wednesday.time }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.thursday">
                            <p class="text-caption" align="center">{{ employee.thursday.time }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.friday">
                            <p class="text-caption" align="center">{{ employee.friday.time }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.saturday">
                            <p class="text-caption" align="center">{{ employee.saturday.time }}</p>
                        </div>
                        <div v-else><v-btn align="center" height="25" width="100">+</v-btn></div>
                    </v-col>
                    <v-col class="ml-2" cols="1">
                        <div v-if="employee.sunday">
                            <p class="text-caption" align="center">{{ employee.sunday.time }}</p>
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
            mondayLunch: {
                traffic: "",
                averageInvoice: "",
            },
            tuesdayLunch: {
                traffic: "",
                averageInvoice: "",
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
        loadEmployee()
        {
            const allEmployessTemporaire = [
                {
                    employeeNumber: 3333,
                    name: "Maxime Marchand",
                    role: "Hotesse",
                    skillPoint: 2,
                    monday: {
                        time: "10:00-16:00"
                    },
                    tuesday: {
                        time: "11:00-14:00"
                    }
                },
                {
                    employeeNumber: 2222,
                    name: "David Beaudry",
                    role: "Serveur",
                    skillPoint: 9,
                    monday: {
                        time: "15:00-18:00"
                    },
                    tuesday: null
                },
                {
                    employeeNumber: 1111,
                    name: "Raphael Chenard-Lamothe",
                    role: "Serveur",
                    skillPoint: 7,
                    saturday: {
                        time: "15:00-18:00"
                    },

                },
                {
                    employeeNumber: 4444,
                    name: "Francis Maynard",
                    role: "Serveur",
                    skillPoint: 5,
                    wednesday: {
                        time: "15:00-18:00"
                    },
                }
            ]
            this.scheduledEmployees = allEmployessTemporaire;
        }
    },
    watch: {
        scheduleWeek()
        {
            this.setWeekDayDate()
        }
    },
    beforeMount()
    {
        this.scheduleWeek = "2024-W24";
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
        this.loadEmployee()
    }
}

</script>


<style scoped>
:deep(input)::-webkit-outer-spin-button,
:deep(input)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}</style>