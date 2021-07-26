/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { EvacuationFile } from '../models/evacuation-file';
import { EvacuationFileSearchResult } from '../models/evacuation-file-search-result';
import { EvacuationFileSummary } from '../models/evacuation-file-summary';
import { GetSecurityPhraseResponse } from '../models/get-security-phrase-response';
import { GetSecurityQuestionsResponse } from '../models/get-security-questions-response';
import { Note } from '../models/note';
import { RegistrantLinkRequest } from '../models/registrant-link-request';
import { RegistrantProfile } from '../models/registrant-profile';
import { RegistrationResult } from '../models/registration-result';
import { SearchResults } from '../models/search-results';
import { VerifySecurityPhraseRequest } from '../models/verify-security-phrase-request';
import { VerifySecurityPhraseResponse } from '../models/verify-security-phrase-response';
import { VerifySecurityQuestionsRequest } from '../models/verify-security-questions-request';
import { VerifySecurityQuestionsResponse } from '../models/verify-security-questions-response';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation registrationsGetRegistrantProfile
   */
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
  registrationsGetRegistrantProfile$Response(params: {

    /**
     * RegistrantId
     */
    registrantId: string;
  }): Observable<StrictHttpResponse<RegistrantProfile>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsGetRegistrantProfilePath, 'get');
    if (params) {
      rb.path('registrantId', params.registrantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrantProfile>;
      })
    );
  }

  /**
   * Gets a Registrant Profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsGetRegistrantProfile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetRegistrantProfile(params: {

    /**
     * RegistrantId
     */
    registrantId: string;
  }): Observable<RegistrantProfile> {

    return this.registrationsGetRegistrantProfile$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrantProfile>) => r.body as RegistrantProfile)
    );
  }

  /**
   * Path part for operation registrationsUpdateRegistrantProfile
   */
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
  registrationsUpdateRegistrantProfile$Response(params: {

    /**
     * RegistrantId
     */
    registrantId: string;

    /**
     * Registrant
     */
    body: RegistrantProfile
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsUpdateRegistrantProfilePath, 'post');
    if (params) {
      rb.path('registrantId', params.registrantId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Updates a Registrant Profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsUpdateRegistrantProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateRegistrantProfile(params: {

    /**
     * RegistrantId
     */
    registrantId: string;

    /**
     * Registrant
     */
    body: RegistrantProfile
  }): Observable<RegistrationResult> {

    return this.registrationsUpdateRegistrantProfile$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsCreateRegistrantProfile
   */
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
  registrationsCreateRegistrantProfile$Response(params: {

    /**
     * Registrant
     */
    body: RegistrantProfile
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsCreateRegistrantProfilePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Creates a Registrant Profile.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsCreateRegistrantProfile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateRegistrantProfile(params: {

    /**
     * Registrant
     */
    body: RegistrantProfile
  }): Observable<RegistrationResult> {

    return this.registrationsCreateRegistrantProfile$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsSetRegistrantVerified
   */
  static readonly RegistrationsSetRegistrantVerifiedPath = '/api/Registrations/registrants/{registrantId}/verified/{verified}';

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
  registrationsSetRegistrantVerified$Response(params: {

    /**
     * RegistrantId
     */
    registrantId: string;

    /**
     * Verified
     */
    verified: boolean;
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsSetRegistrantVerifiedPath, 'post');
    if (params) {
      rb.path('registrantId', params.registrantId, {});
      rb.path('verified', params.verified, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Sets the Registrant Profile Verified flag to the supplied value.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsSetRegistrantVerified$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSetRegistrantVerified(params: {

    /**
     * RegistrantId
     */
    registrantId: string;

    /**
     * Verified
     */
    verified: boolean;
  }): Observable<RegistrationResult> {

    return this.registrationsSetRegistrantVerified$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsGetSecurityQuestions
   */
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
  registrationsGetSecurityQuestions$Response(params: {

    /**
     * registrant id
     */
    registrantId: string;
  }): Observable<StrictHttpResponse<GetSecurityQuestionsResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsGetSecurityQuestionsPath, 'get');
    if (params) {
      rb.path('registrantId', params.registrantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetSecurityQuestionsResponse>;
      })
    );
  }

  /**
   * Get security questions for a registrant.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsGetSecurityQuestions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityQuestions(params: {

    /**
     * registrant id
     */
    registrantId: string;
  }): Observable<GetSecurityQuestionsResponse> {

    return this.registrationsGetSecurityQuestions$Response(params).pipe(
      map((r: StrictHttpResponse<GetSecurityQuestionsResponse>) => r.body as GetSecurityQuestionsResponse)
    );
  }

  /**
   * Path part for operation registrationsVerifySecurityQuestions
   */
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
  registrationsVerifySecurityQuestions$Response(params: {

    /**
     * registrant id
     */
    registrantId: string;

    /**
     * array of questions and their answers
     */
    body: VerifySecurityQuestionsRequest
  }): Observable<StrictHttpResponse<VerifySecurityQuestionsResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsVerifySecurityQuestionsPath, 'post');
    if (params) {
      rb.path('registrantId', params.registrantId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VerifySecurityQuestionsResponse>;
      })
    );
  }

  /**
   * verify answers for security questions.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsVerifySecurityQuestions$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityQuestions(params: {

    /**
     * registrant id
     */
    registrantId: string;

    /**
     * array of questions and their answers
     */
    body: VerifySecurityQuestionsRequest
  }): Observable<VerifySecurityQuestionsResponse> {

    return this.registrationsVerifySecurityQuestions$Response(params).pipe(
      map((r: StrictHttpResponse<VerifySecurityQuestionsResponse>) => r.body as VerifySecurityQuestionsResponse)
    );
  }

  /**
   * Path part for operation registrationsGetFile
   */
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
  registrationsGetFile$Response(params: {

    /**
     * fileId
     */
    fileId: string;
  }): Observable<StrictHttpResponse<EvacuationFile>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsGetFilePath, 'get');
    if (params) {
      rb.path('fileId', params.fileId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EvacuationFile>;
      })
    );
  }

  /**
   * Gets a File.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsGetFile$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetFile(params: {

    /**
     * fileId
     */
    fileId: string;
  }): Observable<EvacuationFile> {

    return this.registrationsGetFile$Response(params).pipe(
      map((r: StrictHttpResponse<EvacuationFile>) => r.body as EvacuationFile)
    );
  }

  /**
   * Path part for operation registrationsUpdateFile
   */
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
  registrationsUpdateFile$Response(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * file
     */
    body: EvacuationFile
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsUpdateFilePath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Updates a File.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsUpdateFile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateFile(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * file
     */
    body: EvacuationFile
  }): Observable<RegistrationResult> {

    return this.registrationsUpdateFile$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsGetFiles
   */
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
  registrationsGetFiles$Response(params?: {

    /**
     * fileId
     */
    registrantId?: string;
  }): Observable<StrictHttpResponse<Array<EvacuationFileSummary>>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsGetFilesPath, 'get');
    if (params) {
      rb.query('registrantId', params.registrantId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<EvacuationFileSummary>>;
      })
    );
  }

  /**
   * Search files.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsGetFiles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetFiles(params?: {

    /**
     * fileId
     */
    registrantId?: string;
  }): Observable<Array<EvacuationFileSummary>> {

    return this.registrationsGetFiles$Response(params).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFileSummary>>) => r.body as Array<EvacuationFileSummary>)
    );
  }

  /**
   * Path part for operation registrationsCreateFile
   */
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
  registrationsCreateFile$Response(params: {

    /**
     * file
     */
    body: EvacuationFile
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsCreateFilePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Creates a File.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsCreateFile$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateFile(params: {

    /**
     * file
     */
    body: EvacuationFile
  }): Observable<RegistrationResult> {

    return this.registrationsCreateFile$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsCreateFileNote
   */
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
  registrationsCreateFileNote$Response(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * note
     */
    body: Note
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsCreateFileNotePath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Create a File Note.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsCreateFileNote$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsCreateFileNote(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * note
     */
    body: Note
  }): Observable<RegistrationResult> {

    return this.registrationsCreateFileNote$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsUpdateFileNoteContent
   */
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
  registrationsUpdateFileNoteContent$Response(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * noteId
     */
    noteId: string;

    /**
     * note
     */
    body: Note
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsUpdateFileNoteContentPath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.path('noteId', params.noteId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Updates a File Note's content.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsUpdateFileNoteContent$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsUpdateFileNoteContent(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * noteId
     */
    noteId: string;

    /**
     * note
     */
    body: Note
  }): Observable<RegistrationResult> {

    return this.registrationsUpdateFileNoteContent$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsSetFileNoteHiddenStatus
   */
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
  registrationsSetFileNoteHiddenStatus$Response(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * noteId
     */
    noteId: string;

    /**
     * isHidden
     */
    isHidden?: boolean;
  }): Observable<StrictHttpResponse<RegistrationResult>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsSetFileNoteHiddenStatusPath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.path('noteId', params.noteId, {});
      rb.query('isHidden', params.isHidden, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RegistrationResult>;
      })
    );
  }

  /**
   * Sets a File Note's isHidden field.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsSetFileNoteHiddenStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSetFileNoteHiddenStatus(params: {

    /**
     * fileId
     */
    fileId: string;

    /**
     * noteId
     */
    noteId: string;

    /**
     * isHidden
     */
    isHidden?: boolean;
  }): Observable<RegistrationResult> {

    return this.registrationsSetFileNoteHiddenStatus$Response(params).pipe(
      map((r: StrictHttpResponse<RegistrationResult>) => r.body as RegistrationResult)
    );
  }

  /**
   * Path part for operation registrationsGetSecurityPhrase
   */
  static readonly RegistrationsGetSecurityPhrasePath = '/api/Registrations/files/{fileId}/security';

  /**
   * get the security phrase of an evacuation file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsGetSecurityPhrase()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityPhrase$Response(params: {

    /**
     * file id
     */
    fileId: string;
  }): Observable<StrictHttpResponse<GetSecurityPhraseResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsGetSecurityPhrasePath, 'get');
    if (params) {
      rb.path('fileId', params.fileId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetSecurityPhraseResponse>;
      })
    );
  }

  /**
   * get the security phrase of an evacuation file.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsGetSecurityPhrase$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsGetSecurityPhrase(params: {

    /**
     * file id
     */
    fileId: string;
  }): Observable<GetSecurityPhraseResponse> {

    return this.registrationsGetSecurityPhrase$Response(params).pipe(
      map((r: StrictHttpResponse<GetSecurityPhraseResponse>) => r.body as GetSecurityPhraseResponse)
    );
  }

  /**
   * Path part for operation registrationsVerifySecurityPhrase
   */
  static readonly RegistrationsVerifySecurityPhrasePath = '/api/Registrations/files/{fileId}/security';

  /**
   * verify an evacuation file's security phrase.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsVerifySecurityPhrase()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityPhrase$Response(params: {

    /**
     * file id
     */
    fileId: string;

    /**
     * security phrase to verify
     */
    body: VerifySecurityPhraseRequest
  }): Observable<StrictHttpResponse<VerifySecurityPhraseResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsVerifySecurityPhrasePath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VerifySecurityPhraseResponse>;
      })
    );
  }

  /**
   * verify an evacuation file's security phrase.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsVerifySecurityPhrase$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsVerifySecurityPhrase(params: {

    /**
     * file id
     */
    fileId: string;

    /**
     * security phrase to verify
     */
    body: VerifySecurityPhraseRequest
  }): Observable<VerifySecurityPhraseResponse> {

    return this.registrationsVerifySecurityPhrase$Response(params).pipe(
      map((r: StrictHttpResponse<VerifySecurityPhraseResponse>) => r.body as VerifySecurityPhraseResponse)
    );
  }

  /**
   * Path part for operation registrationsLinkRegistrantToHouseholdMember
   */
  static readonly RegistrationsLinkRegistrantToHouseholdMemberPath = '/api/Registrations/files/{fileId}/link';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsLinkRegistrantToHouseholdMember()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsLinkRegistrantToHouseholdMember$Response(params: {
    fileId: string;
    body: RegistrantLinkRequest
  }): Observable<StrictHttpResponse<Blob>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsLinkRegistrantToHouseholdMemberPath, 'post');
    if (params) {
      rb.path('fileId', params.fileId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: 'application/octet-stream'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Blob>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsLinkRegistrantToHouseholdMember$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrationsLinkRegistrantToHouseholdMember(params: {
    fileId: string;
    body: RegistrantLinkRequest
  }): Observable<Blob> {

    return this.registrationsLinkRegistrantToHouseholdMember$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Path part for operation registrationsSearch
   */
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
  registrationsSearch$Response(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<StrictHttpResponse<SearchResults>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsSearchPath, 'get');
    if (params) {
      rb.query('firstName', params.firstName, {});
      rb.query('lastName', params.lastName, {});
      rb.query('dateOfBirth', params.dateOfBirth, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SearchResults>;
      })
    );
  }

  /**
   * Search evacuation files and profiles matching the search parameters.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsSearch$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearch(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<SearchResults> {

    return this.registrationsSearch$Response(params).pipe(
      map((r: StrictHttpResponse<SearchResults>) => r.body as SearchResults)
    );
  }

  /**
   * Path part for operation registrationsSearchMatchingRegistrants
   */
  static readonly RegistrationsSearchMatchingRegistrantsPath = '/api/Registrations/registrants/matches';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSearchMatchingRegistrants()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingRegistrants$Response(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<StrictHttpResponse<Array<RegistrantProfile>>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsSearchMatchingRegistrantsPath, 'get');
    if (params) {
      rb.query('firstName', params.firstName, {});
      rb.query('lastName', params.lastName, {});
      rb.query('dateOfBirth', params.dateOfBirth, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<RegistrantProfile>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsSearchMatchingRegistrants$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingRegistrants(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<Array<RegistrantProfile>> {

    return this.registrationsSearchMatchingRegistrants$Response(params).pipe(
      map((r: StrictHttpResponse<Array<RegistrantProfile>>) => r.body as Array<RegistrantProfile>)
    );
  }

  /**
   * Path part for operation registrationsSearchMatchingEvacuationFiles
   */
  static readonly RegistrationsSearchMatchingEvacuationFilesPath = '/api/Registrations/files/matches';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrationsSearchMatchingEvacuationFiles()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingEvacuationFiles$Response(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<StrictHttpResponse<Array<EvacuationFileSearchResult>>> {

    const rb = new RequestBuilder(this.rootUrl, RegistrationsService.RegistrationsSearchMatchingEvacuationFilesPath, 'get');
    if (params) {
      rb.query('firstName', params.firstName, {});
      rb.query('lastName', params.lastName, {});
      rb.query('dateOfBirth', params.dateOfBirth, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<EvacuationFileSearchResult>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrationsSearchMatchingEvacuationFiles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  registrationsSearchMatchingEvacuationFiles(params?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }): Observable<Array<EvacuationFileSearchResult>> {

    return this.registrationsSearchMatchingEvacuationFiles$Response(params).pipe(
      map((r: StrictHttpResponse<Array<EvacuationFileSearchResult>>) => r.body as Array<EvacuationFileSearchResult>)
    );
  }

}
