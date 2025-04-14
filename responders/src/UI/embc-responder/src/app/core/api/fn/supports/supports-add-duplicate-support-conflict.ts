/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { Support } from '../../models';


export interface SupportAddDuplicateSupportConflict$Params {
members: string[];
fileId: string;
issuedBy: string;
conflictSupportId?: string;
}


export function supportAddDuplicateSupportConflict(
    http: HttpClient,
    rootUrl: string,
    params: SupportAddDuplicateSupportConflict$Params,
    context?: HttpContext
): Observable<StrictHttpResponse<boolean>> {
    console.log('supportAddDuplicateSupportConflict', params);
    const rb = new RequestBuilder(rootUrl, supportAddDuplicateSupportConflict.PATH, 'get');

    // Pass as query parameters instead of body for GET
    rb.query('members', params.members);
    rb.query('fileId', params.fileId);
    rb.query('issuedBy', params.issuedBy);
    rb.query('conflictSupportId', params.conflictSupportId);

    return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
        filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
            return r as StrictHttpResponse<boolean>;
        })
    );
}

supportAddDuplicateSupportConflict.PATH = '/api/Reports/create-duplicate-support-conflict';