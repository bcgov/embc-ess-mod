/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { EssTask } from '../models/ess-task';
import { SuppliersListItem } from '../models/suppliers-list-item';
import { tasksGetSuppliersList } from '../fn/tasks/tasks-get-suppliers-list';
import { TasksGetSuppliersList$Params } from '../fn/tasks/tasks-get-suppliers-list';
import { tasksGetTask } from '../fn/tasks/tasks-get-task';
import { TasksGetTask$Params } from '../fn/tasks/tasks-get-task';
import { tasksSignIn } from '../fn/tasks/tasks-sign-in';
import { TasksSignIn$Params } from '../fn/tasks/tasks-sign-in';

@Injectable({ providedIn: 'root' })
export class TasksService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `tasksGetTask()` */
  static readonly TasksGetTaskPath = '/api/Tasks/{taskId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tasksGetTask()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetTask$Response(params: TasksGetTask$Params, context?: HttpContext): Observable<StrictHttpResponse<EssTask>> {
    return tasksGetTask(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tasksGetTask$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetTask(params: TasksGetTask$Params, context?: HttpContext): Observable<EssTask> {
    return this.tasksGetTask$Response(params, context).pipe(map((r: StrictHttpResponse<EssTask>): EssTask => r.body));
  }

  /** Path part for operation `tasksGetSuppliersList()` */
  static readonly TasksGetSuppliersListPath = '/api/Tasks/{taskId}/suppliers';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tasksGetSuppliersList()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetSuppliersList$Response(
    params: TasksGetSuppliersList$Params,
    context?: HttpContext
  ): Observable<StrictHttpResponse<Array<SuppliersListItem>>> {
    return tasksGetSuppliersList(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tasksGetSuppliersList$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksGetSuppliersList(
    params: TasksGetSuppliersList$Params,
    context?: HttpContext
  ): Observable<Array<SuppliersListItem>> {
    return this.tasksGetSuppliersList$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<SuppliersListItem>>): Array<SuppliersListItem> => r.body)
    );
  }

  /** Path part for operation `tasksSignIn()` */
  static readonly TasksSignInPath = '/api/Tasks/signin';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tasksSignIn()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  tasksSignIn$Response(params?: TasksSignIn$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return tasksSignIn(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `tasksSignIn$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  tasksSignIn(params?: TasksSignIn$Params, context?: HttpContext): Observable<void> {
    return this.tasksSignIn$Response(params, context).pipe(map((r: StrictHttpResponse<void>): void => r.body));
  }
}
