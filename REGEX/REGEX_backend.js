const validEmployeeNumber = /^[1-9]\d{3}$/;
exports.validEmployeeNumber = validEmployeeNumber;

const validName = /^([A-Z][a-z]{1,}(?:[- ][A-Z][a-z]{1,})?)$/;
exports.validName = validName;

const validName2 = /^[A-Z][a-z]{1,}(?:(?:[- ][A-Z][a-z]{1,})?)*$/;
exports.validName2 = validName2;

const validRole = /^[A-Z][a-zA-Z]*$/;
exports.validRole = validRole;

const validColorHexCode = /^#([A-F0-9]{6}|[A-F0-9]{3})$/;
exports.validColorHexCode = validColorHexCode;

const validHourlyRate = /^[1-9]\d{1,2}(\.\d{1,2})?$/;
exports.validHourlyRate = validHourlyRate;

const validBarcodeNumber = /^\d{16}$/;
exports.validBarcodeNumber = validBarcodeNumber;

const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z-.]+$/;
exports.validEmail = validEmail;

const validPhoneNumber = /^\d{3}-\d{3}-\d{4}$/;
exports.validPhoneNumber = validPhoneNumber;

const validSkillPoints = /^(?:[1-9]|10)$/;
exports.validSkillPoints = validSkillPoints;

const validDate = /^\d{4}-\d{1,2}-\d{2}$/;
exports.validDate = validDate;

const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
exports.validTime = validTime;

const validWeekId = /^\d{4}-W([1-9]|[1-4]\d|5[0-3])$/;
exports.validWeekId = validWeekId;

const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
exports.validPassword = validPassword;