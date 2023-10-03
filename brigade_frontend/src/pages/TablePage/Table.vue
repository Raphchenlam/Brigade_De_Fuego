<template>
    <div>
        <!-- <v-btn class="tableIcon" variant="text" >    -->
        <svg width="83" height="80" viewBox="0 0 83 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="brigade_table4">
                <rect width="83" height="80" fill="white" />
                <path id="seat1"
                    d="M35.5 14.5C35.5 16.0818 34.5633 17.5695 32.9352 18.6835C31.3094 19.7959 29.0358 20.5 26.5 20.5C23.9642 20.5 21.6906 19.7959 20.0648 18.6835C18.4367 17.5695 17.5 16.0818 17.5 14.5C17.5 12.9182 18.4367 11.4305 20.0648 10.3165C21.6906 9.2041 23.9642 8.5 26.5 8.5C29.0358 8.5 31.3094 9.2041 32.9352 10.3165C34.5633 11.4305 35.5 12.9182 35.5 14.5Z"
                    fill="#D9D9D9" stroke="black" />
                <path id="seat2"
                    d="M64.5 14.5C64.5 16.0818 63.5633 17.5695 61.9352 18.6835C60.3094 19.7959 58.0358 20.5 55.5 20.5C52.9642 20.5 50.6906 19.7959 49.0648 18.6835C47.4367 17.5695 46.5 16.0818 46.5 14.5C46.5 12.9182 47.4367 11.4305 49.0648 10.3165C50.6906 9.2041 52.9642 8.5 55.5 8.5C58.0358 8.5 60.3094 9.2041 61.9352 10.3165C63.5633 11.4305 64.5 12.9182 64.5 14.5Z"
                    fill="#D9D9D9" stroke="black" />
                <path id="seat4"
                    d="M35.5 66.5C35.5 68.0818 34.5633 69.5695 32.9352 70.6835C31.3094 71.7959 29.0358 72.5 26.5 72.5C23.9642 72.5 21.6906 71.7959 20.0648 70.6835C18.4367 69.5695 17.5 68.0818 17.5 66.5C17.5 64.9182 18.4367 63.4305 20.0648 62.3165C21.6906 61.2041 23.9642 60.5 26.5 60.5C29.0358 60.5 31.3094 61.2041 32.9352 62.3165C34.5633 63.4305 35.5 64.9182 35.5 66.5Z"
                    fill="#D9D9D9" stroke="black" />
                <path id="seat5"
                    d="M64.5 66.5C64.5 68.0818 63.5633 69.5695 61.9352 70.6835C60.3094 71.7959 58.0358 72.5 55.5 72.5C52.9642 72.5 50.6906 71.7959 49.0648 70.6835C47.4367 69.5695 46.5 68.0818 46.5 66.5C46.5 64.9182 47.4367 63.4305 49.0648 62.3165C50.6906 61.2041 52.9642 60.5 55.5 60.5C58.0358 60.5 60.3094 61.2041 61.9352 62.3165C63.5633 63.4305 64.5 64.9182 64.5 66.5Z"
                    fill="#D9D9D9" stroke="black" />
                <rect id="table" @click="selectTable" x="10.5" y="18.5" width="61" height="44" :fill="tableColor"
                    stroke="black" />
                <text @click="selectTable" id="table_number" :fill="textColor" xml:space="preserve" style="white-space: pre" font-family="Inter"
                    font-size="24" letter-spacing="0em">
                    <tspan x="20.9219" y="41.2273">{{ tableNumberFormatted }}</tspan>
                </text>
                <text @click="selectTable" id="table_capacity" :fill="textColor" xml:space="preserve" style="white-space: pre"
                    font-family="Inter" font-size="13" letter-spacing="0em">
                    <tspan x="31.6196" y="57.7273">({{ tableCapacity }})</tspan>
                </text>
            </g>
        </svg>
        <!-- </v-btn> -->
    </div>
</template>

<script>
import brigade_table4 from '../../public/table_images/brigade_table4.svg'


export default {
    props: {
        tableNumber: String,
        tableCapacity: Number,
        isAssign: Boolean,
        tableIsActive: Boolean,
        assignation: Object
        //hasReservation: Boolean,

    },
    inject: ['hasReservation', 'displaySelectedTable', 'selectTableInSection', 'inEditionMode'],
    data() {
        return {
            employeeColor: null,
            textColor: "black", //a changer
            tableColor: "white", // a changer
            fillDarkColor: "",
            fillLightColor: "",
            tableNumberFormatted: "000",
            //selected:null,
            //tableCapacity: "6",
            //validRegexTableNumber: "/^\d{3}$/gm"
        }
    },
    methods: {
        selectTable() {
            if (this.inEditionMode) {
                this.selectTableInSection(this.tableNumber);
            } else {
                this.displaySelectedTable(this.tableNumber);
            }
        },
        tableSetUp() {
            this.setColorTones();
            this.setTableNumberFormatted();
            this.setIsActive();
            this.setTableColor();
        },
        setColorTones() {
            if (this.isAssign) {
                this.fillDarkColor = this.assignation.employeeColor;
                this.fillLightColor = this.employeeColor + "75";
            }
        },
        setTableNumberFormatted() {
            if (/^\d{3}$/gm.test(this.tableNumber)) {
                this.tableNumberFormatted = this.tableNumber;
            } else if (/^\d{2}$/gm.test(this.tableNumber)) {
                this.tableNumberFormatted = "0" + this.tableNumber;
            } else if (/^\d{1}$/gm.test(this.tableNumber)) {
                this.tableNumberFormatted = "00" + this.tableNumber;
            } else {
                this.tableNumberFormatted = null
            }
        },
        setIsActive() {
            if (!this.tableIsActive) {
                this.tableColor = "black";
                this.textColor = "#373737";
            }
        },
        setTableColor() {
            if (this.hasReservation && this.isAssign) {
                this.tableColor = this.fillDarkColor;
                this.textColor = "white";
            } else if (!this.hasReservation && this.isAssign) {
                this.tableColor = this.fillLightColor;
                this.textColor = "black"
            } else if(this.tableIsActive && !this.isAssign){
                this.tableColor = "white";
                this.textColor = "black"
            }
        }
    },
    watch: {
        isAssign() {
            this.tableSetUp();
        },
    },
    mounted() {
        this.tableSetUp();
    }
}
</script>

<style scoped>
.tableIcon {
    height: 80px;
    width: 80px;
    margin: 2px;
}
</style>