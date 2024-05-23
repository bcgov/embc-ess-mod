/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AuditAccessRequest } from '../models/audit-access-request';
import { EvacuationFile } from '../models/evacuation-file';
import { EvacuationFileSearchResult } from '../models/evacuation-file-search-result';
import { EvacuationFileSummary } from '../models/evacuation-file-summary';
import { GetSecurityPhraseResponse } from '../models/get-security-phrase-response';
import { GetSecurityQuestionsResponse } from '../models/get-security-questions-response';
import { ReferralPrintRequestResponse } from '../models/referral-print-request-response';
import { RegistrantProfile } from '../models/registrant-profile';
import { RegistrantProfileSearchResult } from '../models/registrant-profile-search-result';
import { RegistrationResult } from '../models/registration-result';
import { registrationsAuditFileAcccess } from '../fn/registrations/registrations-audit-file-acccess';
import { RegistrationsAuditFileAcccess$Params } from '../fn/registrations/registrations-audit-file-acccess';
import { registrationsAuditRegistrantAccess } from '../fn/registrations/registrations-audit-registrant-access';
import { RegistrationsAuditRegistrantAccess$Params } from '../fn/registrations/registrations-audit-registrant-access';
import { registrationsCancelSupport } from '../fn/registrations/registrations-cancel-support';
import { RegistrationsCancelSupport$Params } from '../fn/registrations/registrations-cancel-support';
import { registrationsCreateFile } from '../fn/registrations/registrations-create-file';
import { RegistrationsCreateFile$Params } from '../fn/registrations/registrations-create-file';
import { registrationsCreateFileNote } from '../fn/registrations/registrations-create-file-note';
import { RegistrationsCreateFileNote$Params } from '../fn/registrations/registrations-create-file-note';
import { registrationsCreateRegistrantProfile } from '../fn/registrations/registrations-create-registrant-profile';
import { RegistrationsCreateRegistrantProfile$Params } from '../fn/registrations/registrations-create-registrant-profile';
import { registrationsGetFile } from '../fn/registrations/registrations-get-file';
import { RegistrationsGetFile$Params } from '../fn/registrations/registrations-get-file';
import { registrationsGetFiles } from '../fn/registrations/registrations-get-files';
import { RegistrationsGetFiles$Params } from '../fn/registrations/registrations-get-files';
import { registrationsGetPrint } from '../fn/registrations/registrations-get-print';
import { RegistrationsGetPrint$Params } from '../fn/registrations/registrations-get-print';
import { registrationsGetRegistrantProfile } from '../fn/registrations/registrations-get-registrant-profile';
import { RegistrationsGetRegistrantProfile$Params } from '../fn/registrations/registrations-get-registrant-profile';
import { registrationsGetSecurityPhrase } from '../fn/registrations/registrations-get-security-phrase';
import { RegistrationsGetSecurityPhrase$Params } from '../fn/registrations/registrations-get-security-phrase';
import { registrationsGetSecurityQuestions } from '../fn/registrations/registrations-get-security-questions';
import { RegistrationsGetSecurityQuestions$Params } from '../fn/registrations/registrations-get-security-questions';
import { registrationsInviteToRegistrantPortal } from '../fn/registrations/registrations-invite-to-registrant-portal';
import { RegistrationsInviteToRegistrantPortal$Params } from '../fn/registrations/registrations-invite-to-registrant-portal';
import { registrationsLinkRegistrantToHouseholdMember } from '../fn/registrations/registrations-link-registrant-to-household-member';
import { RegistrationsLinkRegistrantToHouseholdMember$Params } from '../fn/registrations/registrations-link-registrant-to-household-member';
import { registrationsProcessPaperReferrals } from '../fn/registrations/registrations-process-paper-referrals';
import { RegistrationsProcessPaperReferrals$Params } from '../fn/registrations/registrations-process-paper-referrals';
import { registrationsProcessSupports } from '../fn/registrations/registrations-process-supports';
import { RegistrationsProcessSupports$Params } from '../fn/registrations/registrations-process-supports';
import { registrationsReprintSupport } from '../fn/registrations/registrations-reprint-support';
import { RegistrationsReprintSupport$Params } from '../fn/registrations/registrations-reprint-support';
import { registrationsSearch } from '../fn/registrations/registrations-search';
import { RegistrationsSearch$Params } from '../fn/registrations/registrations-search';
import { registrationsSearchMatchingEvacuationFiles } from '../fn/registrations/registrations-search-matching-evacuation-files';
import { RegistrationsSearchMatchingEvacuationFiles$Params } from '../fn/registrations/registrations-search-matching-evacuation-files';
import { registrationsSearchMatchingRegistrants } from '../fn/registrations/registrations-search-matching-registrants';
import { RegistrationsSearchMatchingRegistrants$Params } from '../fn/registrations/registrations-search-matching-registrants';
import { registrationsSearchSupports } from '../fn/registrations/registrations-search-supports';
import { RegistrationsSearchSupports$Params } from '../fn/registrations/registrations-search-supports';
import { registrationsSetFileNoteHiddenStatus } from '../fn/registrations/registrations-set-file-note-hidden-status';
import { RegistrationsSetFileNoteHiddenStatus$Params } from '../fn/registrations/registrations-set-file-note-hidden-status';
import { registrationsSetRegistrantVerified } from '../fn/registrations/registrations-set-registrant-verified';
import { RegistrationsSetRegistrantVerified$Params } from '../fn/registrations/registrations-set-registrant-verified';
import { registrationsUpdateFile } from '../fn/registrations/registrations-update-file';
import { RegistrationsUpdateFile$Params } from '../fn/registrations/registrations-update-file';
import { registrationsUpdateFileNoteContent } from '../fn/registrations/registrations-update-file-note-content';
import { RegistrationsUpdateFileNoteContent$Params } from '../fn/registrations/registrations-update-file-note-content';
import { registrationsUpdateRegistrantProfile } from '../fn/registrations/registrations-update-registrant-profile';
import { RegistrationsUpdateRegistrantProfile$Params } from '../fn/registrations/registrations-update-registrant-profile';
import { registrationsVerifySecurityPhrase } from '../fn/registrations/registrations-verify-security-phrase';
import { RegistrationsVerifySecurityPhrase$Params } from '../fn/registrations/registrations-verify-security-phrase';
import { registrationsVerifySecurityQuestions } from '../fn/registrations/registrations-verify-security-questions';
import { RegistrationsVerifySecurityQuestions$Params } from '../fn/registrations/registrations-verify-security-questions';
import { registrationsVoidSupport } from '../fn/registrations/registrations-void-support';
import { RegistrationsVoidSupport$Params } from '../fn/registrations/registrations-void-support';
import { SearchResults } from '../models/search-results';
import { Support } from '../models/support';
import { VerifySecurityPhraseResponse } from '../models/verify-security-phrase-response';
import { VerifySecurityQuestionsResponse } from '../models/verify-security-questions-response';

@Injectable({ providedIn: 'root' })
export class RegistrationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `registrationsGetRegistrantProfile()` */
  static readonly RegistrationsGetRegistrantProfilePath = '/api/Registrations/registrants/{registrantId}';

  /**
   * Gets a Registrant Profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetRegistrantProfile()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetRegistrantProfile$Response(
    params: RegistrationsGetRegistrantProfile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrantProfile>> {
    return registrationsGetRegistrantProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * Gets a Registrant Profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsGetRegistrantProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetRegistrantProfile(
    params: RegistrationsGetRegistrantProfile$Params,
    context?: HttpContext
  ): Observable<RegistrantProfile> {
    return this.registrationsGetRegistrantProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrantProfile>): RegistrantProfile => r.body)
    );
  }

  /** Path part for operation `registrationsUpdateRegistrantProfile()` */
  static readonly RegistrationsUpdateRegistrantProfilePath = '/api/Registrations/registrants/{registrantId}';

  /**
   * Updates a Registrant Profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsUpdateRegistrantProfile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateRegistrantProfile$Response(
    params: RegistrationsUpdateRegistrantProfile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsUpdateRegistrantProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * Updates a Registrant Profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsUpdateRegistrantProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateRegistrantProfile(
    params: RegistrationsUpdateRegistrantProfile$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsUpdateRegistrantProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsCreateRegistrantProfile()` */
  static readonly RegistrationsCreateRegistrantProfilePath = '/api/Registrations/registrants';

  /**
   * Creates a Registrant Profile.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsCreateRegistrantProfile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateRegistrantProfile$Response(
    params: RegistrationsCreateRegistrantProfile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsCreateRegistrantProfile(this.http, this.rootUrl, params, context);
  }

  /**
   * Creates a Registrant Profile.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsCreateRegistrantProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateRegistrantProfile(
    params: RegistrationsCreateRegistrantProfile$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsCreateRegistrantProfile$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsSetRegistrantVerified()` */
  static readonly RegistrationsSetRegistrantVerifiedPath =
    '/api/Registrations/registrants/{registrantId}/verified/{verified}';

  /**
   * Sets the Registrant Profile Verified flag to the supplied value.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSetRegistrantVerified()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSetRegistrantVerified$Response(
    params: RegistrationsSetRegistrantVerified$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsSetRegistrantVerified(this.http, this.rootUrl, params, context);
  }

  /**
   * Sets the Registrant Profile Verified flag to the supplied value.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsSetRegistrantVerified$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSetRegistrantVerified(
    params: RegistrationsSetRegistrantVerified$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsSetRegistrantVerified$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsGetSecurityQuestions()` */
  static readonly RegistrationsGetSecurityQuestionsPath = '/api/Registrations/registrants/{registrantId}/security';

  /**
   * Get security questions for a registrant.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetSecurityQuestions()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityQuestions$Response(
    params: RegistrationsGetSecurityQuestions$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<GetSecurityQuestionsResponse>> {
    return registrationsGetSecurityQuestions(this.http, this.rootUrl, params, context);
  }

  /**
   * Get security questions for a registrant.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsGetSecurityQuestions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityQuestions(
    params: RegistrationsGetSecurityQuestions$Params,
    context?: HttpContext
  ): Observable<GetSecurityQuestionsResponse> {
    return this.registrationsGetSecurityQuestions$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetSecurityQuestionsResponse>): GetSecurityQuestionsResponse => r.body)
    );
  }

  /** Path part for operation `registrationsVerifySecurityQuestions()` */
  static readonly RegistrationsVerifySecurityQuestionsPath = '/api/Registrations/registrants/{registrantId}/security';

  /**
   * verify answers for security questions.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsVerifySecurityQuestions()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityQuestions$Response(
    params: RegistrationsVerifySecurityQuestions$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<VerifySecurityQuestionsResponse>> {
    return registrationsVerifySecurityQuestions(this.http, this.rootUrl, params, context);
  }

  /**
   * verify answers for security questions.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsVerifySecurityQuestions$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityQuestions(
    params: RegistrationsVerifySecurityQuestions$Params,
    context?: HttpContext
  ): Observable<VerifySecurityQuestionsResponse> {
    return this.registrationsVerifySecurityQuestions$Response(params, context).pipe(
      map((r: StrictHttpResponse<VerifySecurityQuestionsResponse>): VerifySecurityQuestionsResponse => r.body)
    );
  }

  /** Path part for operation `registrationsInviteToRegistrantPortal()` */
  static readonly RegistrationsInviteToRegistrantPortalPath = '/api/Registrations/registrants/{registrantId}/invite';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsInviteToRegistrantPortal()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsInviteToRegistrantPortal$Response(
    params: RegistrationsInviteToRegistrantPortal$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return registrationsInviteToRegistrantPortal(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsInviteToRegistrantPortal$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsInviteToRegistrantPortal(
    params: RegistrationsInviteToRegistrantPortal$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.registrationsInviteToRegistrantPortal$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `registrationsAuditRegistrantAccess()` */
  static readonly RegistrationsAuditRegistrantAccessPath = '/api/Registrations/registrants/{registrantId}/access';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsAuditRegistrantAccess()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsAuditRegistrantAccess$Response(
    params: RegistrationsAuditRegistrantAccess$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return registrationsAuditRegistrantAccess(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsAuditRegistrantAccess$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsAuditRegistrantAccess(
    params: RegistrationsAuditRegistrantAccess$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.registrationsAuditRegistrantAccess$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `registrationsGetFile()` */
  static readonly RegistrationsGetFilePath = '/api/Registrations/files/{fileId}';

  /**
   * Gets a File.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetFile()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetFile$Response(
    params: RegistrationsGetFile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<EvacuationFile>> {
    return registrationsGetFile(this.http, this.rootUrl, params, context);
  }

  /**
   * Gets a File.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsGetFile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetFile(params: RegistrationsGetFile$Params, context?: HttpContext): Observable<EvacuationFile> {
    return this.registrationsGetFile$Response(params, context).pipe(
      map((r: StrictHttpResponse<EvacuationFile>): EvacuationFile => r.body)
    );
  }

  /** Path part for operation `registrationsUpdateFile()` */
  static readonly RegistrationsUpdateFilePath = '/api/Registrations/files/{fileId}';

  /**
   * Updates a File.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsUpdateFile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateFile$Response(
    params: RegistrationsUpdateFile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsUpdateFile(this.http, this.rootUrl, params, context);
  }

  /**
   * Updates a File.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsUpdateFile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateFile(
    params: RegistrationsUpdateFile$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsUpdateFile$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsGetFiles()` */
  static readonly RegistrationsGetFilesPath = '/api/Registrations/files';

  /**
   * Search files.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetFiles()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetFiles$Response(
    params?: RegistrationsGetFiles$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<EvacuationFileSummary>>> {
    return registrationsGetFiles(this.http, this.rootUrl, params, context);
  }

  /**
   * Search files.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsGetFiles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetFiles(
    params?: RegistrationsGetFiles$Params,
    context?: HttpContext
  ): Observable<Array<EvacuationFileSummary>> {
    return this.registrationsGetFiles$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFileSummary>>): Array<EvacuationFileSummary> => r.body)
    );
  }

  /** Path part for operation `registrationsCreateFile()` */
  static readonly RegistrationsCreateFilePath = '/api/Registrations/files';

  /**
   * Creates a File.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsCreateFile()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateFile$Response(
    params: RegistrationsCreateFile$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsCreateFile(this.http, this.rootUrl, params, context);
  }

  /**
   * Creates a File.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsCreateFile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateFile(
    params: RegistrationsCreateFile$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsCreateFile$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsCreateFileNote()` */
  static readonly RegistrationsCreateFileNotePath = '/api/Registrations/files/{fileId}/notes';

  /**
   * Create a File Note.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsCreateFileNote()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateFileNote$Response(
    params: RegistrationsCreateFileNote$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsCreateFileNote(this.http, this.rootUrl, params, context);
  }

  /**
   * Create a File Note.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsCreateFileNote$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateFileNote(
    params: RegistrationsCreateFileNote$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsCreateFileNote$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsUpdateFileNoteContent()` */
  static readonly RegistrationsUpdateFileNoteContentPath = '/api/Registrations/files/{fileId}/notes/{noteId}';

  /**
   * Updates a File Note's content.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsUpdateFileNoteContent()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateFileNoteContent$Response(
    params: RegistrationsUpdateFileNoteContent$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsUpdateFileNoteContent(this.http, this.rootUrl, params, context);
  }

  /**
   * Updates a File Note's content.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsUpdateFileNoteContent$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateFileNoteContent(
    params: RegistrationsUpdateFileNoteContent$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsUpdateFileNoteContent$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsSetFileNoteHiddenStatus()` */
  static readonly RegistrationsSetFileNoteHiddenStatusPath = '/api/Registrations/files/{fileId}/notes/{noteId}/hidden';

  /**
   * Sets a File Note's isHidden field.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSetFileNoteHiddenStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSetFileNoteHiddenStatus$Response(
    params: RegistrationsSetFileNoteHiddenStatus$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<RegistrationResult>> {
    return registrationsSetFileNoteHiddenStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * Sets a File Note's isHidden field.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsSetFileNoteHiddenStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSetFileNoteHiddenStatus(
    params: RegistrationsSetFileNoteHiddenStatus$Params,
    context?: HttpContext
  ): Observable<RegistrationResult> {
    return this.registrationsSetFileNoteHiddenStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<RegistrationResult>): RegistrationResult => r.body)
    );
  }

  /** Path part for operation `registrationsGetSecurityPhrase()` */
  static readonly RegistrationsGetSecurityPhrasePath = '/api/Registrations/files/{fileId}/security';

  /**
   * get the security word of an evacuation file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetSecurityPhrase()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityPhrase$Response(
    params: RegistrationsGetSecurityPhrase$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<GetSecurityPhraseResponse>> {
    return registrationsGetSecurityPhrase(this.http, this.rootUrl, params, context);
  }

  /**
   * get the security word of an evacuation file.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsGetSecurityPhrase$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityPhrase(
    params: RegistrationsGetSecurityPhrase$Params,
    context?: HttpContext
  ): Observable<GetSecurityPhraseResponse> {
    return this.registrationsGetSecurityPhrase$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetSecurityPhraseResponse>): GetSecurityPhraseResponse => r.body)
    );
  }

  /** Path part for operation `registrationsVerifySecurityPhrase()` */
  static readonly RegistrationsVerifySecurityPhrasePath = '/api/Registrations/files/{fileId}/security';

  /**
   * verify an evacuation file's security word.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsVerifySecurityPhrase()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityPhrase$Response(
    params: RegistrationsVerifySecurityPhrase$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<VerifySecurityPhraseResponse>> {
    return registrationsVerifySecurityPhrase(this.http, this.rootUrl, params, context);
  }

  /**
   * verify an evacuation file's security word.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsVerifySecurityPhrase$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityPhrase(
    params: RegistrationsVerifySecurityPhrase$Params,
    context?: HttpContext
  ): Observable<VerifySecurityPhraseResponse> {
    return this.registrationsVerifySecurityPhrase$Response(params, context).pipe(
      map((r: StrictHttpResponse<VerifySecurityPhraseResponse>): VerifySecurityPhraseResponse => r.body)
    );
  }

  /** Path part for operation `registrationsLinkRegistrantToHouseholdMember()` */
  static readonly RegistrationsLinkRegistrantToHouseholdMemberPath = '/api/Registrations/files/{fileId}/link';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsLinkRegistrantToHouseholdMember()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsLinkRegistrantToHouseholdMember$Response(
    params: RegistrationsLinkRegistrantToHouseholdMember$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<string>> {
    return registrationsLinkRegistrantToHouseholdMember(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsLinkRegistrantToHouseholdMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsLinkRegistrantToHouseholdMember(
    params: RegistrationsLinkRegistrantToHouseholdMember$Params,
    context?: HttpContext
  ): Observable<string> {
    return this.registrationsLinkRegistrantToHouseholdMember$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `registrationsAuditFileAcccess()` */
  static readonly RegistrationsAuditFileAcccessPath = '/api/Registrations/files/{fileId}/access';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsAuditFileAcccess()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsAuditFileAcccess$Response(
    params: RegistrationsAuditFileAcccess$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return registrationsAuditFileAcccess(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsAuditFileAcccess$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsAuditFileAcccess(params: RegistrationsAuditFileAcccess$Params, context?: HttpContext): Observable<void> {
    return this.registrationsAuditFileAcccess$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `registrationsSearch()` */
  static readonly RegistrationsSearchPath = '/api/Registrations';

  /**
   * Search evacuation files and profiles matching the search parameters.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSearch()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearch$Response(
    params?: RegistrationsSearch$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<SearchResults>> {
    return registrationsSearch(this.http, this.rootUrl, params, context);
  }

  /**
   * Search evacuation files and profiles matching the search parameters.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsSearch$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearch(params?: RegistrationsSearch$Params, context?: HttpContext): Observable<SearchResults> {
    return this.registrationsSearch$Response(params, context).pipe(
      map((r: StrictHttpResponse<SearchResults>): SearchResults => r.body)
    );
  }

  /** Path part for operation `registrationsSearchMatchingRegistrants()` */
  static readonly RegistrationsSearchMatchingRegistrantsPath = '/api/Registrations/registrants/matches';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSearchMatchingRegistrants()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingRegistrants$Response(
    params?: RegistrationsSearchMatchingRegistrants$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<RegistrantProfileSearchResult>>> {
    return registrationsSearchMatchingRegistrants(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsSearchMatchingRegistrants$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingRegistrants(
    params?: RegistrationsSearchMatchingRegistrants$Params,
    context?: HttpContext
  ): Observable<Array<RegistrantProfileSearchResult>> {
    return this.registrationsSearchMatchingRegistrants$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<RegistrantProfileSearchResult>>): Array<RegistrantProfileSearchResult> => r.body)
    );
  }

  /** Path part for operation `registrationsSearchMatchingEvacuationFiles()` */
  static readonly RegistrationsSearchMatchingEvacuationFilesPath = '/api/Registrations/files/matches';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSearchMatchingEvacuationFiles()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingEvacuationFiles$Response(
    params?: RegistrationsSearchMatchingEvacuationFiles$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<EvacuationFileSearchResult>>> {
    return registrationsSearchMatchingEvacuationFiles(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsSearchMatchingEvacuationFiles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingEvacuationFiles(
    params?: RegistrationsSearchMatchingEvacuationFiles$Params,
    context?: HttpContext
  ): Observable<Array<EvacuationFileSearchResult>> {
    return this.registrationsSearchMatchingEvacuationFiles$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFileSearchResult>>): Array<EvacuationFileSearchResult> => r.body)
    );
  }

  /** Path part for operation `registrationsProcessSupports()` */
  static readonly RegistrationsProcessSupportsPath = '/api/Registrations/files/{fileId}/supports';

  /**
   * Process  digital draft supports by the API and create a print supports request.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsProcessSupports()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsProcessSupports$Response(
    params: RegistrationsProcessSupports$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ReferralPrintRequestResponse>> {
    return registrationsProcessSupports(this.http, this.rootUrl, params, context);
  }

  /**
   * Process  digital draft supports by the API and create a print supports request.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsProcessSupports$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsProcessSupports(
    params: RegistrationsProcessSupports$Params,
    context?: HttpContext
  ): Observable<ReferralPrintRequestResponse> {
    return this.registrationsProcessSupports$Response(params, context).pipe(
      map((r: StrictHttpResponse<ReferralPrintRequestResponse>): ReferralPrintRequestResponse => r.body)
    );
  }

  /** Path part for operation `registrationsProcessPaperReferrals()` */
  static readonly RegistrationsProcessPaperReferralsPath = '/api/Registrations/files/{fileId}/paperreferrals';

  /**
   * Process draft paper referrals by the API and create a print supports request.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsProcessPaperReferrals()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsProcessPaperReferrals$Response(
    params: RegistrationsProcessPaperReferrals$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return registrationsProcessPaperReferrals(this.http, this.rootUrl, params, context);
  }

  /**
   * Process draft paper referrals by the API and create a print supports request.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsProcessPaperReferrals$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsProcessPaperReferrals(
    params: RegistrationsProcessPaperReferrals$Params,
    context?: HttpContext
  ): Observable<void> {
    return this.registrationsProcessPaperReferrals$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `registrationsVoidSupport()` */
  static readonly RegistrationsVoidSupportPath = '/api/Registrations/files/{fileId}/supports/{supportId}/void';

  /**
   * Void a support.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsVoidSupport()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsVoidSupport$Response(
    params: RegistrationsVoidSupport$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return registrationsVoidSupport(this.http, this.rootUrl, params, context);
  }

  /**
   * Void a support.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsVoidSupport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsVoidSupport(params: RegistrationsVoidSupport$Params, context?: HttpContext): Observable<void> {
    return this.registrationsVoidSupport$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `registrationsCancelSupport()` */
  static readonly RegistrationsCancelSupportPath = '/api/Registrations/files/{fileId}/supports/{supportId}/cancel';

  /**
   * Cancel a support.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsCancelSupport()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsCancelSupport$Response(
    params: RegistrationsCancelSupport$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<void>> {
    return registrationsCancelSupport(this.http, this.rootUrl, params, context);
  }

  /**
   * Cancel a support.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsCancelSupport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsCancelSupport(params: RegistrationsCancelSupport$Params, context?: HttpContext): Observable<void> {
    return this.registrationsCancelSupport$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `registrationsReprintSupport()` */
  static readonly RegistrationsReprintSupportPath = '/api/Registrations/files/{fileId}/supports/{supportId}/reprint';

  /**
   * Reprint a referral support.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsReprintSupport()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsReprintSupport$Response(
    params: RegistrationsReprintSupport$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<ReferralPrintRequestResponse>> {
    return registrationsReprintSupport(this.http, this.rootUrl, params, context);
  }

  /**
   * Reprint a referral support.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsReprintSupport$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsReprintSupport(
    params: RegistrationsReprintSupport$Params,
    context?: HttpContext
  ): Observable<ReferralPrintRequestResponse> {
    return this.registrationsReprintSupport$Response(params, context).pipe(
      map((r: StrictHttpResponse<ReferralPrintRequestResponse>): ReferralPrintRequestResponse => r.body)
    );
  }

  /** Path part for operation `registrationsGetPrint()` */
  static readonly RegistrationsGetPrintPath = '/api/Registrations/files/{fileId}/supports/print/{printRequestId}';

  /**
   * Request a print by id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetPrint()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetPrint$Response(
    params: RegistrationsGetPrint$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Blob>> {
    return registrationsGetPrint(this.http, this.rootUrl, params, context);
  }

  /**
   * Request a print by id.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsGetPrint$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetPrint(params: RegistrationsGetPrint$Params, context?: HttpContext): Observable<Blob> {
    return this.registrationsGetPrint$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `registrationsSearchSupports()` */
  static readonly RegistrationsSearchSupportsPath = '/api/Registrations/supports';

  /**
   * Search for supports.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSearchSupports()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchSupports$Response(
    params?: RegistrationsSearchSupports$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<Support>>> {
    return registrationsSearchSupports(this.http, this.rootUrl, params, context);
  }

  /**
   * Search for supports.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `registrationsSearchSupports$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchSupports(
    params?: RegistrationsSearchSupports$Params,
    context?: HttpContext
  ): Observable<Array<Support>> {
    return this.registrationsSearchSupports$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Support>>): Array<Support> => r.body)
    );
  }
}
