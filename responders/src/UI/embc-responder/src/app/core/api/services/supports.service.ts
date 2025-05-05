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
import { SupportAddDuplicateSupportConflict$Params } from '../fn/supports/supports-add-duplicate-support-conflict';
import { DuplicateSupportModel } from '../../models/duplicate-support.model';

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
    supportsGetDuplicateSupports$Response(params: SupportsGetDuplicateSupports$Params, context?: HttpContext): Observable<StrictHttpResponse<DuplicateSupportModel[]>> {
        return supportsGetDuplicateSupports(this.http, this.rootUrl, params, context);
    }

    /**
     * This method provides access only to the response body.
     * To access the full response (for headers, for example), supportsGetDuplicateSupports$Response() instead.
     *
     * This method doesn't expect any request body.
     */
    supportsGetDuplicateSupports(params: SupportsGetDuplicateSupports$Params, context?: HttpContext): Observable<DuplicateSupportModel[]> {
        return this.supportsGetDuplicateSupports$Response(params, context).pipe(map((r: StrictHttpResponse<DuplicateSupportModel[]>): DuplicateSupportModel[] => r.body));
    }
    
    /** Path part for operation supportAddDuplicateSupportConflict() */
    static readonly SupportAddDuplicateSupportConflictPath = '/api/Reports/create-duplicate-support-conflict';

    /**
     * This method provides access to the full HttpResponse, allowing access to response headers.
     * To access only the response body, use supportAddDuplicateSupportConflict() instead.
     *
     * This method expects a request body.
     */
    supportAddDuplicateSupportConflict$Response(params: SupportAddDuplicateSupportConflict$Params, context?: HttpContext): Observable<StrictHttpResponse<boolean>> {
        const url = `${this.rootUrl}${SupportsService.SupportAddDuplicateSupportConflictPath}`;
        return this.http.post<boolean>(url, params, { observe: 'response', context });
    }

    /**
     * This method provides access only to the response body.
     * To access the full response (for headers, for example), supportAddDuplicateSupportConflict$Response() instead.
     *
     * This method expects a request body.
     */
    supportAddDuplicateSupportConflict(params: SupportAddDuplicateSupportConflict$Params, context?: HttpContext): Observable<boolean> {
        return this.supportAddDuplicateSupportConflict$Response(params, context).pipe(map((r: StrictHttpResponse<boolean>): boolean => r.body));
    }
}