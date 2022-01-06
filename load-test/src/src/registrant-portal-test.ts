import { sleep } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';

import { generateAnonymousRegistration } from './generators/registrants/registration';
import { generateEvacuationFile } from './generators/registrants/evacuation-file';

const baseUrl = 'https://dev1-era-registrants.apps.silver.devops.gov.bc.ca';
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
  auth_token: `https://dev-era-auth.apps.silver.devops.gov.bc.ca/connect/token`,
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
const submissionTime = new Trend('submission_time');
const loadTime = new Trend('load_time');

export const options: Options = {
  vus: 1,
  duration: '8s',
  thresholds: {
    'failed form submits': ['rate<0.01'], //Less than 1% are allowed to fail
    'failed form fetches': ['rate<0.01'],
    'failed login': ['rate<0.01'],
    // 'http_req_duration{type:submit}': ['p(100)<4000'], // threshold on submit requests only (in ms)
    'submission_time': ['p(100)<5000'], // threshold on submit requests only (in ms)
    'load_time': ['p(100)<4000'], // threshold on submit requests only (in ms)
    //'http_req_duration': ['p(95)<400'] //Only 5% or less are permitted to have a request duration longer than 400ms
  }
};

const getAuthToken = () => {
  const payload = "grant_type=password&username=EVAC00012&password=98912&scope=openid%20registrants-portal-api";
  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic ZGV2LXRlc3QtY2xpZW50OktQM0hHVE1RUVA2WEtYVVo=",
    }
  };

  const response = http.post(urls.auth_token, payload, params);
  loginFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  if (response.status !== 200) {
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
  loadTime.add(response.timings.waiting);
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
      accept: "application/json",
      "content-type": "application/json",
    }
  };

  const response = http.post(urls.submit_anonymous, payload, params);
  submissionTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(payload);
  }
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
  loadTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.log(JSON.stringify(response));
  }
  return response.json();
}

const submitEvacuationFile = (profile: any, communities: any, token: any) => {
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
  submissionTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(payload);
    console.log(JSON.stringify(response));
  } else {
    console.log("submission successful");
  }
}

export default () => {

  /* ----- Anonymous Registration ----- */
  getAnonymousStartPage();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  let security_questions = getSecurityQuestions();
  sleep(2);
  submitAnonymousRegistration(communities, security_questions);
  /* ---------- */

  /* ----- Authenticated Registration ----- */
  // getStartPage();
  // getConfiguration();
  // let communities = getCommunities();
  // getProvinces();
  // getCountries();
  // sleep(1);
  // let token = getAuthToken();
  // sleep(1);
  // let profile = getCurrentProfile(token);
  // sleep(2);
  // //should update current profile too?
  // submitEvacuationFile(profile, communities, token);
  /* ---------- */
};