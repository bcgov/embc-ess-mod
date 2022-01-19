import { Options } from 'k6/options';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';
import { generateRegistrant } from './generators/responders/registrant';
import { generateNewPersonDetails, getPersonDetailsForIteration } from './generators/responders/person-details';
import { generateEvacuationFile, getUpdatedEvacuationFile } from './generators/responders/evacuation-file';
import { generateSupports } from './generators/responders/supports';
import { generateNote } from './generators/responders/notes';
import { fillInForm, navigate } from './utilities';

// @ts-ignore
import { ResponderTestParameters } from '../load-test.parameters-APP_TARGET';
// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const testParams = ResponderTestParameters;
const baseUrl = testParams.baseUrl;
const TASK_ID = testParams.taskId;

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

  auth_token: testParams.authEndpoint,
  start_page: `${baseUrl}`,
  dashboard: `${baseUrl}/responder-access/responder-dashboard`,
  task_search_page: `${baseUrl}/responder-access/search/task`,
  task_search: `${baseUrl}/api/Tasks/${TASK_ID}`,
  registrations_search: `${baseUrl}/api/Registrations`,
  ess_wizard: `${baseUrl}/ess-wizard/evacuee-profile/collection-notice`,
  registrant: `${baseUrl}/api/Registrations/registrants`,
  file: `${baseUrl}/api/Registrations/files`,
  task_suppliers: `${baseUrl}/api/Tasks/${TASK_ID}/suppliers`,
};

const loginFailRate = new Rate('failed to login');
const formFailRate = new Rate('failed form fetches');
const submitFailRate = new Rate('failed form submits');
// const submissionTime = new Trend('submission_time');
const submitFileTime = new Trend('submit_file');
const submitRegistrantTime = new Trend('submit_registrant');
const submitSupportsTime = new Trend('submit_supports');
const submitNoteTime = new Trend('submit_note');
const printRequestTime = new Trend('print_request_time');
const loadTime = new Trend('load_time');
const loadCommunitiesTime = new Trend('load_communities');
const loadFileTime = new Trend('load_file');
const loadRegistrantTime = new Trend('load_registrant');
const loadTaskSuppliersTime = new Trend('load_suppliers');
const searchTaskTime = new Trend('search_tasks');
const searchRegistrationsTime = new Trend('search_registrations');

// const MAX_VU = 100;
// const MAX_ITER = 10;

export const options: Options = {
  scenarios: {
    newRegistration: {
      exec: 'ResponderNewRegistration',

      // executor: 'ramping-vus',
      // startVUs: 1,
      // stages: [
      //   { duration: '5m', target: 100 }, //target should be <= MAX_VU
      // ],
      // gracefulRampDown: '5m',

      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '1h30m',
    },
    existingRegistration: {
      exec: 'ResponderExistingRegistration',
      // startTime: '120s',

      // executor: 'ramping-vus',
      // startVUs: 1,
      // stages: [
      //   { duration: '5m', target: 100 }, //target should be <= MAX_VU
      // ],
      // gracefulRampDown: '5m',

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
    'submit_file': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
    'submit_registrant': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
    'submit_supports': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
    'submit_note': ['p(95)<10000'], // 10s - threshold on submit requests only (in ms)
    'print_request_time': ['p(95)<90000'], // 90s - threshold on print requests only (in ms)
    'load_time': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
    'load_communities': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
    'load_file': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
    'load_registrant': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
    'load_suppliers': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
    'search_tasks': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
    'search_registrations': ['p(95)<6000'], // 6s - threshold on load requests only (in ms)
  }
};

const getAuthToken = () => {
  const payload = `grant_type=${testParams.grantType}&username=${testParams.username}&password=${testParams.password}&scope=${testParams.scope}`;
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
    console.log(`${__VU},${__ITER}: error getting auth token`);
    console.log(JSON.stringify(response));
  }
  return response.json();
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
  loadCommunitiesTime.add(response.timings.waiting);
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

  if (response.status !== 200) {
    // console.log(`${__VU},${__ITER}: error retrieving outage info`);
  }
  return; //response.json();
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
  searchTaskTime.add(response.timings.waiting);
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
  searchRegistrationsTime.add(response.timings.waiting);
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

  const response = http.post(urls.registrant, payload, params);
  submitRegistrantTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: error submitting registrant`);
    console.log(payload);
    console.log(JSON.stringify(response));
  }

  return response.json();
}

const getRegistrant = (token: any, regRes: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(`${urls.registrant}/${regRes.id}`, params);
  formFailRate.add(response.status !== 200);
  loadRegistrantTime.add(response.timings.waiting);
  return response.json();
}

const submitEvacuationFile = (token: any, registrantId: any, registrant: any, communities: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const evacuationFile = generateEvacuationFile(registrantId.id, registrant, communities, TASK_ID);
  const payload = JSON.stringify(evacuationFile);

  const response = http.post(urls.file, payload, params);
  submitFileTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: error submitting file`);
    console.log(payload);
    console.log(JSON.stringify(response));
  }

  return response.json();
}

const updateEvacuationFile = (token: any, file: any, registrantId: any, registrant: any, task: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const evacuationFile = getUpdatedEvacuationFile(file, registrantId.id, registrant, task);
  const payload = JSON.stringify(evacuationFile);

  const response = http.post(`${urls.file}/${file.id}`, payload, params);
  submitFileTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: error updating file`);
    console.log(payload);
    console.log(JSON.stringify(response));
  }

  return response.json();
}

const getEvacuationFile = (token: any, fileRes: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(`${urls.file}/${fileRes.id}`, params);
  formFailRate.add(response.status !== 200);
  loadFileTime.add(response.timings.waiting);

  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: failed to load file`);
    console.log(JSON.stringify(response));
  }
  return response.json();
}

const getTaskSuppliers = (token: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const response = http.get(urls.task_suppliers, params);
  formFailRate.add(response.status !== 200);
  loadTaskSuppliersTime.add(response.timings.waiting);
  return response.json();
}

const submitSupports = (token: any, file: any, suppliers: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const supports = generateSupports(file, suppliers);
  const payload = JSON.stringify(supports);

  const response = http.post(`${urls.file}/${file.id}/supports?includeSummaryInPrintRequest=true`, payload, params);
  submitSupportsTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: error submitting supports`);
    console.log(payload);
    console.log(JSON.stringify(response));
  }

  return response.json();
}

const submitPrintRequest = (token: any, file: any, printRequest: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    },
    timeout: 120000 //default timeout of 60s was often failing, so increase to 120s
  };

  // console.log(`${urls.file}/${file.id}/supports/print/${printRequest.printRequestId}`);

  const response = http.get(`${urls.file}/${file.id}/supports/print/${printRequest.printRequestId}`, params);
  printRequestTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);

  // return response.html();
}

const submitFileNote = (token: any, file: any) => {
  const params = {
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "Authorization": `Bearer ${token.access_token}`
    }
  };

  const note = generateNote();
  const payload = JSON.stringify(note);

  const response = http.post(`${urls.file}/${file.id}/notes`, payload, params);
  submitNoteTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.log(`${__VU},${__ITER}: error submitting note`);
    console.log(payload);
    console.log(JSON.stringify(response));
  }

  return response.json();
}

export function ResponderNewRegistration() {
  const registrant = generateNewPersonDetails();

  getStartPage();
  navigate();
  let token = getAuthToken();

  getDashboard();
  // getOutageInfo();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  getMemberRole(token);
  getMemberLabel(token);
  navigate();

  getTaskSearchPage(token);
  navigate();
  let task = searchTasks(token);
  navigate();

  let registrantId: any = "";
  let fileId: any = "";
  let file: any;

  let existing_registrations: any = searchRegistrations(token, registrant);
  navigate();

  if (existing_registrations?.files?.length > 0 && existing_registrations?.registrants?.length > 0) {
    //update existing file
    console.log(`${__VU},${__ITER}: found existing registration`);
    registrantId = { id: existing_registrations.registrants[0].id };
    fileId = { id: existing_registrations.files[0].id };
    file = getEvacuationFile(token, fileId);
    updateEvacuationFile(token, file, registrantId, registrant, task);
  }
  else {
    //create new registrant and file
    console.log(`${__VU},${__ITER}: no existing registrations - create new`);
    getNewEvacueeWizard(token);
    let security_questions = getSecurityQuestions();
    fillInForm();

    registrantId = submitRegistrant(token, registrant, communities, security_questions);
    getRegistrant(token, registrantId);
    fillInForm();

    fileId = submitEvacuationFile(token, registrantId, registrant, communities);
  }

  file = getEvacuationFile(token, fileId);

  let suppliers = getTaskSuppliers(token);
  console.log(`${__VU},${__ITER}: submit supports`);
  fillInForm();
  let printRequest = submitSupports(token, file, suppliers);
  navigate();

  console.log(`${__VU},${__ITER}: submit print request`);
  submitPrintRequest(token, file, printRequest);
  navigate();

  console.log(`${__VU},${__ITER}: submit file note`);
  submitFileNote(token, file);
};

export function ResponderExistingRegistration() {
  const registrant = getPersonDetailsForIteration();

  getStartPage();
  navigate();
  let token = getAuthToken();

  getDashboard();
  // getOutageInfo();
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  getMemberRole(token);
  getMemberLabel(token);
  navigate();

  getTaskSearchPage(token);
  navigate();
  let task = searchTasks(token);
  navigate();

  let registrantId: any = "";
  let fileId: any = "";
  let file: any;

  let existing_registrations: any = searchRegistrations(token, registrant);
  navigate();

  if (existing_registrations?.files?.length > 0 && existing_registrations?.registrants?.length > 0) {
    //update existing file
    console.log(`${__VU},${__ITER}: found existing registration`);
    registrantId = { id: existing_registrations.registrants[0].id };
    fileId = { id: existing_registrations.files[0].id };
    file = getEvacuationFile(token, fileId);
    updateEvacuationFile(token, file, registrantId, registrant, task);
  }
  else {
    //create new registrant and file
    console.log(`${__VU},${__ITER}: no existing registrations - create new`);
    getNewEvacueeWizard(token);
    let security_questions = getSecurityQuestions();
    fillInForm();

    registrantId = submitRegistrant(token, registrant, communities, security_questions);
    getRegistrant(token, registrantId);
    fillInForm();

    fileId = submitEvacuationFile(token, registrantId, registrant, communities);
  }

  file = getEvacuationFile(token, fileId);

  let suppliers = getTaskSuppliers(token);
  console.log(`${__VU},${__ITER}: submit supports`);
  fillInForm();
  let printRequest = submitSupports(token, file, suppliers);
  navigate();

  console.log(`${__VU},${__ITER}: submit print request`);
  submitPrintRequest(token, file, printRequest);
  navigate();

  console.log(`${__VU},${__ITER}: submit file note`);
  submitFileNote(token, file);
};

export function handleSummary(data: any) {
  return {
    "responder.summary.html": htmlReport(data),
  };
}