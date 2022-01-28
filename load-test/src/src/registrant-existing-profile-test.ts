import { Options } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-scripts';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-scripts';
import { getExecutionType, getSummaryRes, registrant_thresholds } from './utilities';

let execution_type = getExecutionType();

export const options: Options = {
    scenarios: {
        existingProfileRegistration: {
            exec: 'RegistrantExistingProfileRegistration',
            ...execution_type
        },
    },

    thresholds: {
        ...registrant_thresholds
    }
};

const TEST_TYPE = "registrant-existing-profile";

export function handleSummary(data: any) {
    return getSummaryRes(TEST_TYPE, data);
}