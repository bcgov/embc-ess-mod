import { Options } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-scripts';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-scripts';
import { getExecutionType, getSummaryRes, responder_thresholds } from './utilities';

let execution_type = getExecutionType();

export const options: Options = {
    scenarios: {
        ResponderNewRegistration: {
            exec: 'ResponderNewRegistration',
            ...execution_type
        },
    },

    thresholds: {
        ...responder_thresholds
    }
};

const TEST_TYPE = "responder-new-registration";

export function handleSummary(data: any) {
    return getSummaryRes(TEST_TYPE, data);
}