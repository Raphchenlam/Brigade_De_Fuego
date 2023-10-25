const { error } = require("console");

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
            proof: "This is an object made with toLocale. TM Brigade_De_Fuego"
        }
    }
}


const toLocale = function (str) {
    if (typeof str === "object" && str.proof == "This is an object made with toLocale. TM Brigade_De_Fuego") {
        console.info(str.proof);
        return str;
    }else if (typeof str === "string" || str instanceof Date){
        str = (str instanceof Date) ? str.toLocaleString("en-GB") : str;

        const dateAndTimeString = replaceAndSplitDateFromTime(str);
        return dateOrTimeObjectifier(dateAndTimeString);

    }else if (typeof str === "object"){
        throw ("Received an object that is not a toLocale object.");
    }


}
exports.toLocale = toLocale;


const isBeforeToday = function (fullDate) {
    const dateToVerify = (typeof fullDate === "object") ? fullDate : toLocale(fullDate);
    var today = toLocale(new Date().toLocaleString("en-GB"));

    if (dateToVerify.year < today.year) {
        return true;
    }
    else if (dateToVerify.year == today.year && dateToVerify.month < today.month) {
        return true;
    }
    else if (dateToVerify.year == today.year && dateToVerify.month == today.month) {
        if (dateToVerify.day < today.day) {
            return true;
        }
        else if (dateToVerify.day == today.day) {
            if (dateToVerify.hours < today.hours) {
                return true;
            }
            else if (dateToVerify.hours == today.hours && dateToVerify.minutes <= (today.minutes + 5)) {
                return true;
            }
        }
    }
    return false;
}
exports.isBeforeToday = isBeforeToday;


// run with < node dateAndTimeObjectifier.js > in terminal, when in REGEX folder
// const variable = toLocale("2023-10-26")
// console.log("variable : ", variable)

// const variable2 = toLocale(variable)
// console.log("variable2 : ", variable2)

// const variable3 = toLocale({ wrong: "Wrong object given to toLocale"})
// console.log("Never gets here, line above throws an error before : ", variable3)
