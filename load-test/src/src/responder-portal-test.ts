import { sleep } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';
import { generateRegistrant } from './generators/responders/registration';
import { generatePersonDetails } from './generators/responders/person-details';
import { generateEvacuationFile } from './generators/responders/evacuation-file';

const baseUrl = 'https://dev1-embc-responders.apps.silver.devops.gov.bc.ca';
const TASK_ID = 'UNIT-TEST-ACTIVE-TASK';

const urls = {
  //Metadata
  config: `${baseUrl}/api/Configuration`,
  communities: `${baseUrl}/api/Configuration/codes/communities`,
  provinces: `${baseUrl}/api/Configuration/codes/stateprovinces`,
  countries: `${baseUrl}/api/Configuration/codes/countries`,
  security_questions: `${baseUrl}/api/Configuration/security-questions`,
  outage_info: `${baseUrl}/api/Configuration/outage-info`,

  member_role: `${baseUrl}/api/team/members/codes/memberrole`,
  member_label: `${baseUrl}/api/team/members/codes/memberlabel`,

  auth_token: `https://dev.oidc.gov.bc.ca/auth/realms/udb1ycga/protocol/openid-connect/token`,
  start_page: `${baseUrl}`,
  dashboard: `${baseUrl}/responder-access/responder-dashboard`,
  task_search_page: `${baseUrl}/responder-access/search/task`,
  task_search: `${baseUrl}/api/Tasks/${TASK_ID}`,
  registrations_search: `${baseUrl}/api/Registrations`,
  ess_wizard: `${baseUrl}/ess-wizard/evacuee-profile/collection-notice`,
  submit_registrant: `${baseUrl}/api/Registrations/registrants`,
  submit_file: `${baseUrl}/api/Registrations/files`,
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

const getDashboard = () => {
  const response = http.get(urls.dashboard);
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

const getOutageInfo = () => {
  const response = http.get(urls.outage_info);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const getMemberRole = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.member_role, params);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const getMemberLabel = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.member_label, params);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const getTaskSearchPage = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.task_search_page, params);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.html();
}

const searchTasks = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.task_search, params);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const searchRegistrations = (token: any, registrant: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.registrations_search + `?firstName=${registrant.firstName}&lastName=${registrant.lastName}&dateOfBirth=${registrant.dateOfBirth}`, params);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.json();
}

const getNewEvacueeWizard = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.ess_wizard, params);
  formFailRate.add(response.status !== 200);
  loadTime.add(response.timings.waiting);
  return response.html();
}

const submitRegistrant = (token: any, registrant: any, communities: any, security_questions: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const registration = generateRegistrant(registrant, communities, security_questions);
  const payload = JSON.stringify(registration);

  const response = http.post(urls.submit_registrant, payload, params);
  submissionTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(payload);
  }

  return response.json();
}

const submitEvacuaitonFile = (token: any, registrantId: any, registrant: any, communities: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const evacuationFile = generateEvacuationFile(registrantId.id, registrant, communities, TASK_ID);
  const payload = JSON.stringify(evacuationFile);

  const response = http.post(urls.submit_file, payload, params);
  submissionTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(payload);
  }

  return response.json();
}

export default () => {
  const REGISTRANT = generatePersonDetails();

  getStartPage();
  let token = getAuthToken();
  console.log("got auth token");
  sleep(1);

  getDashboard();
  getOutageInfo();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  getMemberRole(token);
  getMemberLabel(token);
  sleep(1);

  getTaskSearchPage(token);
  searchTasks(token);
  console.log("did task search");

  sleep(1);

  searchRegistrations(token, REGISTRANT);
  console.log("did reg search");

  getNewEvacueeWizard(token);
  let security_questions = getSecurityQuestions();

  let registrantId = submitRegistrant(token, REGISTRANT, communities, security_questions);
  console.log("created registrant");

  let fileId = submitEvacuaitonFile(token, registrantId, REGISTRANT, communities);
  console.log("created file");

};