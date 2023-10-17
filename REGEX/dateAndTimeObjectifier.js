function replaceAndSplitDateFromTime(str) {
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
}


function getWeekNumber(date) {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

    const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 4).getTime()) / 86400000 / 7) + 1;

    return weekNumber;
}


function dateOrTimeObjectifier(strObject) {
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
            weekNumber: (!!dateIsPresent) ? getWeekNumber(fullDate) : undefined
        }

        if (!!timeIsPresent) {
            timeParts = strObject.timeString.split(":");
        }
        const time = {
            hours: (!!timeIsPresent) ? parseInt(timeParts[0]) : undefined,
            minutes: (!!timeIsPresent) ? parseInt(timeParts[1]) : undefined,
            secondes: (!!timeIsPresent) ? parseInt(timeParts[2]) : undefined,
            fullTime: (!!timeIsPresent) ? strObject.timeString : undefined
        }

        return {
            year:       date.year,
            month:      date.month,
            day:        date.day,
            weekNumber: date.weekNumber,
            fullDate:   date.fullDate,
            fullTime:   time.fullTime,
            hours:      time.hours,
            minutes:    time.minutes,
            secondes:   time.secondes,
            date:       date,
            time:       time,
        }
    }
}


const toLocale = function (str) {
    const dateAndTimeString = replaceAndSplitDateFromTime(str);
    return dateOrTimeObjectifier(dateAndTimeString);
}
exports.toLocale = toLocale;