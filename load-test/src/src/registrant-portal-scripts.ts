import { fail } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { DraftSupports, SubmitSupportsRequest } from './api/registrants/models';
import { StrictHttpResponse } from './api/registrants/strict-http-response';
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
const submitSupportsDraft = new Trend('reg_submit_supports_draft');
const submitSupports = new Trend('reg_submit_support');
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
const loadSupportsDraft = new Trend('reg_load_supports_draft');

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

const createProfile = (token: any, communities: any, security_questions: any, selfServe: boolean = false) => {
  const profile = generateProfile(communities, security_questions, selfServe);
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

const getSupportDraft = (token: any, referenceNumber: any) => {
  let urlInfo = { url: `${urls.submit.url}/${referenceNumber}/Supports/draft`, name: "Supoprt draft" };
  return testHttp.get(urlInfo, formFailRate, loadSupportsDraft, token) as StrictHttpResponse<DraftSupports>;
}

const saveSupportDraft = (token: any, referenceNumber: any, data: any) => {
  let urlInfo = { url: `${urls.submit.url}/${referenceNumber}/Supports/draft`, name: "Supoprt draft" };

  let objectOrder = {
    '$type': null,
  };
  let payload: any[] = [];
  data.items.forEach((item: any) => {
    payload.push(Object.assign(objectOrder, item));
  });

  return testHttp.post(urlInfo, payload, formFailRate, submitSupportsDraft, token);
}

const saveSupports = (token: any, referenceNumber: any, supports: any, profile: any) => {
  let urlInfo = { url: `${urls.submit.url}/${referenceNumber}/Supports`, name: "Supoprt draft" };

  let objectOrder = {
    '$type': null,
  };
  let orderedSupports: any[] = [];
  supports.forEach((support: any) => {
    orderedSupports.push(Object.assign(objectOrder, support));
  });

  let data: SubmitSupportsRequest = {
    evacuationFileId: referenceNumber,
    supports: orderedSupports,
    eTransferDetails: {
      recipientName: `${profile.personalDetails.firstName} ${profile.personalDetails.lastName}`,
      eTransferEmail: profile.contactDetails.email
    }
  };
  return testHttp.post(urlInfo, data, formFailRate, submitSupports, token);
}

const optOut = (token: any, referenceNumber: any) => {
  let urlInfo = { url: `${urls.submit.url}/${referenceNumber}/Supports/optout`, name: "Supoprt draft" };
  return testHttp.post(urlInfo, {}, formFailRate, submitSupportsDraft, token);
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
  let selfServe = true;
  navigate();
  getStartPage();

  /**Load Meta Data */
  getConfiguration();
  let communities = getCommunities();
  getProvinces();
  getCountries();
  getSecurityQuestions();
  getOpenIdConfiguration();
  getEnumCodes("SupportStatus");
  getEnumCodes("SupportCategory");
  getEnumCodes("SupportSubCategory");
  /**End Load Meta Data */

  navigate(); //Login
  let token = getAuthToken();
  //Technically the portal loads all that meta data again when you are returned to the portal page after the login page
  // console.log(token);
  let profile_exists = getCurrentProfileExists(token);
  navigate();

  if (profile_exists == false) {
    //New Profile
    console.log(`Registrants - ${getIterationName()}: creating new profile`)
    let security_questions = getSecurityQuestions();
    fillInForm();
    createProfile(token, communities, security_questions, selfServe);
  }
  else {
    console.log(`Registrants - ${getIterationName()}: using existing profile`);
    let conflicts = getConflicts(token);
    if (conflicts && conflicts.length) {
      console.log(`Registrants - ${getIterationName()}: conflicts:`);
      console.log(conflicts);
      navigate();
    }
    //should update current profile???...
  }

  let profile = getCurrentProfile(token);
  getCurrentEvacuations(token);
  fillInForm();

  let fileRef = submitEvacuationFile(token, profile, communities, selfServe);
  console.log(fileRef)
  let eligibility = getIsEligible(token, fileRef.referenceNumber);
  if (eligibility && eligibility.isEligable) {
    console.log(`Registrants - ${getIterationName()}: Eligible for self serve!`);
    let should_opt_out = false;
    if (should_opt_out) {
      optOut(token, fileRef.referenceNumber);
    }
    else {
      let supportInfo = getSupportDraft(token, fileRef.referenceNumber);
      navigate();
      let supports = saveSupportDraft(token, fileRef.referenceNumber, supportInfo);
      saveSupports(token, fileRef.referenceNumber, supports, profile);
      console.log(`Registrants - ${getIterationName()}: Self serve complete!`);
    }
  }
  else {
    console.log(`Registrants - ${getIterationName()}: Not eligible for self serve`);
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