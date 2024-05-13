/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { SuppliersListItem } from '../../models/suppliers-list-item';

export interface TasksGetSuppliersList$Params {
  taskId: string;
}

export function tasksGetSuppliersList(
  http: HttpClient,
  rootUrl: string,
  params: TasksGetSuppliersList$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<SuppliersListItem>>> {
  const rb = new RequestBuilder(rootUrl, tasksGetSuppliersList.PATH, 'get');
  if (params) {
    rb.path('taskId', params.taskId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<SuppliersListItem>>;
    })
  );
}

tasksGetSuppliersList.PATH = '/api/Tasks/{taskId}/suppliers';
