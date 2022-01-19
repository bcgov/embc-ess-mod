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
            ],
            gracefulRampDown: '2m',

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
            ],
            gracefulRampDown: '2m',

            // executor: 'per-vu-iterations',
            // vus: 1,
            // iterations: 1,
            // maxDuration: '1h30m',
        },
    },

    thresholds: {
        'failed form submits': ['rate<0.01'], //Less than 1% are allowed to fail
        'failed form fetches': ['rate<0.01'],
        'failed login': ['rate<0.01'],
        'submit_file': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
        'submit_anonymous': ['p(95)<5000'], // threshold on submit requests only (in ms)
        'submit_registrant': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
        'submit_supports': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
        'submit_note': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
        'print_request_time': ['p(95)<90000'], // 90s - threshold on print requests only (in ms)
        'load_time': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
        'load_communities': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
        'load_file': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
        'load_registrant': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
        'load_suppliers': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
        'search_tasks': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
        'search_registrations': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
    }
};

export function handleSummary(data: any) {
    return {
      "load-test.summary.html": htmlReport(data),
    };
  }