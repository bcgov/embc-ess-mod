import { sleep } from 'k6';
import { Scenario } from 'k6/options';

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

let use_random_wait_time: boolean = false;

export function setUseRandomWaitTime(val: boolean) {
    use_random_wait_time = val;
}

/** Simulate random wait time to fill in a form */
export function fillInForm() {
    if (use_random_wait_time)
        sleep(getRandomInt(30, 90));
    else
        sleep(1);
}

/** Simulate random wait time to navigate on a page */
export function navigate() {
    if (use_random_wait_time)
        sleep(getRandomInt(1, 8));
    else
        sleep(1);
}

/** Current VU and Iteration identifier */
export function logError(response: any, payload?: any) {
    // console.error(payload);
    // console.error(JSON.stringify(response));
    console.error(response.status, response.url, response.error);
}

/** Current VU and Iteration identifier */
export function getIterationName() {
    return `${__VU},${__ITER}`;
}

/** Get scenario execution type based on cli arguments used */
export function getExecutionType(): Scenario {
    let TARGET_VUS = parseInt(__ENV.VUS || "1");
    let TARGET_ITERATIONS = parseInt(__ENV.ITERS || "1");
    let TARGET_DURATION = __ENV.DUR || "5m";

    if (TARGET_VUS > 100) TARGET_VUS = 100;

    if (__ENV.DUR) {
        return {
            executor: 'constant-vus',
            vus: TARGET_VUS,
            duration: TARGET_DURATION,
        };
    }

    return {
        executor: 'per-vu-iterations',
        vus: TARGET_VUS,
        iterations: TARGET_ITERATIONS,
        maxDuration: '1h30m',
    };
}

export function getSummaryFileDescriptor(): string {
    let TARGET_VUS = parseInt(__ENV.VUS || "1");
    let TARGET_ITERATIONS = parseInt(__ENV.ITERS || "1");
    let descriptor = `${TARGET_VUS}-VUS`;

    if (__ENV.ITERS) {
        descriptor += `-${TARGET_ITERATIONS}-ITERS`;
    }

    return descriptor;
}

export function getHTTPParams(token?: string) {
    let headers: any = {
        "accept": "application/json",
        "content-type": "application/json",
        "Accept-Encoding": "gzip, deflate, br"
    };
    if (token != null) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return {
        headers: headers,
        timeout: 180000
    }
}