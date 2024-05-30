/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { EssTask } from '../../models/ess-task';

export interface TasksGetTask$Params {
  /**
   * task number
   */
  taskId: string;
}

export function tasksGetTask(
  http: HttpClient,
  rootUrl: string,
  params: TasksGetTask$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<EssTask>> {
  const rb = new RequestBuilder(rootUrl, tasksGetTask.PATH, 'get');
  if (params) {
    rb.path('taskId', params.taskId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<EssTask>;
    })
  );
}

tasksGetTask.PATH = '/api/Tasks/{taskId}';
