<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" lg="6">
                <NextShift />
            </v-col>
            <v-col cols="12" md="6" lg="6">
                <CurrentLeave />
            </v-col>
            <v-col cols="12" sm="12" lg="4">
                <v-card height="20rem">
                    <v-row class="justify-center ma-5">
                        <p style="font-size: 28px;font-weight: bold;text-align: center;">DEMANDE DE CONGÉS EN ATTENTE</p>
                    </v-row>
                    <v-row class="justify-center ma-5">
                        <div>
                            <p class="ma-5" style="font-size: 45px;font-weight: bold;text-align: center;">6</p>
                        </div>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" ms="12" lg="4">
                <v-card height="20rem">
                    <v-row class="justify-center ma-5">
                        <p style="font-size: 28px;font-weight: bold;text-align: center;">État points de compétence (Midi)
                        </p>
                    </v-row>
                    <v-row class="justify-center ma-5">
                        <vue-speedometer :needleHeightRatio="0.85" :minValue="0" :maxValue="meter1.maxValue"
                            :value="meter1.actualSkillPoints" :segments="3" :segmentColors="meter1.segmentColors"
                            :customSegmentStops="meter1.segmentStop" needleColor="black" :needleTransitionDuration="1000"
                            :customSegmentLabels="meter1.segmentLabels" :currentValueText="meter1.currentValueText"
                            needleTransition="easeElastic" />`
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" sm="12" lg="4">
                <v-card height="20rem">
                    <v-row class="justify-center ma-5">
                        <p style="font-size: 28px;font-weight: bold;text-align: center;">État points de compétence (Soir)
                        </p>
                    </v-row>
                    <v-row class="justify-center ma-5">
                        <vue-speedometer :needleHeightRatio="0.85" :minValue="0" :maxValue="meter2.maxValue"
                            :value="meter2.actualSkillPoints" :segments="3" :segmentColors="meter2.segmentColors"
                            :customSegmentStops="meter2.segmentStop" needleColor="black" :needleTransitionDuration="1000"
                            :customSegmentLabels="meter2.segmentLabels" :currentValueText="meter2.currentValueText"
                            needleTransition="easeElastic" />
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import VueSpeedometer from "vue-speedometer"
import NextShift from './NextShift.vue'
import CurrentLeave from './LeavePeage/CurrentLeave.vue'
import BlackButton from '../components/Reusable/BlackButton.vue';

import { getHowManyPeopleByDateAndShiftName } from '../services/ReservationService'
import { fetchEventByDateAndShiftName } from '../services/EventService'
import { getPeriodInfoByDateAndShiftName } from '../services/ScheduleService'

export default {
    inject: ['toLocale'],
    components: {
        NextShift,
        CurrentLeave,
        BlackButton,
        VueSpeedometer
    },
    data()
    {
        return {
            todayDate: null,
            meter1: {
                event: null,
                peopleReservation: 0,
                segmentColors: ["red", "limegreen", "red"],
                segmentStop: [0, 20, 30, 50],
                maxValue: 50, //requiredSkillPoints x 2
                traffic: 0,
                actualSkillPoints: 0, //actualSkillPoints
                requiredSkillPoints: 0,
                currentValueText: "",
                segmentLabels: [
                    {
                        text: "Pas assez",
                        position: "INSIDE",
                        color: "white",
                    },
                    {
                        text: "Parfait",
                        position: "INSIDE",
                        color: "white",
                    },
                    {
                        text: "TROP",
                        position: "INSIDE",
                        color: "white",
                    },
                ],
            },
            meter2: {
                event: null,
                peopleReservation: 0,
                segmentColors: ["red", "limegreen", "red"],
                segmentStop: [0, 20, 30, 50],
                maxValue: 50, //requiredSkillPoints x 2
                traffic: 0,
                actualSkillPoints: 0, //actualSkillPoints
                requiredSkillPoints: 0,
                currentValueText: "",
                segmentLabels: [
                    {
                        text: "Pas assez",
                        position: "INSIDE",
                        color: "white",
                    },
                    {
                        text: "Parfait",
                        position: "INSIDE",
                        color: "white",
                    },
                    {
                        text: "TROP",
                        position: "INSIDE",
                        color: "white",
                    },
                ],
            },
        }
    },
    methods: {
        loadMeterInformations()
        {
            getPeriodInfoByDateAndShiftName(this.todayDate, "Midi").then(result =>
            {
                this.meter1.actualSkillPoints = result.scheduledSkillPoints;
                this.meter1.traffic = result.averageTraffic;
                fetchEventByDateAndShiftName(this.todayDate, "Midi").then(result =>
                {
                    if (result)
                    {
                        this.meter1.event = result;
                    }
                    else
                    {
                        this.meter1.event = {
                            impact: 100
                        }
                    }
                    getHowManyPeopleByDateAndShiftName(this.todayDate, "Midi").then(result =>
                    {
                        this.meter1.peopleReservation = result;
                        this.meter1.requiredSkillPoints = this.calculateRequiredSkillPoints("Midi");
                        this.meter1.maxValue = this.meter1.requiredSkillPoints * 2;
                        let segmentStop = [];
                        segmentStop.push(0);
                        segmentStop.push(this.meter1.requiredSkillPoints - 5)
                        segmentStop.push(this.meter1.requiredSkillPoints + 5)
                        segmentStop.push(this.meter1.maxValue)
                        this.meter1.segmentStop = segmentStop;
                        console.log("this.meter1.requiredSkillPoints", this.meter1.requiredSkillPoints)

                        this.meter1.currentValueText = this.meter1.actualSkillPoints + " actuel / " + this.meter1.requiredSkillPoints + " requis";
                    }).catch(err =>
                    {
                        console.error(err);
                    });
                }).catch(err =>
                {
                    console.error(err);
                });
            }).catch(err =>
            {
                console.error(err);
            });
            getPeriodInfoByDateAndShiftName(this.todayDate, "Soir").then(result =>
            {
                this.meter2.actualSkillPoints = result.scheduledSkillPoints;
                this.meter2.traffic = result.averageTraffic;
                fetchEventByDateAndShiftName(this.todayDate, "Soir").then(result =>
                {
                    if (result)
                    {
                        this.meter2.event = result;
                    }
                    else
                    {
                        this.meter2.event = {
                            impact: 100
                        }
                    }
                    getHowManyPeopleByDateAndShiftName(this.todayDate, "Soir").then(result =>
                    {
                        this.meter2.peopleReservation = result;
                        this.meter2.requiredSkillPoints = this.calculateRequiredSkillPoints("Soir");
                        this.meter2.maxValue = this.meter2.requiredSkillPoints * 2;
                        let segmentStop = [];
                        segmentStop.push(0);
                        segmentStop.push(this.meter2.requiredSkillPoints - 5)
                        segmentStop.push(this.meter2.requiredSkillPoints + 5)
                        segmentStop.push(this.meter2.maxValue)
                        this.meter2.segmentStop = segmentStop;
                        console.log("this.meter2.requiredSkillPoints", this.meter2.requiredSkillPoints)

                        this.meter2.currentValueText = this.meter2.actualSkillPoints + " actuel / " + this.meter2.requiredSkillPoints + " requis";
                    }).catch(err =>
                    {
                        console.error(err);
                    });
                }).catch(err =>
                {
                    console.error(err);
                });
            }).catch(err =>
            {
                console.error(err);
            });
        },
        calculateRequiredSkillPoints(shiftName)
        {
            let resultRequired;
            if (shiftName == "Midi")
            {
                if (!this.meter1.event.impact) this.meter1.event.impact = 100;
                if (this.meter1.peopleReservation < this.meter1.traffic)
                {
                    resultRequired = this.meter1.traffic / 4;
                    resultRequired = resultRequired * (this.meter1.event.impact / 100);
                }
                else
                {
                    resultRequired = this.meter1.peopleReservation / 4;
                    if (this.meter1.event.impact == 100) this.meter1.event.impact = 100;
                    else resultRequired = resultRequired * (this.meter1.event.impact / 130);
                }
                return Math.ceil(parseFloat(resultRequired));
            }
            else
            {
                if (!this.meter2.event.impact) this.meter2.event.impact = 100;
                if (this.meter2.peopleReservation < this.meter2.traffic)
                {
                    resultRequired = this.meter2.traffic / 4;
                    resultRequired = resultRequired * (this.meter2.event.impact / 100);
                }
                else
                {
                    resultRequired = this.meter2.peopleReservation / 4;
                    if (this.meter2.event.impact == 100) this.meter2.event.impact = 100;
                    else resultRequired = resultRequired * (this.meter2.event.impact / 130);
                }
                return Math.ceil(parseFloat(resultRequired));
            }
        },
    },
    beforeMount()
    {
        this.todayDate = this.toLocale(new Date().toLocaleDateString("en-GB")).date.fullDate;
        this.loadMeterInformations()
    }
}
</script>