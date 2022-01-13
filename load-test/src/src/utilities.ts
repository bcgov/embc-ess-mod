/**
 *  Returns a random number between min and max (both included)
 */
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a new date with the date incremented by x days
 */
export function addDays(date: Date, x: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + x);
    return result;
}

export const getDaysInMonth = function (month: number, year: number) {
    return new Date(year, month, 0).getDate();
};
