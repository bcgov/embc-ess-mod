/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { Support } from '../../models';

export interface SupportsGetDuplicateSupports$Params {
    members: string[]
    toDate: string
    fromDate: string
    category: string
}

export function supportsGetDuplicateSupports(
    http: HttpClient,
    rootUrl: string,
    params: SupportsGetDuplicateSupports$Params,
    context?: HttpContext
): Observable<StrictHttpResponse<Support[]>> {
    const rb = new RequestBuilder(rootUrl, supportsGetDuplicateSupports.PATH, 'get');

    // Pass as query parameters instead of body for GET
    rb.query('toDate', params.toDate);
    rb.query('fromDate', params.fromDate);
    rb.query('category', params.category);
    rb.query('members', params.members);
    
    return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
        filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
            return r as StrictHttpResponse<Support[]>;
        })
    );
}

supportsGetDuplicateSupports.PATH = '/api/Supports/get-duplicate-supports';