import { Options } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-scripts';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-scripts';

// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { getExecutionType, getSummaryFileDescriptor } from './utilities';

let execution_type = getExecutionType();

export const options: Options = {
    scenarios: {
        existingProfileRegistration: {
            exec: 'RegistrantExistingProfileRegistration',
            ...execution_type
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
    }
};

export function handleSummary(data: any) {
    let fileName: string = `registrant-existing-profile.${getSummaryFileDescriptor()}.summary.html`;
    let res: any = {};
    res[fileName] = htmlReport(data);
    return res;
}