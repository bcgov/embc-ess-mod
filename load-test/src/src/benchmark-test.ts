import { Options } from 'k6/options';
export { RegistrantAnonymousRegistration, RegistrantNewRegistration, RegistrantExistingProfileRegistration } from './registrant-portal-scripts';
export { ResponderNewRegistration, ResponderExistingRegistration } from './responder-portal-scripts';
import { getExecutionType, getSummaryRes, setUseRandomWaitTime } from './utilities';

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
        'reg_failed_to_login': ['rate<0.01'], //Less than 1% are allowed to fail
        'reg_failed_form_fetches': ['rate<0.01'], //Less than 1% are allowed to fail
        'reg_failed_form_submits': ['rate<0.01'], //Less than 1% are allowed to fail
        'reg_submit_file': ['p(95)<10000'], // 10s
        'reg_submit_anonymous': ['p(95)<10000'], // 10s
        'reg_submit_profile': ['p(95)<10000'], // 10s
        'res_load_html_time': ['p(95)<10000'], // 10s
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
        'res_search_registrations_no_result': ['p(95)<10000'], // 10s
    }
};

const TEST_TYPE = "benchmark";

export function handleSummary(data: any) {
    return getSummaryRes(TEST_TYPE, data);
}