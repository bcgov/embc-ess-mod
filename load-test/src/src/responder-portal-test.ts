import { sleep } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';

const baseUrl = 'https://dev1-embc-responders.apps.silver.devops.gov.bc.ca';
const urls = {
  //Metadata
  config: `${baseUrl}/api/Configuration`,
  communities: `${baseUrl}/api/Configuration/codes/communities`,
  provinces: `${baseUrl}/api/Configuration/codes/stateprovinces`,
  countries: `${baseUrl}/api/Configuration/codes/countries`,
  security_questions: `${baseUrl}/api/Configuration/security-questions`,

  start_page: `${baseUrl}`,
  auth_token: `https://dev.oidc.gov.bc.ca/auth/realms/udb1ycga/protocol/openid-connect/token`,
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
  const payload = "grant_type=password&username=dev-test-responder-1@bceid&password=MF2YN3VXEFPXA6VW&scope=openid%20registrants-portal-api";
  const params = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic cmVzcG9uZGVycy10ZXN0LXVzZXJzOjY1OGQ4NjM3LWUyNmYtNGVmMS1iMWU1LWZlMDk3MDFhNTg4YQ==",
    }
  };

  const response = http.post(urls.auth_token, payload, params);
  loginFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.log(JSON.stringify(response));
  }
  // console.log(JSON.stringify(response));
  // console.log(JSON.parse(JSON.stringify(response)).body);
  return response.json();
  // return JSON.parse(JSON.stringify(response)).body;
}

const getStartPage = () => {
    const response = http.get(urls.start_page);
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

export default () => {
  
  getStartPage();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  sleep(1);
  let token = getAuthToken();
  sleep(1);
};