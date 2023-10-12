<template>
  <v-app>
    <OperationMenu
      v-if="$route.fullPath.split('/').slice(1)[0] == 'operation' && ($route.fullPath.split('/').slice(1)[1] || operationSession.isActive == true)">
    </OperationMenu>
    <EspaceMenu v-if="$route.fullPath.split('/').slice(1)[0] == 'espace' && userSession.employee">
    </EspaceMenu>
    <v-main>
      <router-view class="my-5"></router-view>
    </v-main>
  </v-app>
</template>

<script>

import operationSession from "./sessions/OperationSession"
import userSession from "./sessions/UserSession"

import OperationMenu from "./components/OperationMenu.vue"
import EspaceMenu from "./components/DesktopMenu.vue"
import { computed } from "vue";

export default {
  provide() {
    return {
      capitalizeWords: this.capitalizeWords,
      lowFormatingName: this.lowFormatingName,
      formatPhoneNumber: this.formatPhoneNumber,
      spliceDate: this.spliceDate,
      isUserAuthorized: this.isUserAuthorized,
      loadReservationInformations: this.loadReservationInformations,
      // selectedReservationId: computed(()=>this.selectedReservationId),
      // test: this.test,
      toLocale: this.toLocale

    }
  },
  components: {
    OperationMenu,
    EspaceMenu
  },
  data() {
    return {
      operationSession: operationSession,
      userSession: userSession,
      // selectedReservationId: null
    }
  },
  methods: {
    // loadReservationInformations(receivedReservationId) {
    //   this.selectedReservationId = receivedReservationId;
    // },
    capitalizeWords(inputString) {
      if (inputString) {
        const words = inputString
          .replace(/-+/g, '-')
          .replace(/[^a-zA-Z\s-]/g, '')
          .replace(/\s+/g, ' ')
          .split(' ')
          .map(word => {
            const parts = word.split('-');
            const capitalizedParts = parts.map(part => {
              return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            });
            return capitalizedParts.join('-');
          });

        return words
          .join(' ')
          .replace(/-\s+/g, '-')
          .replace(/\s+-/g, '-')
          .trim()
          .replace(/^-+|-+$/g, '')
          .replace(/[^a-zA-Z]-[^a-zA-Z]/g, '');
      }
    },
    lowFormatingName(inputString) {
      if (inputString) {
        const words = inputString
          .replace(/-+/g, '-')
          .replace(/[^a-zA-Z\d\s-]/g, '')
          .replace(/\s+/g, ' ')
          .split(' ')
          .map(word => {
            const parts = word.split('-');
            const capitalizedParts = parts.map(part => {
              return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            });
            return capitalizedParts.join('-');
          });

        return words
          .join(' ')
          .replace(/-\s+/g, '-')
          .replace(/\s+-/g, '-')
          .trim()
          .replace(/^-+|-+$/g, '')
          .replace(/[^a-zA-Z]-[^a-zA-Z]/g, '');
      }
    },
    formatPhoneNumber(phoneNumber) {
      if (phoneNumber) {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');

        if (cleanedNumber.length <= 10) {
          return cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else {
          return cleanedNumber.slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
      }
    },
    // test() {
    //   var testStr;
    //   var result;

    //   testStr = new Date().toISOString();
    //   console.log("toISOString() : " + testStr);
    //   result = this.toLocale(testStr);
    //   console.log(result);
    //   console.log(" ");

    //   testStr = new Date().toLocaleString();
    //   console.log("toLocaleString() : " + testStr);
    //   result = this.toLocale(testStr);
    //   console.log(result);
    //   console.log(" ");

    //   testStr = new Date().toLocaleDateString();
    //   console.log("toLocaleDateString() : " + testStr);
    //   result = this.toLocale(testStr);
    //   console.log(result);
    //   console.log(" ");

    //   testStr = new Date().toLocaleTimeString();
    //   console.log("toLocaleTimeString() : " + testStr);
    //   result = this.toLocale(testStr);
    //   console.log(result);
    // },
    toLocale(str) {
      // console.clear();

      const dateAndTimeString = this.replaceAndSplitDateFromTime(str);
      const dateAndTimeObject = this.dateOrTimeObjectifier(dateAndTimeString);

      return {
        date: dateAndTimeObject.dateObject,
        time: dateAndTimeObject.timeObject
      }

    },
    replaceAndSplitDateFromTime(str) {
      if (str) {
        const indexOfSlash = str.indexOf("/");
        if (indexOfSlash != -1) str = str.replace(/\//g, "-");

        const indexOfT = str.indexOf("T");
        if (indexOfT != -1) str = str.replace(/T/g, " ").split(".")[0];

        const indexOfSpace = str.indexOf(" ");
        var strSplitted;

        if (indexOfSpace != -1) {
          strSplitted = str.split(" ");
          return {
            dateString: strSplitted[0],
            timeString: strSplitted[1]
          }
        } else {
          var dateIsPresent = str.indexOf("-");
          var timeIsPresent = str.indexOf(":");

          return {
            dateString: (dateIsPresent != -1) ? str : null,
            timeString: (timeIsPresent != -1) ? str : null
          }
        }
      }
    },
    dateOrTimeObjectifier(strObject) {
      if (strObject) {
        if (strObject.dateString) var dateIsPresent = strObject.dateString.indexOf("-");
        if (strObject.timeString) var timeIsPresent = strObject.timeString.indexOf(":");
        var dateParts;
        var timeParts;

        if (!!dateIsPresent) {
          dateParts = strObject.dateString.split("-");

          const year = (dateParts[0] > 31) ? dateParts[0] : dateParts[2];
          const month = dateParts[1];
          const day = (dateParts[0] > 31) ? dateParts[2] : dateParts[0];
          const fullDate = year + "-" + month + "-" + day

          var date = {
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            fullDate: fullDate,
            weekNumber: this.getWeekNumber(fullDate)
          }
        }

        if (!!timeIsPresent) {
          timeParts = strObject.timeString.split(":");
          var time = {
            hours: parseInt(timeParts[0]),
            minutes: parseInt(timeParts[1]),
            secondes: parseInt(timeParts[2]),
            fullTime: strObject.timeString
          }
        }

        return {
          dateObject: date,
          timeObject: time
        }
      }
    },
    getWeekNumber(date) {
      date = new Date(date);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 1);
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

      const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 4).getTime()) / 86400000 / 7) + 1;

      return weekNumber;
    },

    spliceDate(fullDate) {
      const date = fullDate.split('T').slice(0)[0];
      const fulltime = fullDate.split('T').slice(0)[1];
      return {
        year: parseInt(date.split('-').slice(0)[0]),
        month: parseInt(date.split('-').slice(0)[1]),
        day: parseInt(date.split('-').slice(0)[2]),
        hour: parseInt(fulltime.split(':').slice(0)[0]),
        minute: parseInt(fulltime.split(':').slice(0)[1])
      }
    },

    isUserAuthorized() {
      return ((this.userSession.employee && this.userSession.employee.isActive) && (this.userSession.employee.isAdmin || this.userSession.employee.isSuperAdmin)
      );
    }
  }
};
</script>

<style>
.boxed-center {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 40%;
  max-width: 80rem;
}

.boxed-center-large {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 80%;
  max-width: 80rem;
}

.warning-message {
  color: red
}

.pre-wrap {
  white-space: pre-wrap;
}
</style>