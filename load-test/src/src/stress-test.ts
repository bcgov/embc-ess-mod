import { Options, Scenario } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-scripts';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-scripts';
import { getSummaryRes, registrant_thresholds, responder_thresholds, setUseRandomWaitTime } from './utilities';

const STAGE_DURATION = '3m';

let ramp_up_scenario: Scenario = {
    executor: 'ramping-vus',
    startVUs: 1,
    stages: [
        { duration: STAGE_DURATION, target: 5 }, //target should be <= MAX_VU
        { duration: STAGE_DURATION, target: 10 },
        { duration: STAGE_DURATION, target: 15 },
        { duration: STAGE_DURATION, target: 20 },
        { duration: STAGE_DURATION, target: 25 },
        { duration: STAGE_DURATION, target: 30 },
        { duration: STAGE_DURATION, target: 35 },
        { duration: STAGE_DURATION, target: 40 },
        { duration: STAGE_DURATION, target: 45 },
        { duration: STAGE_DURATION, target: 50 },
        { duration: STAGE_DURATION, target: 55 },
        { duration: STAGE_DURATION, target: 60 },
        { duration: STAGE_DURATION, target: 65 },
        { duration: STAGE_DURATION, target: 70 },
        { duration: STAGE_DURATION, target: 75 },
        { duration: STAGE_DURATION, target: 80 },
        { duration: STAGE_DURATION, target: 85 },
        { duration: STAGE_DURATION, target: 90 },
        { duration: STAGE_DURATION, target: 95 },
        { duration: STAGE_DURATION, target: 100 },
    ],
    gracefulRampDown: '5m',
}

export const options: Options = {
    scenarios: {
        /*---Registrant---*/
        anonymousRegistration: {
            exec: 'RegistrantAnonymousRegistration',
            ...ramp_up_scenario
        },
        newRegistration: {
            exec: 'RegistrantNewRegistration',
            ...ramp_up_scenario
        },
        existingProfileRegistration: {
            exec: 'RegistrantExistingProfileRegistration',
            startTime: '2m',
            ...ramp_up_scenario
        },


        /*---Responder---*/
        ResponderNewRegistration: {
            exec: 'ResponderNewRegistration',
            ...ramp_up_scenario
        },
        ResponderExistingRegistration: {
            exec: 'ResponderExistingRegistration',
            ...ramp_up_scenario
        },
    },

    thresholds: {
        ...registrant_thresholds,
        ...responder_thresholds
    }
};

setUseRandomWaitTime(true);

const TEST_TYPE = "stress-test";

export function handleSummary(data: any) {
    return getSummaryRes(TEST_TYPE, data);
}