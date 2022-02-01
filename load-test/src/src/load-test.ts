import { Options, Scenario } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-scripts';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-scripts';
import { setUseRandomWaitTime, getSummaryRes, registrant_thresholds, responder_thresholds } from './utilities';

let REGISTRANT_TARGET = parseInt(__ENV.REG || "50");
let RESPONDER_TARGET = parseInt(__ENV.RES || "30");

let registrant_scenario: Scenario = {
    executor: 'ramping-vus',
    startVUs: 1,
    stages: [
        { duration: '15m', target: REGISTRANT_TARGET }, //target should be <= MAX_VU
        { duration: '10m', target: REGISTRANT_TARGET }, //target should be <= MAX_VU
        { duration: '5m', target: 0 },
    ],
    gracefulRampDown: '5m',
};

let responder_scenario: Scenario = {
    startTime: '15m',
    executor: 'ramping-vus',
    startVUs: 1,
    stages: [
        { duration: '2m', target: RESPONDER_TARGET }, //target should be <= MAX_VU
        { duration: '41m', target: RESPONDER_TARGET }, //target should be <= MAX_VU
        { duration: '2m', target: 0 },
    ],
    gracefulRampDown: '5m',
};

export const options: Options = {
    scenarios: {
        /*---Registrant---*/
        anonymousRegistration: {
            exec: 'RegistrantAnonymousRegistration',
            ...registrant_scenario
        },
        newRegistration: {
            exec: 'RegistrantNewRegistration',
            ...registrant_scenario
        },
        existingProfileRegistration: {
            exec: 'RegistrantExistingProfileRegistration',
            startTime: '2m',
            ...registrant_scenario
        },


        /*---Responder---*/
        ResponderNewRegistration: {
            exec: 'ResponderNewRegistration',
            ...responder_scenario
        },
        ResponderExistingRegistration: {
            exec: 'ResponderExistingRegistration',
            ...responder_scenario
        },
    },

    thresholds: {
        ...registrant_thresholds,
        ...responder_thresholds
    }
};

setUseRandomWaitTime(true);

const TEST_TYPE = "load-test";

export function handleSummary(data: any) {
    return getSummaryRes(TEST_TYPE, data);
}