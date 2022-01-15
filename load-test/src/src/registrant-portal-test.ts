import { Options } from 'k6/options';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';
import { generateAnonymousRegistration } from './generators/registrants/registration';
import { generateEvacuationFile } from './generators/registrants/evacuation-file';
import { generateProfile } from './generators/registrants/profile';

// @ts-ignore
import { RegistrantTestParameters } from '../load-test.parameters-APP_TARGET';
import { fillInForm, navigate } from './utilities';

const testParams = RegistrantTestParameters;
const baseUrl = testParams.baseUrl;
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

const loginFailRate = new Rate('failed to login');
const formFailRate = new Rate('failed form fetches');
const submitFailRate = new Rate('failed form submits');
const submitFile = new Trend('submit_file');
const submitAnonymous = new Trend('submit_anonymous');
const submitProfile = new Trend('submit_profile');
const loadTime = new Trend('load_time');
const loadCommunities = new Trend('load_communities');
const loadProfile = new Trend('load_profile');

const MAX_VU = 10;
const MAX_ITER = 50;

export const options: Options = {
  scenarios: {
    registrants_portal: {
      // executor: 'ramping-vus',
      // startVUs: 1,
      // stages: [
      //   { duration: '60s', target: 2 }, //target should be <= MAX_VU
      //   { duration: '120s', target: 10 },
      //   { duration: '60s', target: 4 },
      // ],
      // gracefulRampDown: '0s',

      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '1h30m',
    },
  },

  thresholds: {
    'failed form submits': ['rate<0.01'], //Less than 1% are allowed to fail
    'failed form fetches': ['rate<0.01'],
    'failed login': ['rate<0.01'],
    // 'http_req_duration{type:submit}': ['p(100)<4000'], // threshold on submit requests only (in ms)
    'submit_file': ['p(95)<5000'], // threshold on submit requests only (in ms)
    'submit_anonymous': ['p(95)<5000'], // threshold on submit requests only (in ms)
    'submit_profile': ['p(95)<5000'], // threshold on submit requests only (in ms)
    'load_time': ['p(95)<4000'], // threshold on load requests only (in ms)
    'load_communities': ['p(95)<4000'], // threshold on load requests only (in ms)
    'load_profile': ['p(95)<4000'], // threshold on load requests only (in ms)
    //'http_req_duration': ['p(95)<400'] //Only 5% or less are permitted to have a request duration longer than 400ms
  }
};

const getAuthToken = () => {
  let curr_vu = __VU - 1; //VU's begin at 1, not 0
  curr_vu = (curr_vu % MAX_VU) + 1;
  let curr_iter = __ITER % MAX_ITER;
  // console.log(`VU: ${curr_vu}  -  ITER: ${curr_iter}`);
  let username = `${testParams.usernameBase}${curr_vu}-${curr_iter}`;
  let password = `${testParams.passwordBase}${curr_vu}-${curr_iter}`
  const payload = `grant_type=${testParams.grantType}&username=${username}&password=${password}&scope=${testParams.scope}`;
  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${testParams.basicAuth}`,
    }
  };

  const response = http.post(urls.auth_token, payload, params);
  loginFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: failed to get auth token`);
    console.log(JSON.stringify(response));
  }
  return response.json();
}

const getStartPage = () => {
  const response = http.get(urls.start_page);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
}

const getAnonymousStartPage = () => {
  const response = http.get(urls.anonymous_start_page);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
}

const getConfiguration = () => {
  const response = http.get(urls.config);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
}

const getCommunities = () => {
  const response = http.get(urls.communities);
  formFailRate.add(response.status !== 200);
  loadCommunities.add(response.timings.waiting);
  return response.json();
}

const getProvinces = () => {
  const response = http.get(urls.provinces);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const getCountries = () => {
  const response = http.get(urls.countries);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const getSecurityQuestions = () => {
  const response = http.get(urls.security_questions);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const submitAnonymousRegistration = (communities: any, security_questions: any) => {
  const registration = generateAnonymousRegistration(communities, security_questions);
  const payload = JSON.stringify(registration);

  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
    }
  };

  const response = http.post(urls.submit_anonymous, payload, params);
  submitAnonymous.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: failed to submit anonymous registration`);
    console.log(payload);
    console.log(JSON.stringify(response));
  }
}

const getCurrentProfileExists = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.current_user_exists, params);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: failed to check if profile exists`);
    console.log(JSON.stringify(response));
  }
  return response.json();
}

const getCurrentProfile = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.current_profile, params);
  formFailRate.add(response.status !== 200);
  loadProfile.add(response.timings.waiting);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: failed to get current profile`);
    console.log(JSON.stringify(response));
  }
  return response.json();
}

const createProfile = (token: any, communities: any, security_questions: any) => {
  const profile = generateProfile(communities, security_questions);
  const payload = JSON.stringify(profile);

  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.post(urls.current_profile, payload, params);
  submitProfile.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: failed to create profile`);
    console.log(payload);
    console.log(JSON.stringify(response));
  } else {
    console.log(`${__VU},${__ITER}: created profile`);
  }
}

const submitEvacuationFile = (token: any, profile: any, communities: any) => {
  const file = generateEvacuationFile(profile.personalDetails, communities);
  const payload = JSON.stringify(file);

  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.post(urls.submit, payload, params);
  submitFile.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: failed submit evacuation file`);
    console.log(payload);
    console.log(JSON.stringify(response));
  } else {
    console.log(`${__VU},${__ITER}: submission successful`);
  }
}

export default () => {
  /* ----- Anonymous Registration ----- */
  // getAnonymousStartPage();
  // getConfiguration();
  // let communities = getCommunities();
  // getProvinces();
  // getCountries();
  // let security_questions = getSecurityQuestions();
  // fillInForm();
  // submitAnonymousRegistration(communities, security_questions);
  /* ---------- */

  /* ----- Authenticated Registration ----- */
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

  let profile = getCurrentProfile(token);
  fillInForm();
  submitEvacuationFile(token, profile, communities);
};