// @ts-ignore
import { RegistrantTestParameters } from '../../../load-test.parameters-APP_TARGET';

const testParams = RegistrantTestParameters;
const baseUrl = testParams.baseUrl;

export const urls = {
    //Metadata
    config: { url: `${baseUrl}/api/Configuration`, name: "Configuration" },
    communities: { url: `${baseUrl}/api/Configuration/codes/communities`, name: "Communities" },
    provinces: { url: `${baseUrl}/api/Configuration/codes/stateprovinces`, name: "Provinces" },
    countries: { url: `${baseUrl}/api/Configuration/codes/countries`, name: "Countries" },
    security_questions: { url: `${baseUrl}/api/Configuration/security-questions`, name: "Security Questions" },
    openid_config: { url: `${testParams.authEndpoint}/.well-known/openid-configuration`, name: "OpenId Config" },
    enum_codes: { url: `${baseUrl}/api/Configuration/codes?forEnumType=`, name: "Enum Codes" },
  
    //Anonymous
    anonymous_start_page: { url: `${baseUrl}/non-verified-registration`, name: "Anonymous Start Page" },
    submit_anonymous: { url: `${baseUrl}/api/Evacuations/create-registration-anonymous`, name: "Submit Anonymous Evacuation" },
  
    //Registered
    start_page: { url: `${baseUrl}/registration-method`, name: "Start Page" },
    auth_token: { url: `${testParams.authEndpoint}/connect/token`, name: "Auth Token" },
    dashboard: { url: `${baseUrl}/verified-registration/dashboard/current`, name: "Dashboard" },
    current_user_exists: { url: `${baseUrl}/api/profiles/current/exists`, name: "Current Profile Exists" },
    current_evacuations: { url: `${baseUrl}/api/Evacuations/current`, name: "Current Evacuations" },
    conflicts: { url: `${baseUrl}/api/profiles/current/conflicts`, name: "Profile Conflicts" },
    current_profile: { url: `${baseUrl}/api/profiles/current`, name: "Save Profile" },
    submit: { url: `${baseUrl}/api/Evacuations`, name: "Submit Evacuation" },
  };