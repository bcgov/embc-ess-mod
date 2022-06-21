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

import { EssTask } from '../models/ess-task';
import { SuppliersListItem } from '../models/suppliers-list-item';
import { TaskSignin } from '../models/task-signin';

@Injectable({
  providedIn: 'root',
})
export class TasksService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation tasksGetTask
   */
  static readonly TasksGetTaskPath = '/api/Tasks/{taskId}';

  /**
   * Get a single ESS task.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tasksGetTask()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetTask$Response(params: {

    /**
     * task number
     */
    taskId: string;
  }): Observable<StrictHttpResponse<EssTask>> {

    const rb = new RequestBuilder(this.rootUrl, TasksService.TasksGetTaskPath, 'get');
    if (params) {
      rb.path('taskId', params.taskId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<EssTask>;
      })
    );
  }

  /**
   * Get a single ESS task.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `tasksGetTask$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetTask(params: {

    /**
     * task number
     */
    taskId: string;
  }): Observable<EssTask> {

    return this.tasksGetTask$Response(params).pipe(
      map((r: StrictHttpResponse<EssTask>) => r.body as EssTask)
    );
  }

  /**
   * Path part for operation tasksGetSuppliersList
   */
  static readonly TasksGetSuppliersListPath = '/api/Tasks/{taskId}/suppliers';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tasksGetSuppliersList()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetSuppliersList$Response(params: {
    taskId: string;
  }): Observable<StrictHttpResponse<Array<SuppliersListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, TasksService.TasksGetSuppliersListPath, 'get');
    if (params) {
      rb.path('taskId', params.taskId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<SuppliersListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `tasksGetSuppliersList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetSuppliersList(params: {
    taskId: string;
  }): Observable<Array<SuppliersListItem>> {

    return this.tasksGetSuppliersList$Response(params).pipe(
      map((r: StrictHttpResponse<Array<SuppliersListItem>>) => r.body as Array<SuppliersListItem>)
    );
  }

  /**
   * Path part for operation tasksSignIn
   */
  static readonly TasksSignInPath = '/api/Tasks/signin';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tasksSignIn()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  tasksSignIn$Response(params: {
    body: TaskSignin
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, TasksService.TasksSignInPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `tasksSignIn$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  tasksSignIn(params: {
    body: TaskSignin
  }): Observable<void> {

    return this.tasksSignIn$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
