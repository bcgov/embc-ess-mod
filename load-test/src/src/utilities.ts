import { sleep } from 'k6';

/** Returns a random number between min and max (both included) */
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns a new date with the date incremented by x days */
export function addDays(date: Date, x: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + x);
    return result;
}

export function getDaysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
};

/** Simulate random wait time to fill in a form */
export function fillInForm() {
    // sleep(getRandomInt(30, 90));
    sleep(1);
}

/** Simulate random wait time to navigate on a page */
export function navigate() {
    // sleep(getRandomInt(1, 8));
    sleep(1);
}