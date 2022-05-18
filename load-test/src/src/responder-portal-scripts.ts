import { Rate, Trend } from 'k6/metrics';
import { generateRegistrant } from './generators/responders/registrant';
import { generateNewPersonDetails, getPersonDetailsForIteration } from './generators/responders/person-details';
import { generateEvacuationFile, getUpdatedEvacuationFile } from './generators/responders/evacuation-file';
import { generateSupports } from './generators/responders/supports';
import { generateNote } from './generators/responders/notes';
import { fillInForm, getHTTPParams, getIterationName, getRandomInt, logError, navigate } from './utilities';

// @ts-ignore
import { ResponderTestParameters } from '../load-test.parameters-APP_TARGET';
import { MyHttp } from './http';
import { fail } from 'k6';

const testParams = ResponderTestParameters;
const baseUrl = testParams.baseUrl;
const TASK_ID = testParams.taskId;
const http = new MyHttp();

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

const loginFailRate = new Rate('res_failed_to_login');
const formFailRate = new Rate('res_failed_form_fetches');
const submitFailRate = new Rate('res_failed_form_submits');
const submitFileTime = new Trend('res_submit_file');
const submitRegistrantTime = new Trend('res_submit_registrant');
const submitSupportsTime = new Trend('res_submit_supports');
const submitNoteTime = new Trend('res_submit_note');
const printRequestTime = new Trend('res_print_request_time');
const loadHTMLTime = new Trend('res_load_html_time');
const loadMemberRole = new Trend('res_load_member_role');
const loadMemberLabel = new Trend('res_load_member_label');
const loadAuthToken = new Trend('res_load_auth_token');
const loadConfig = new Trend('res_load_configuration');
const loadSecurityQuestions = new Trend('res_load_security_questions');
const loadProvincesTime = new Trend('res_load_provinces');
const loadCountriesTime = new Trend('res_load_countries');
const loadCommunitiesTime = new Trend('res_load_communities');
const loadFileTime = new Trend('res_load_file');
const loadRegistrantTime = new Trend('res_load_registrant');
const loadTaskSuppliersTime = new Trend('res_load_suppliers');
const searchTaskTime = new Trend('res_search_tasks');
const searchRegistrationsTime = new Trend('res_search_registrations');
const searchRegistrationsNoResultTime = new Trend('res_search_registrations_no_result');

const getAuthToken = () => {
  const payload = `grant_type=${testParams.grantType}&username=${testParams.username}&password=${testParams.password}&scope=${testParams.scope}`;
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
    console.error(`Responders - ${getIterationName()}: error getting auth token`);
    logError(response);
    fail(`Responders - ${getIterationName()}: error getting auth token`);

  }
  return response.json();
}

const getStartPage = () => {
  const params = getHTTPParams();
  const response = http.get(urls.start_page, params);
  formFailRate.add(response.status !== 200);
  loadHTMLTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get start page`);
  }
}

const getDashboard = () => {
  const params = getHTTPParams();
  const response = http.get(urls.dashboard, params);
  formFailRate.add(response.status !== 200);
  loadHTMLTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get dashboard`);
  }
}

const getConfiguration = () => {
  const params = getHTTPParams();
  const response = http.get(urls.config, params);
  formFailRate.add(response.status !== 200);
  loadConfig.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get config`);
  }
}

const getCommunities = () => {
  const params = getHTTPParams();
  const response = http.get(urls.communities, params);
  formFailRate.add(response.status !== 200);
  loadCommunitiesTime.add(response.timings.waiting);
  if (response.status !== 200) {
    fail(`Responders - ${getIterationName()}: failed to get communities`);
  }
  return response.json();
}

const getProvinces = () => {
  const params = getHTTPParams();
  const response = http.get(urls.provinces, params);
  formFailRate.add(response.status !== 200);
  loadProvincesTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get provinces`);
  }
}

const getCountries = () => {
  const params = getHTTPParams();
  const response = http.get(urls.countries, params);
  formFailRate.add(response.status !== 200);
  loadCountriesTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get countries`);
  }
}

const getSecurityQuestions = () => {
  const params = getHTTPParams();
  const response = http.get(urls.security_questions, params);
  formFailRate.add(response.status !== 200);
  loadSecurityQuestions.add(response.timings.waiting);
  if (response.status !== 200) {
    fail(`Responders - ${getIterationName()}: failed to get security questions`);
  }
  return response.json();
}

// const getOutageInfo = () => {
//   const response = http.get(urls.outage_info);
//   formFailRate.add(response.status !== 200);
//   loadHTMLTime.add(response.timings.waiting);

//   if (response.status !== 200) {
//     console.error(`Responders - ${getIterationName()}: error retrieving outage info`);
//   }
//   return; //response.json();
// }

const getMemberRole = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.member_role, params);
  formFailRate.add(response.status !== 200);
  loadMemberRole.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get member roles`);
  }
}

const getMemberLabel = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.member_label, params);
  formFailRate.add(response.status !== 200);
  loadMemberLabel.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get member label`);
  }
}

const getTaskSearchPage = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.task_search_page, params);
  formFailRate.add(response.status !== 200);
  loadHTMLTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get task search page`);
  }
}

const searchTasks = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.task_search, params);
  formFailRate.add(response.status !== 200);
  searchTaskTime.add(response.timings.waiting);
  if (response.status !== 200) {
    fail(`Responders - ${getIterationName()}: error searching tasks`);
  }
  return response.json();
}

const searchRegistrations = (token: any, registrant: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.registrations_search + `?firstName=${registrant.firstName}&lastName=${registrant.lastName}&dateOfBirth=${registrant.dateOfBirth}`, params);
  formFailRate.add(response.status !== 200);

  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: error searching regisrations`);
    logError(response);
    fail(`Responders - ${getIterationName()}: error searching regisrations`);
  }

  if (response.json()) {
    let res: any = response.json();
    if (res?.files?.length > 0 && res?.registrants?.length > 0) {
      searchRegistrationsTime.add(response.timings.waiting);
    }
    else {
      searchRegistrationsNoResultTime.add(response.timings.waiting);
    }
  }
  return response.json();
}

const getNewEvacueeWizard = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.ess_wizard, params);
  formFailRate.add(response.status !== 200);
  loadHTMLTime.add(response.timings.waiting);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to get new evacuee wizard`);
  }
  // return response.html();
}

const submitRegistrant = (token: any, registrant: any, communities: any, security_questions: any) => {
  const params = getHTTPParams(token.access_token);

  const registration = generateRegistrant(registrant, communities, security_questions);
  const payload = JSON.stringify(registration);

  const response = http.post(urls.registrant, payload, params);
  submitRegistrantTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: error submitting registrant`);
    logError(response, payload);
    fail(`Responders - ${getIterationName()}: error submitting registrant`);
  }

  return response.json();
}

const getRegistrant = (token: any, regRes: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(`${urls.registrant}/${regRes.id}`, params);
  formFailRate.add(response.status !== 200);
  loadRegistrantTime.add(response.timings.waiting);
  if (response.status !== 200) {
    fail(`Responders - ${getIterationName()}: failed to get registrant`);
  }
  return response.json();
}

const submitEvacuationFile = (token: any, registrantId: any, registrant: any, communities: any) => {
  const params = getHTTPParams(token.access_token);

  const evacuationFile = generateEvacuationFile(registrantId.id, registrant, communities, TASK_ID);
  const payload = JSON.stringify(evacuationFile);

  const response = http.post(urls.file, payload, params);
  submitFileTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: error submitting file`);
    logError(response, payload);
    fail(`Responders - ${getIterationName()}: error submitting file`);
  }
  else {
    console.log(`Responders - ${getIterationName()}: successfully submitted file`);
  }

  return response.json();
}

const updateEvacuationFile = (token: any, file: any, registrantId: any, registrant: any, task: any) => {
  const params = getHTTPParams(token.access_token);

  const evacuationFile = getUpdatedEvacuationFile(file, registrantId.id, registrant, task);
  const payload = JSON.stringify(evacuationFile);

  const response = http.post(`${urls.file}/${file.id}`, payload, params);
  submitFileTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: error updating file`);
    logError(response, payload);
    fail(`Responders - ${getIterationName()}: error updating file`);
  }
  else {
    console.log(`Responders - ${getIterationName()}: successfully updated file`);
  }

  return response.json();
}

const getEvacuationFile = (token: any, fileRes: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(`${urls.file}/${fileRes.id}`, params);
  formFailRate.add(response.status !== 200);
  loadFileTime.add(response.timings.waiting);

  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: failed to load file`);
    logError(response);
    fail(`Responders - ${getIterationName()}: failed to load file`);
  }
  return response.json();
}

const getTaskSuppliers = (token: any) => {
  const params = getHTTPParams(token.access_token);

  const response = http.get(urls.task_suppliers, params);
  formFailRate.add(response.status !== 200);
  loadTaskSuppliersTime.add(response.timings.waiting);
  if (response.status !== 200) {
    fail(`Responders - ${getIterationName()}: failed to get task suppliers`);
  }
  return response.json();
}

const submitSupports = (token: any, file: any, suppliers: any) => {
  const params = getHTTPParams(token.access_token);

  const supports = generateSupports(file, suppliers);
  const payload = JSON.stringify(supports);

  const response = http.post(`${urls.file}/${file.id}/supports`, payload, params);
  submitSupportsTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: error submitting supports`);
    logError(response, payload);
    fail(`Responders - ${getIterationName()}: error submitting supports`);
  }

  return response.json();
}

const submitPrintRequest = (token: any, file: any, printRequest: any) => {
  const params = getHTTPParams(token.access_token);

  // console.log(`${urls.file}/${file.id}/supports/print/${printRequest.printRequestId}`);

  const response = http.get(`${urls.file}/${file.id}/supports/print/${printRequest.printRequestId}`, params);
  printRequestTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);

  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: error getting pdf`);
    logError(response);
    fail(`Responders - ${getIterationName()}: error getting pdf`);
  }
  else {
    console.log(`Responders - ${getIterationName()}: successfully received pdf`);
  }

  // return response.html();
}

const submitFileNote = (token: any, file: any) => {
  const params = getHTTPParams(token.access_token);

  const note = generateNote();
  const payload = JSON.stringify(note);

  const response = http.post(`${urls.file}/${file.id}/notes`, payload, params);
  submitNoteTime.add(response.timings.waiting);
  submitFailRate.add(response.status !== 200);
  if (response.status !== 200) {
    console.error(`Responders - ${getIterationName()}: error submitting note`);
    logError(response, payload);
    fail(`Responders - ${getIterationName()}: error submitting note`);
  }
  else {
    console.log(`Responders - ${getIterationName()}: successfully submitted note`);
  }

  return response.json();
}


export function ResponderNewRegistration() {
  let token: any = null;
  let communities: any = null;
  let security_questions: any = null;
  let ITERATIONS_PER_LOGIN = 1;

  navigate();
  if (__ITER % ITERATIONS_PER_LOGIN == 0) { //simulate working on multiple registrants in the same session, only get metadata and login token every once in a while
    ITERATIONS_PER_LOGIN = getRandomInt(1, 3);
    // console.log(`Responders - ${getIterationName()}: start fresh - get token and metadata`);
    getStartPage();
    navigate();
    token = getAuthToken();
    getDashboard();
    getConfiguration();
    communities = getCommunities();
    getProvinces();
    getCountries();
    getMemberRole(token);
    getMemberLabel(token);
    security_questions = getSecurityQuestions();
    navigate();
  }

  const registrant = generateNewPersonDetails();
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
    // console.log(`Responders - ${getIterationName()}: found existing registration`);
    registrantId = { id: existing_registrations.registrants[0].id };
    fileId = { id: existing_registrations.files[0].id };
    file = getEvacuationFile(token, fileId);
    updateEvacuationFile(token, file, registrantId, registrant, task);
  }
  else {
    //create new registrant and file
    // console.log(`Responders - ${getIterationName()}: no existing registrations - create new`);
    getNewEvacueeWizard(token);
    fillInForm();

    registrantId = submitRegistrant(token, registrant, communities, security_questions);
    getRegistrant(token, registrantId);
    fillInForm();

    fileId = submitEvacuationFile(token, registrantId, registrant, communities);
  }

  file = getEvacuationFile(token, fileId);

  let suppliers = getTaskSuppliers(token);
  // console.log(`Responders - ${getIterationName()}: submit supports`);
  fillInForm();
  let printRequest = submitSupports(token, file, suppliers);
  navigate();

  // console.log(`Responders - ${getIterationName()}: submit print request`);
  submitPrintRequest(token, file, printRequest);
  navigate();

  // console.log(`Responders - ${getIterationName()}: submit file note`);
  submitFileNote(token, file);
};

export function ResponderExistingRegistration() {
  let token: any = null;
  let communities: any = null;
  let security_questions: any = null;
  let ITERATIONS_PER_LOGIN = 1;

  navigate();
  if (__ITER % ITERATIONS_PER_LOGIN == 0) { //simulate working on multiple registrants in the same session, only get metadata and login token every once in a while
    ITERATIONS_PER_LOGIN = getRandomInt(1, 3);
    // console.log(`Responders - ${getIterationName()}: start fresh - get token and metadata`);
    getStartPage();
    navigate();
    token = getAuthToken();
    getDashboard();
    getConfiguration();
    communities = getCommunities();
    getProvinces();
    getCountries();
    getMemberRole(token);
    getMemberLabel(token);
    security_questions = getSecurityQuestions();
    navigate();
  }
  const registrant = getPersonDetailsForIteration();
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
    // console.log(`Responders - ${getIterationName()}: found existing registration`);
    registrantId = { id: existing_registrations.registrants[0].id };
    fileId = { id: existing_registrations.files[0].id };
    file = getEvacuationFile(token, fileId);
    updateEvacuationFile(token, file, registrantId, registrant, task);
  }
  else {
    //create new registrant and file
    // console.log(`Responders - ${getIterationName()}: no existing registrations - create new`);
    getNewEvacueeWizard(token);
    fillInForm();

    registrantId = submitRegistrant(token, registrant, communities, security_questions);
    getRegistrant(token, registrantId);
    fillInForm();

    fileId = submitEvacuationFile(token, registrantId, registrant, communities);
  }

  file = getEvacuationFile(token, fileId);

  let suppliers = getTaskSuppliers(token);
  // console.log(`Responders - ${getIterationName()}: submit supports`);
  fillInForm();
  let printRequest = submitSupports(token, file, suppliers);
  navigate();

  // console.log(`Responders - ${getIterationName()}: submit print request`);
  submitPrintRequest(token, file, printRequest);
  navigate();

  // console.log(`Responders - ${getIterationName()}: submit file note`);
  submitFileNote(token, file);
};