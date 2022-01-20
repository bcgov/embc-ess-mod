import { Options } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-test';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-test';

// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options: Options = {
    scenarios: {
        /*---Registrant---*/
        anonymousRegistration: {
            exec: 'RegistrantAnonymousRegistration',

            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '5m', target: 100 }, //target should be <= MAX_VU
                { duration: '10m', target: 100 }, //target should be <= MAX_VU
                { duration: '5m', target: 0 },
            ],
            gracefulRampDown: '5m',

            // executor: 'per-vu-iterations',
            // vus: 1,
            // iterations: 1,
            // maxDuration: '1h30m',
        },
        newRegistration: {
            exec: 'RegistrantNewRegistration',

            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '5m', target: 100 }, //target should be <= MAX_VU
                { duration: '10m', target: 100 }, //target should be <= MAX_VU
                { duration: '5m', target: 0 },
            ],
            gracefulRampDown: '5m',

            // executor: 'per-vu-iterations',
            // vus: 1,
            // iterations: 1,
            // maxDuration: '1h30m',
        },
        existingProfileRegistration: {
            exec: 'RegistrantExistingProfileRegistration',
            startTime: '2m',

            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '5m', target: 100 }, //target should be <= MAX_VU
                { duration: '10m', target: 100 }, //target should be <= MAX_VU
                { duration: '5m', target: 0 },
            ],
            gracefulRampDown: '5m',

            // executor: 'per-vu-iterations',
            // vus: 1,
            // iterations: 1,
            // maxDuration: '1h30m',
        },


        /*---Responder---*/
        ResponderNewRegistration: {
            exec: 'ResponderNewRegistration',
            startTime: '15m',

            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '2m', target: 15 }, //target should be <= MAX_VU
                { duration: '41m', target: 15 }, //target should be <= MAX_VU
                { duration: '2m', target: 0 },
            ],
            gracefulRampDown: '5m',

            // executor: 'per-vu-iterations',
            // vus: 1,
            // iterations: 1,
            // maxDuration: '1h30m',
        },
        ResponderExistingRegistration: {
            exec: 'ResponderExistingRegistration',
            startTime: '15m',

            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '2m', target: 15 }, //target should be <= MAX_VU
                { duration: '41m', target: 15 }, //target should be <= MAX_VU
                { duration: '2m', target: 0 },
            ],
            gracefulRampDown: '5m',

            // executor: 'per-vu-iterations',
            // vus: 1,
            // iterations: 1,
            // maxDuration: '1h30m',
        },
    },

    thresholds: {
        'reg_failed_to_login': ['rate<0.01'], //Less than 1% are allowed to fail
        'reg_failed_form_fetches': ['rate<0.01'], //Less than 1% are allowed to fail
        'reg_failed_form_submits': ['rate<0.01'], //Less than 1% are allowed to fail
        'reg_submit_file': ['p(95)<10000'], // 10s
        'reg_submit_anonymous': ['p(95)<10000'], // 10s
        'reg_submit_profile': ['p(95)<10000'], // 10s
        'reg_load_time': ['p(95)<10000'], // 10s
        'reg_load_auth_token': ['p(95)<10000'], // 10s
        'reg_load_configuration': ['p(95)<10000'], // 10s
        'reg_load_security_questions': ['p(95)<10000'], // 10s
        'reg_load_provinces': ['p(95)<10000'], // 10s
        'reg_load_countries': ['p(95)<10000'], // 10s
        'reg_load_communities': ['p(95)<10000'], // 10s
        'reg_load_profile': ['p(95)<10000'], // 10s
        'reg_load_profile_exists': ['p(95)<10000'], // 10s

        'res_failed_to_login': ['rate<0.01'], // 10s
        'res_failed_form_fetches': ['rate<0.01'], // 10s
        'res_failed_form_submits': ['rate<0.01'], // 10s
        'res_submit_file': ['p(95)<10000'], // 10s
        'res_submit_registrant': ['p(95)<10000'], // 10s
        'res_submit_supports': ['p(95)<10000'], // 10s
        'res_submit_note': ['p(95)<10000'], // 10s
        'res_print_request_time': ['p(95)<45000'], // 45s
        'res_load_time': ['p(95)<10000'], // 10s
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
        'reg_search_registrations_no_result': ['p(95)<10000'], // 10s
    }
};

export function handleSummary(data: any) {
    let dateString = new Date().toLocaleDateString().replace(/\//g, '-');
    let fileName: string = `load-test.${dateString}.summary.html`;
    console.log(fileName);
    let res: any = {};
    res[fileName] = htmlReport(data);
    return res;
}