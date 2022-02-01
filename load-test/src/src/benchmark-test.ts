import { Options } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-scripts';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-scripts';
import { getExecutionType, getSummaryRes, registrant_thresholds, responder_thresholds, setUseRandomWaitTime } from './utilities';

//benchmark default to 5m duration
if (!__ENV.ITERS) {
    __ENV.DUR = '10m';
}
let execution_type = getExecutionType();

if (__ENV.RND) {
    setUseRandomWaitTime(true);
}

export const options: Options = {
    scenarios: {
        /*---Registrant---*/
        anonymousRegistration: {
            exec: 'RegistrantAnonymousRegistration',
            ...execution_type
        },
        newRegistration: {
            exec: 'RegistrantNewRegistration',
            ...execution_type
        },
        existingProfileRegistration: {
            exec: 'RegistrantExistingProfileRegistration',
            ...execution_type
        },


        /*---Responder---*/
        ResponderNewRegistration: {
            exec: 'ResponderNewRegistration',
            ...execution_type
        },
        ResponderExistingRegistration: {
            exec: 'ResponderExistingRegistration',
            ...execution_type
        },
    },

    thresholds: {
        ...registrant_thresholds,
        ...responder_thresholds
    }
};

const TEST_TYPE = "benchmark";

export function handleSummary(data: any) {
    return getSummaryRes(TEST_TYPE, data);
}