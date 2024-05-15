import { fail } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { generateEvacuationFile } from './generators/registrants/evacuation-file';
import { generateProfile } from './generators/registrants/profile';
import { generateAnonymousRegistration } from './generators/registrants/registration';
import { HttpHelper } from './helpers/http-helpers';
import { urls } from './helpers/registrants/urls';
import { MyHttp } from './http';
import { fillInForm, getIterationName, logError, navigate } from './utilities';
// @ts-ignore
import { MAX_ITER, MAX_VU, RegistrantTestParameters } from '../load-test.parameters-APP_TARGET';

const testParams = RegistrantTestParameters;
const http = new MyHttp();
const testHttp = new HttpHelper("Registrants");

const loginFailRate = new Rate('reg_failed_to_login');
const formFailRate = new Rate('reg_failed_form_fetches');
const submitFailRate = new Rate('reg_failed_form_submits');
const submitFile = new Trend('reg_submit_file');
const submitAnonymous = new Trend('reg_submit_anonymous');
const submitProfile = new Trend('reg_submit_profile');
const loadHTMLTime = new Trend('res_load_html_time');
const loadAuthToken = new Trend('reg_load_auth_token');
const loadConfig = new Trend('reg_load_configuration');
const loadOpenIdConfig = new Trend('reg_load_openid_configuration');
const loadSecurityQuestions = new Trend('reg_load_security_questions');
const loadProvincesTime = new Trend('reg_load_provinces');
const loadCountriesTime = new Trend('reg_load_countries');
const loadCommunities = new Trend('reg_load_communities');
const loadProfile = new Trend('reg_load_profile');
const loadProfileExists = new Trend('reg_load_profile_exists');
const loadEvacuations = new Trend('reg_load_evacuations');
const loadConflicts = new Trend('reg_load_conflicts');
const loadEnumCodes = new Trend('reg_load_enum_codes');
const loadEligible = new Trend('reg_load_eligible');

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

  const response = http.post(urls.auth_token.url, payload, params);
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
  return testHttp.get(urls.start_page, formFailRate, loadHTMLTime);
}

const getAnonymousStartPage = () => {
  return testHttp.get(urls.anonymous_start_page, formFailRate, loadHTMLTime);
}

const getConfiguration = () => {
  return testHttp.get(urls.config, formFailRate, loadConfig);
}

const getCommunities = () => {
  return testHttp.get(urls.communities, formFailRate, loadCommunities);
}

const getProvinces = () => {
  return testHttp.get(urls.provinces, formFailRate, loadProvincesTime);
}

const getCountries = () => {
  return testHttp.get(urls.countries, formFailRate, loadCountriesTime);
}

const getSecurityQuestions = () => {
  return testHttp.get(urls.security_questions, formFailRate, loadSecurityQuestions);
}

const getOpenIdConfiguration = () => {
  return testHttp.get(urls.openid_config, formFailRate, loadOpenIdConfig);
}

const getEnumCodes = (type: string) => {
  let url = { url: urls.enum_codes.url + type, name: "Enum codes for " + type };
  return testHttp.get(url, formFailRate, loadEnumCodes);
}

const submitAnonymousRegistration = (communities: any, security_questions: any) => {
  const registration = generateAnonymousRegistration(communities, security_questions);
  return testHttp.post(urls.submit_anonymous, registration, submitFailRate, submitAnonymous);
}

const getCurrentEvacuations = (token: any) => {
  return testHttp.get(urls.current_evacuations, formFailRate, loadEvacuations, token);
}

const getCurrentProfileExists = (token: any) => {
  return testHttp.get(urls.current_user_exists, formFailRate, loadProfileExists, token);
}

const getCurrentProfile = (token: any) => {
  return testHttp.get(urls.current_profile, formFailRate, loadProfile, token);
}

const getConflicts = (token: any) => {
  return testHttp.get(urls.conflicts, formFailRate, loadConflicts, token);
}

const createProfile = (token: any, communities: any, security_questions: any) => {
  const profile = generateProfile(communities, security_questions);
  return testHttp.post(urls.current_profile, profile, submitFailRate, submitProfile, token);
}

const submitEvacuationFile = (token: any, profile: any, communities: any, selfServe: boolean = false) => {
  const file = generateEvacuationFile(profile.personalDetails, communities, selfServe);
  return testHttp.post(urls.submit, file, submitFailRate, submitFile, token);
}

const getIsEligible = (token: any, referenceNumber: any) => {
  let urlInfo = { url: `${urls.submit.url}/${referenceNumber}/Supports/eligible`, name: "Eligibility" };
  return testHttp.get(urlInfo, formFailRate, loadEligible, token);
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
  navigate(); //open browser and navigate to portal
  getStartPage();

  /**Load Meta Data */
  getConfiguration();
  //get env info
  let communities = getCommunities();
  // if (communities) return;
  getProvinces();
  getCountries();
  let security_questions = getSecurityQuestions();
  getOpenIdConfiguration();
  getEnumCodes("SupportStatus");
  getEnumCodes("SupportCategory");
  getEnumCodes("SupportSubCategory");
  /**End Load Meta Data */

  navigate(); //Login
  //Technically the portal loads all that meta data again when you are returned to the portal page after the login page
  let token = getAuthToken();
  // console.log(token);
  let profile_exists = getCurrentProfileExists(token);

  // navigate();

  if (profile_exists == false) {
    //New Profile
    console.log(`Registrants - ${getIterationName()}: creating new profile`)
    let security_questions = getSecurityQuestions();
    fillInForm();
    createProfile(token, communities, security_questions);
  }
  else {
    console.log(`Registrants - ${getIterationName()}: using existing profile`);
    let conflicts = getConflicts(token);
    console.log("conflicts:");
    console.log(conflicts);
    if (conflicts) navigate();
    //should update current profile???...
  }

  let profile = getCurrentProfile(token);
  getCurrentEvacuations(token);
  fillInForm();

  let selfServe = true;
  let fileRef = submitEvacuationFile(token, profile, communities, selfServe);
  console.log(fileRef)
  let eligibility = getIsEligible(token, fileRef.referenceNumber);
  console.log(eligibility)
  if (eligibility && eligibility.isEligable) {
    //can either proceed with e-transfer, or opt-out

    //if E-transfer
    //get draft - 
    //https://dev-era-evacuees.apps.silver.devops.gov.bc.ca/api/Evacuations/169465/Supports/draft

    //click next and post to draft - 
    //https://dev-era-evacuees.apps.silver.devops.gov.bc.ca/api/Evacuations/169465/Supports/draft
    // [{"$type":"SelfServeClothingSupport","type":"Clothing","totalAmount":150,"includedHouseholdMembers":["15171876-2379-4287-82ec-569e9488ce50"]}]

    // another POST - https://dev-era-evacuees.apps.silver.devops.gov.bc.ca/api/Evacuations/169465/Supports
    // {"evacuationFileId":"169465","supports":[{"$type":"SelfServeClothingSupport","type":"Clothing","totalAmount":150,"includedHouseholdMembers":["15171876-2379-4287-82ec-569e9488ce50"]}],"eTransferDetails":{"recipientName":"EVAC THREE","eTransferEmail":"mr.anderson@gmail.com.test"}}



    //else Opt-out - POST
    //https://dev-era-evacuees.apps.silver.devops.gov.bc.ca/api/Evacuations/169467/Supports/optout
  }

  getCurrentEvacuations(token);
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