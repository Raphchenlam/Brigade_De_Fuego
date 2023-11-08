<template>
    <v-card :height="$vuetify.display.mdAndUp ? '15rem' : '10rem'"
    :style="{ background: areSameDate(nextShift.date) ? 'lightgreen' : '' }">
        <v-row class="justify-center ma-5">
            <p style="font-size: 28px;font-weight: bold;">MON PROCHAIN SHIFT</p>
        </v-row>
        <v-row class="justify-center mx-2">
            <p style="font-size: 20px;"> {{ nextShiftMessage }}</p>
        </v-row>
        <v-row class="justify-center mb-2">
            <p v-if="nextShift.date" style="font-size: 20px;"> {{ nextShift.date.toLocaleString('fr-FR', {
                weekday: 'long'
            }) }}
                {{ nextShift.date.getDate() }} {{
                    nextShift.date.toLocaleString('fr-FR', { month: 'long' }) }} {{ nextShift.date.getFullYear() }}</p>
        </v-row>
        <v-row class="justify-center mx-2">
            <p v-if="nextShift.startTime" style="font-size: 20px;">Heure debut: <span
                    style="font-size: 20px;font-weight: bold;">{{ nextShift.startTime.split(":").slice(0, 2).join(":")
                    }}</span>
            </p>
        </v-row>
        <v-row class="justify-center mx-2">
            <p v-if="nextShift.endTime" style="font-size: 20px;">Heure fin (approximatif): <span
                    style="font-size: 20px;font-weight: bold;">{{ nextShift.endTime.split(":").slice(0, 2).join(":")
                    }}</span>
            </p>
        </v-row>
    </v-card>
</template>



<script>

import userSession from '../sessions/UserSession';
import { getNextShiftForEmployee } from '../services/ScheduleService'

export default {
    data()
    {
        return {
            nextShift:
            {
                date: null,
                startTime: null,
                endTime: null
            },
            nextShiftMessage: "",
            today: null,
            userSession: userSession
        }
    },
    methods: {
        loadNextShift()
        {
            getNextShiftForEmployee(userSession.employeeNumber).then(result =>
            {
                if (result.id)
                {
                    const dateString = result.date;
                    const dateObject = new Date(dateString);
                    const newShift = {
                        date: dateObject,
                        startTime: result.startTime,
                        endTime: result.endTime
                    }
                    this.nextShift = newShift;
                } else
                {
                    this.nextShiftMessage = result.message;
                }
            }).catch(err =>
            {
                console.error(err);
            })
        },
        areSameDate(itemDate)
        {
            if (!itemDate) return false;
            itemDate.setHours(0, 0, 0, 0);
console.log("this.today.getTime()",this.today.getTime())
console.log("this.today.getTime()",this.today.getTime())
            return this.today.getTime() == itemDate.getTime();
        }
    },
    mounted()
    {
        this.today = new Date();
        this.today.setHours(0);
        this.today.setMinutes(0);
        this.today.setSeconds(0);
        this.today.setMilliseconds(0);
        this.loadNextShift();
    }
}
</script>