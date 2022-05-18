import { Rate, Trend } from 'k6/metrics';
import { generateAnonymousRegistration } from './generators/registrants/registration';
import { generateEvacuationFile } from './generators/registrants/evacuation-file';
import { generateProfile } from './generators/registrants/profile';
import { fillInForm, getHTTPParams, getIterationName, logError, navigate } from './utilities';

// @ts-ignore
import { RegistrantTestParameters, MAX_VU, MAX_ITER } from '../load-test.parameters-APP_TARGET';
import { MyHttp } from './http';
import { fail } from 'k6';

const testParams = RegistrantTestParameters;
const baseUrl = testParams.baseUrl;
const http = new MyHttp();
const urls = {
  //Metadata
  config: `${baseUrl}/api/Configuration`,
  communities: `${baseUrl}/api/Configuration/codes/communities`,
  provinces: `${baseUrl}/api/Configuration/codes/stateprovinces`,
  countries: `${baseUrl}/api/Configuration/codes/countries`,
  security_questions: `${baseUrl}/api/Configuration/security-questions`,

  //Anonymous
  anonymous_start_page: `${baseUrl}/non-verified-registration`,
  submit_anonymous: `${baseUrl}/api/Evacuations/create-registration-anonymous`,

  //Registered
  start_page: `${baseUrl}/registration-method`,
  auth_token: testParams.authEndpoint,
  dashboard: `${baseUrl}/verified-registration/dashboard/current`,
  current_user_exists: `${baseUrl}/api/profiles/current/exists`,
  current_evacuations: `${baseUrl}/api/Evacuations/current`,
  conflicts: `${baseUrl}/api/profiles/current/conflicts`,
  current_profile: `${baseUrl}/api/profiles/current`,
  submit: `${baseUrl}/api/Evacuations`,
};

const loginFailRate = new Rate('reg_failed_to_login');
const formFailRate = new Rate('reg_failed_form_fetches');
const submitFailRate = new Rate('reg_failed_form_submits');
const submitFile = new Trend('reg_submit_file');
const submitAnonymous = new Trend('reg_submit_anonymous');
const submitProfile = new Trend('reg_submit_profile');
const loadHTMLTime = new Trend('res_load_html_time');
const loadAuthToken = new Trend('reg_load_auth_token');
const loadConfig = new Trend('reg_load_configuration');
const loadSecurityQuestions = new Trend('reg_load_security_questions');
const loadProvincesTime = new Trend('reg_load_provinces');
const loadCountriesTime = new Trend('reg_load_countries');
const loadCommunities = new Trend('reg_load_communities');
const loadProfile = new Trend('reg_load_profile');
const loadProfileExists = new Trend('reg_load_profile_exists');

const getAuthToken = () => {
  let curr_vu = __VU - 1; //VU's begin at 1, not 0
  curr_vu = (curr_vu % MAX_VU) + 1;
  let curr_iter = __ITER % MAX_ITER;
  let username = `${testParams.usernameBase}${curr_vu}-${curr_iter}`;
  let password = `${testParams.passwordBase}${curr_vu}-${curr_iter}`
  const payload = `grant_type=${testParams.grantType}&username=${username}&password=${password}&scope=${testParams.scope}`;
  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${testParams.basicAuth}`,
    },
    timeout: 180000
  };

  const response = http.post(urls.auth_token, payload, params);
  loginFailRate.add(response.status !== 200);
  loadAuthToken.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to get auth token`);
    logError(response);
    fail(`Registrants - ${getIterationName()}: failed to get auth token`);
  }
  return response.json();
}

const getStartPage = () => {
  const params = getHTTPParams();
  const response = http.get(urls.start_page, params);
  formFailRate.add(response.status !== 200);
  loadHTMLTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to get start page`);
  }
}

const getAnonymousStartPage = () => {
  const params = getHTTPParams();
  const response = http.get(urls.anonymous_start_page, params);
  formFailRate.add(response.status !== 200);
  loadHTMLTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to get anonymous start page`);
  }
}

const getConfiguration = () => {
  const params = getHTTPParams();
  const response = http.get(urls.config, params);
  formFailRate.add(response.status !== 200);
  loadConfig.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to get config`);
  }
}

const getCommunities = () => {
  const params = getHTTPParams();
  const response = http.get(urls.communities, params);
  formFailRate.add(response.status !== 200);
  loadCommunities.add(response.timings.waiting);
  if (response.status !== 200) {
    fail(`Registrants - ${getIterationName()}: failed to get communities`);
  }
  return response.json();
}

const getProvinces = () => {
  const params = getHTTPParams();
  const response = http.get(urls.provinces, params);
  formFailRate.add(response.status !== 200);
  loadProvincesTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to get provinces`);
  }
  // return response.json();
}

const getCountries = () => {
  const params = getHTTPParams();
  const response = http.get(urls.countries, params);
  formFailRate.add(response.status !== 200);
  loadCountriesTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to get countries`);
  }
  // return response.json();
}

const getSecurityQuestions = () => {
  const params = getHTTPParams();
  const response = http.get(urls.security_questions, params);
  formFailRate.add(response.status !== 200);
  loadSecurityQuestions.add(response.timings.waiting);
  if (response.status !== 200) {
    fail(`Registrants - ${getIterationName()}: failed to get security questions`);
  }
  return response.json();
}

const submitAnonymousRegistration = (communities: any, security_questions: any) => {
  const registration = generateAnonymousRegistration(communities, security_questions);
  const payload = JSON.stringify(registration);
  const params = getHTTPParams();

  const response = http.post(urls.submit_anonymous, payload, params);
  submitAnonymous.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to submit anonymous registration`);
    logError(response, payload);
    fail(`Registrants - ${getIterationName()}: failed to submit anonymous registration`);
  }
  else {
    console.log(`Registrants - ${getIterationName()}: Anonymous submission successful`);
  }
}

const getCurrentProfileExists = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.current_user_exists, params);
  formFailRate.add(response.status !== 200);
  loadProfileExists.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to check if profile exists`);
    logError(response);
    fail(`Registrants - ${getIterationName()}: failed to check if profile exists`);
  }
  return response.json();
}

const getCurrentProfile = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.current_profile, params);
  formFailRate.add(response.status !== 200);
  loadProfile.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to get current profile`);
    logError(response);
    fail(`Registrants - ${getIterationName()}: failed to get current profile`);
  }
  return response.json();
}

const createProfile = (token: any, communities: any, security_questions: any) => {
  const profile = generateProfile(communities, security_questions);
  const payload = JSON.stringify(profile);
  const params = getHTTPParams(token.access_token);

  const response = http.post(urls.current_profile, payload, params);
  submitProfile.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed to create profile`);
    logError(response, payload);
    fail(`Registrants - ${getIterationName()}: failed to create profile`);
  } else {
    // console.log(`Registrants - ${getIterationName()}: created profile`);
  }
}

const submitEvacuationFile = (token: any, profile: any, communities: any) => {
  const file = generateEvacuationFile(profile.personalDetails, communities);
  const payload = JSON.stringify(file);
  const params = getHTTPParams(token.access_token);

  const response = http.post(urls.submit, payload, params);
  submitFile.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Registrants - ${getIterationName()}: failed submit evacuation file`);
    logError(response, payload);
    fail(`Registrants - ${getIterationName()}: failed submit evacuation file`);
  } else {
    console.log(`Registrants - ${getIterationName()}: successfully submitted file`);
  }
}

export function RegistrantAnonymousRegistration() {
  navigate();
  getAnonymousStartPage();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  let security_questions = getSecurityQuestions();
  fillInForm();
  submitAnonymousRegistration(communities, security_questions);
};

export function RegistrantNewRegistration() {
  navigate();
  getStartPage();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  navigate();
  let token = getAuthToken();
  let profile_exists = getCurrentProfileExists(token);
  navigate();

  if (profile_exists == false) {
    //New Profile
    let security_questions = getSecurityQuestions();
    fillInForm();
    createProfile(token, communities, security_questions);
  }
  else {
    // console.log(`Registrants - ${getIterationName()}: using existing profile`);
  }

  let profile = getCurrentProfile(token);
  fillInForm();
  submitEvacuationFile(token, profile, communities);
};

export function RegistrantExistingProfileRegistration() {
  navigate();
  getStartPage();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  navigate();
  let token = getAuthToken();
  let profile_exists = getCurrentProfileExists(token);
  navigate();

  if (profile_exists == false) {
    //New Profile
    let security_questions = getSecurityQuestions();
    fillInForm();
    createProfile(token, communities, security_questions);
  }
  else {
    // console.log(`Registrants - ${getIterationName()}: using existing profile`);
  }

  let profile = getCurrentProfile(token);
  fillInForm();
  submitEvacuationFile(token, profile, communities);
};