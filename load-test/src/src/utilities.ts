import { sleep } from 'k6';
import { Scenario } from 'k6/options';

// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { jUnit, textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

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

/** Get date string as yyyy-mm-dd */
export function getDateString(date: Date = new Date()) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1); //month is 0 based
    let day = date.getDate();
    return `${year}-${month}-${day}`;
}

/** Get string with current time hh-mm-ss */
export function getTimeString(date: Date = new Date()) {
    let hours = date.getHours();
    let minutes = date.getMinutes()
    let seconds = date.getSeconds();
    return `${hours}-${minutes}-${seconds}`;
}

function getSummaryFileDescriptor(): string {
    let descriptor = ``;
    if (__ENV.VUS) descriptor += __ENV.VUS + "-VUS ";
    if (__ENV.ITERS) descriptor += __ENV.ITERS + "-ITERS ";
    if (__ENV.DUR) descriptor += __ENV.DUR + "-DUR ";
    descriptor = descriptor.trim();
    if (descriptor) descriptor = " " + descriptor;
    return descriptor;
}

/** Get return obj for handle summary */
export function getSummaryRes(TEST_TYPE: string, data: any) {
    let dateString = getDateString();
    let timeString = getTimeString();
    let descriptor = getSummaryFileDescriptor();
    let fileName: string = `results/${TEST_TYPE}${descriptor}.${dateString}.${timeString}.summary`;
    let res: any = {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), // Show the text summary to stdout...
    };
    res[fileName + ".html"] = htmlReport(data);
    res[fileName + ".json"] = JSON.stringify(data);

    return res
}

export const registrant_thresholds = {
    'reg_failed_to_login': ['rate<0.01'], //Less than 1% are allowed to fail
    'reg_failed_form_fetches': ['rate<0.01'], //Less than 1% are allowed to fail
    'reg_failed_form_submits': ['rate<0.01'], //Less than 1% are allowed to fail
    'reg_submit_file': ['p(95)<10000'], // 10s
    'reg_submit_anonymous': ['p(95)<10000'], // 10s
    'reg_submit_profile': ['p(95)<10000'], // 10s
    'reg_load_auth_token': ['p(95)<10000'], // 10s
    'reg_load_configuration': ['p(95)<10000'], // 10s
    'reg_load_security_questions': ['p(95)<10000'], // 10s
    'reg_load_provinces': ['p(95)<10000'], // 10s
    'reg_load_countries': ['p(95)<10000'], // 10s
    'reg_load_communities': ['p(95)<10000'], // 10s
    'reg_load_profile': ['p(95)<10000'], // 10s
    'reg_load_profile_exists': ['p(95)<10000'], // 10s
}

export const responder_thresholds = {
    'res_failed_to_login': ['rate<0.01'], // 10s
    'res_failed_form_fetches': ['rate<0.01'], // 10s
    'res_failed_form_submits': ['rate<0.01'], // 10s
    'res_submit_file': ['p(95)<10000'], // 10s
    'res_submit_registrant': ['p(95)<10000'], // 10s
    'res_submit_supports': ['p(95)<10000'], // 10s
    'res_submit_note': ['p(95)<10000'], // 10s
    'res_print_request_time': ['p(95)<45000'], // 45s
    'res_load_member_role': ['p(95)<10000'], // 10s
    'res_load_member_label': ['p(95)<10000'], // 10s
    'res_load_auth_token': ['p(95)<10000'], // 10s
    'res_load_configuration': ['p(95)<10000'], // 10s
    'res_load_security_questions': ['p(95)<10000'], // 10s
    'res_load_provinces': ['p(95)<10000'], // 10s
    'res_load_countries': ['p(95)<10000'], // 10s
    'res_load_communities': ['p(95)<10000'], // 10s
    'res_load_file': ['p(95)<10000'], // 10s
    'res_load_registrant': ['p(95)<10000'], // 10s
    'res_load_suppliers': ['p(95)<10000'], // 10s
    'res_search_tasks': ['p(95)<10000'], // 10s
    'res_search_registrations': ['p(95)<10000'], // 10s
    'res_search_registrations_no_result': ['p(95)<10000'], // 10s
}