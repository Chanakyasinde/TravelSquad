const dayjs = require('dayjs');

const dateStr = 'Sep 17, 2025';
const today = dayjs();
const date = dayjs(dateStr);

console.log(`Today: ${today.format()}`);
console.log(`Date String: ${dateStr}`);
console.log(`Parsed Date: ${date.format()}`);
console.log(`Is Valid: ${date.isValid()}`);
console.log(`Is Before Today: ${date.isBefore(today, 'day')}`);
