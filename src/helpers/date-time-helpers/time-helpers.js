const moment = require('moment');
const { TIME_UNITS, ISO_FORMAT } = require('./constants');

function getUTCTime() {
    return new Date(new Date().toUTCString()).toISOString();
}

function getCurrentTime() {
    return moment.utc();
}

function getFutureTime({ unit, amount }) {
    if (!TIME_UNITS[unit.toUpperCase()]) {
        throw new Error(`time unit not supported`);
    }

    if (TIME_UNITS[unit.toUpperCase()]) {
        let time;

        if (TIME_UNITS[unit.toUpperCase()] === TIME_UNITS.DAYS) {
            time = moment.utc().add(amount, TIME_UNITS.DAYS);
        }

        if (TIME_UNITS[unit.toUpperCase()] === TIME_UNITS.HOURS) {
            time = moment.utc().add(amount, TIME_UNITS.HOURS);
        }

        if (TIME_UNITS[unit.toUpperCase()] === TIME_UNITS.MINUTES) {
            time = moment.utc().add(amount, TIME_UNITS.MINUTES);
        }

        return time;
    }

    throw new Error(`time unit not supported`);
}

function getPastTime({ unit, amount }) {
    if (!TIME_UNITS[unit.toUpperCase()]) {
        throw new Error(`time unit not supported`);
    }

    if (TIME_UNITS[unit.toUpperCase()]) {
        let time;

        if (TIME_UNITS[unit.toUpperCase()] === TIME_UNITS.DAYS) {
            time = moment.utc().subtract(amount, TIME_UNITS.DAYS);
        }

        if (TIME_UNITS[unit.toUpperCase()] === TIME_UNITS.HOURS) {
            time = moment.utc().subtract(amount, TIME_UNITS.HOURS);
        }

        if (TIME_UNITS[unit.toUpperCase()] === TIME_UNITS.MINUTES) {
            time = moment.utc().subtract(amount, TIME_UNITS.MINUTES);
        }

        return time;
    }

    throw new Error(`time unit not supported`);
}

function getValidDate(d) {
    return new Date(d);
}

function testDateValue({ testableDate }) {
    // check if a string is a date and if it complies with the ISO format
    const isDate = checkIfDate(testableDate);
    const isISO = checkDateIsIsoFormat({
        dateAsString: testableDate,
        ISOFormat: ISO_FORMAT,
        strict: true,
    });

    return isDate && isISO;
}

function checkDateIsIsoFormat({ dateAsString, ISOFormat, strict = true }) {
    return moment(new Date(dateAsString), ISOFormat, strict).isValid();
}

function checkIfDate(date) {
    // eslint-disable-next-line no-restricted-globals
    return Date.parse(date) !== 'Invalid Date' && !isNaN(Date.parse(date));
}

// eslint-disable-next-line no-unused-vars
function validateDateBetweenTwoDates({ from: fromDate, to: toDate, given: givenDate }) {
    const given = getValidDate(givenDate);
    const to = getValidDate(toDate);
    const from = getValidDate(fromDate);

    return given <= to && given >= from;
}

function getDateAndTime() {
    const d = new Date();
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${minutes}`;
}

module.exports = {
    getCurrentTime,
    getFutureTime,
    getPastTime,
    getUTCTime,
    testDateValue,
    validateDateBetweenTwoDates,
    getDateAndTime,
};
