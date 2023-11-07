<template>
    <v-sheet class="ma-2 h-50">
        <v-sheet class="my-5 mx-10">
            <v-row class="justify-center">
                <v-col cols="12" md="6" lg="4">
                    Selection de la semaine pour l'horaire
                    <v-text-field density="compact" type="week" v-model="scheduleWeek">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row class="justify-center ma-5">
                Semaine du Lundi {{ weekDate[0].getDate() }} {{ weekDate[0].toLocaleString('fr-FR', { month: 'long' }) }} {{
                    weekDate[0].getFullYear() }} au
                Dimanche {{ weekDate[13].getDate() }} {{ weekDate[13].toLocaleString('fr-FR', { month: 'long' }) }} {{
                    weekDate[13].getFullYear() }}
            </v-row>
        
            <v-sheet v-if="personalSchedule.length > 0" v-for="shift in personalSchedule" class="boxed-center-large" :style="{ background: areSameDate(shift.dateObj) ? 'lightgreen' : '' }">
                <h3>{{ shift.dateObj.toLocaleString('fr-FR', { weekday: 'long' }) }} {{ shift.dateObj.getDate() }} {{
                    shift.dateObj.toLocaleString('fr-FR', { month: 'long' }) }} {{ shift.dateObj.getFullYear() }}</h3>
                <h3> {{ shift.shiftName }}</h3>
                <br />
                <p>Heure debut: {{ shift.startTime.split(":").slice(0, 2).join(":") }}</p>
                <p>Heure Fin (approximative): {{ shift.endTime.split(":").slice(0, 2).join(":") }}</p>
            </v-sheet>
            <v-sheet v-else>
                <v-row class="justify-center my-10">
                    <h2>Vous n'avez aucun horaire présentement pour cette semaine ci</h2>
                </v-row>
            </v-sheet>
        </v-sheet>
    </v-sheet>
</template>

<script>
import userSession from '../../sessions/UserSession'
import { getScheduleWeekInfoByID, getScheduleForOneEmployeeByEmployeeNumberAndScheduleWeekId } from '../../services/ScheduleService'
export default {
    inject: ['isUserAuthorized'],
    props: {
        employeeNumber: Number
    },
    data()
    {
        return {
            userSession: userSession,
            today: null,
            personalSchedule: [

            ],
            scheduleWeek: null,
            weekDate: [
            ],
            weekInformations: [
            ],
            datePropertyMapping: null,

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
        loadScheduleWeekInfo()
        {
            getScheduleWeekInfoByID(this.scheduleWeek).then(result =>
            {
                result.forEach(element =>
                {
                    const dateKey = element.date;
                    const shiftName = element.shiftName;
                    const mapping = this.datePropertyMapping[dateKey];

                    if (mapping && mapping[shiftName])
                    {
                        const properties = mapping[shiftName];
                        const shiftIndex = properties.index;
                        this.weekInformations[shiftIndex].id = element.id;
                    }
                });
            }).catch(err =>
            {
                console.error(err)
            });
        },
        loadPersonalSchedule()
        {
            getScheduleForOneEmployeeByEmployeeNumberAndScheduleWeekId(this.employeeNumber, this.scheduleWeek).then(result =>
            {
                this.personalSchedule = [];
                result.forEach(element =>
                {
                    if (element.isPublished) {
                    const dateString = element.date;
                    const dateObject = new Date(dateString);
                    const newShift = {
                        id: element.id,
                        employeeNumber: element.employeeNumber,
                        date: element.date,
                        dateObj: dateObject,
                        shiftName: element.shiftName,
                        startTime: element.startTime,
                        endTime: element.endTime,
                        time: element.time
                    }
                        this.personalSchedule.push(newShift);
                    }
                });
            }).catch(err =>
            {
                console.error(err)
            })
        },
        areSameDate(itemDate)
        {
            return this.today.getTime() == itemDate.getTime();
        }
    },

    watch:
    {
        scheduleWeek()
        {
            this.setWeekDayDate();
            this.loadScheduleWeekInfo();
            this.setDatePropertyMappingateMap();
            this.loadPersonalSchedule();
        }
    },
    beforeMount()
    {
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(), 0, 1);
        let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        let weekNumber = Math.ceil(days / 7);
        this.scheduleWeek = currentDate.getFullYear() + "-W" + weekNumber;
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
    created()
    {
        if (!userSession.employeeNumber && !userSession.password)
        {
            this.$router.push('/espace');
        }
    },
    mounted()
    {
        this.loadScheduleWeekInfo();
        this.setDatePropertyMappingateMap();
        this.loadPersonalSchedule();
        this.today = new Date();
        this.today.setHours(0);
        this.today.setMinutes(0);
        this.today.setSeconds(0);
        this.today.setMilliseconds(0);
    }
}

</script>