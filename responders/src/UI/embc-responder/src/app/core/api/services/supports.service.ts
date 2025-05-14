/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { supportsGetDuplicateSupports, SupportsGetDuplicateSupports$Params } from '../fn/supports/supports-get-duplicate-supports';
import { Support } from '../models';

@Injectable({ providedIn: 'root' })
export class SupportsService extends BaseService {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http);
    }

    /** Path part for operation supportsGetDuplicateSupports() */
    static readonly SupportsGetDuplicateSupportsPath = '/api/Supports/get-duplicate-supports';

    /**
     * This method provides access to the full HttpResponse, allowing access to response headers.
     * To access only the response body, use supportsGetDuplicateSupports() instead.
     *
     * This method doesn't expect any request body.
     */
    supportsGetDuplicateSupports$Response(params: SupportsGetDuplicateSupports$Params, context?: HttpContext): Observable<StrictHttpResponse<Support[]>> {
        return supportsGetDuplicateSupports(this.http, this.rootUrl, params, context);
    }

    /**
     * This method provides access only to the response body.
     * To access the full response (for headers, for example), supportsGetDuplicateSupports$Response() instead.
     *
     * This method doesn't expect any request body.
     */
    supportsGetDuplicateSupports(params: SupportsGetDuplicateSupports$Params, context?: HttpContext): Observable<Support[]> {
        return this.supportsGetDuplicateSupports$Response(params, context).pipe(map((r: StrictHttpResponse<Support[]>): Support[] => r.body));
    }

}