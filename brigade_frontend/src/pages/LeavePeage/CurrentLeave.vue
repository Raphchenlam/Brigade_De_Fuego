<template>
     <v-card :height="$vuetify.display.mdAndUp ? '15rem' : '10rem'" :style="{ background: currentLeave.startDate ? 'lightgreen' : '' }">
                    <v-row class="justify-center mt-5">
                        <p style="font-size: 28px;font-weight: bold;">CONGÉ EN COURS</p>
                    </v-row>
    <div >
        <v-row class="justify-center mt-5">
        <p style="font-size: 28px;"> {{ currentLeaveMessage }}</p>
    </v-row>
    <v-row class="justify-center mt-5">
        <div v-if="currentLeave.startDate">
        <p style="font-size: 20px;"> Du {{ currentLeave.startDate.toLocaleString('fr-FR', { weekday: 'long' }) }}
            {{ currentLeave.startDate.getDate() }} {{
                currentLeave.startDate.toLocaleString('fr-FR', { month: 'long' }) }} {{ currentLeave.startDate.getFullYear() }}</p>
                <p style="font-size: 20px;">Au {{ currentLeave.endDate.toLocaleString('fr-FR', { weekday: 'long' }) }}
            {{ currentLeave.endDate.getDate() }} {{
                currentLeave.endDate.toLocaleString('fr-FR', { month: 'long' }) }} {{ currentLeave.endDate.getFullYear() }}</p>
            </div>
    </v-row>
</div>
</v-card>

</template>


<script>

import userSession from '../../sessions/UserSession';
import { getCurrentLeaveByEmployeeNumber } from '../../services/LeaveService'

export default {
    data()
    {
        return {
            currentLeave:
            {
                startDate: null,
                endDate: null
            },
            currentLeaveMessage: "",
            userSession: userSession
        }
    },
    methods: {
        loadNextShift()
        {
            getCurrentLeaveByEmployeeNumber(userSession.employeeNumber).then(result =>
            {
                console.log("Result", result)
                if (result.id)
                {
                    const startDateString = result.startDate;
                    const startDateObject = new Date(startDateString);
                    const endDateString = result.endDate;
                    const endDateObject = new Date(endDateString);
                    const currentLeave = {
                        startDate: startDateObject,
                        endDate: endDateObject,
                    }
                    this.currentLeave = currentLeave;
                } else
                {
                    this.currentLeaveMessage = result.message;
                }
            }).catch(err =>
            {
                console.error(err);
            })
        }
    },
    mounted()
    {
        console.log("ICI")
        this.loadNextShift();
    }
}
</script>