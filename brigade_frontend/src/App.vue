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
      toLocale: this.toLocale,
      isBeforeToday: this.isBeforeToday
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
    }
  },
  methods: {

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
    toLocale(str) {
      const dateAndTimeString = this.replaceAndSplitDateFromTime(str);
      return this.dateOrTimeObjectifier(dateAndTimeString);
    },
    replaceAndSplitDateFromTime(str) {
      if (str) {
        const indexOfComma = str.indexOf(",");
        if (indexOfComma != -1) str = str.replace(/,/g, "");

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

          var year = (dateParts[0] > 31) ? dateParts[0] : dateParts[2];
          var month = dateParts[1];
          var day = (dateParts[0] > 31) ? dateParts[2] : dateParts[0];
          var fullDate = year + "-" + month + "-" + day
        }

        const date = {
          year: (!!dateIsPresent) ? parseInt(year) : undefined,
          month: (!!dateIsPresent) ? parseInt(month) : undefined,
          day: (!!dateIsPresent) ? parseInt(day) : undefined,
          fullDate: (!!dateIsPresent) ? fullDate : undefined,
          weekNumber: (!!dateIsPresent) ? this.getWeekNumber(fullDate) : undefined
        }

        if (!!timeIsPresent) timeParts = strObject.timeString.split(":");

        const time = {
          hours: (!!timeIsPresent) ? parseInt(timeParts[0]) : undefined,
          minutes: (!!timeIsPresent) ? parseInt(timeParts[1]) : undefined,
          secondes: (!!timeIsPresent) ? parseInt(timeParts[2]) : undefined,
          fullTime: (!!timeIsPresent) ? strObject.timeString : undefined
        }

        return {
          year: date.year,
          month: date.month,
          day: date.day,
          weekNumber: date.weekNumber,
          fullDate: date.fullDate,
          fullTime: time.fullTime,
          hours: time.hours,
          minutes: time.minutes,
          secondes: time.secondes,
          date: date,
          time: time,
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
    isBeforeToday(fullDate) {
      const dateToVerify = this.toLocale(fullDate)
      var today = this.toLocale(new Date().toLocaleString("en-GB"));


      if (dateToVerify.date.year < today.date.year) {
        return true;
      }
      else if (dateToVerify.date.year == today.date.year && dateToVerify.date.month < today.date.month) {
        return true;
      }
      else if (dateToVerify.date.year == today.date.year && dateToVerify.date.month == today.date.month) {
        if (dateToVerify.date.day < today.date.day) {
          return true;
        }
        else if (dateToVerify.date.day == today.date.day) {
          if (dateToVerify.time.hours < today.time.hours) {
            return true;
          }
          else if (dateToVerify.time.hours == today.time.hours && dateToVerify.date.minutes <= today.date.minutes) {
            return true;
          }
        }
      }
      return false;
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