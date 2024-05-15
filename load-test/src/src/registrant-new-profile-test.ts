import { Options } from 'k6/options';
export { RegistrantNewRegistration } from './registrant-portal-scripts';
import { getExecutionType, getSummaryRes, registrant_thresholds } from './utilities';

let execution_type = getExecutionType();

export const options: Options = {
    scenarios: {
        newRegistration: {
            exec: 'RegistrantNewRegistration',
            ...execution_type
        },
    },

    thresholds: {
        ...registrant_thresholds
    }
};

const TEST_TYPE = "registrant-new-profile";

export function handleSummary(data: any) {
    return getSummaryRes(TEST_TYPE, data);
}