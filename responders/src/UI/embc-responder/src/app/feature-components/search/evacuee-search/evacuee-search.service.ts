import { Injectable } from '@angular/core';
import { EvacueeDetailsModel, EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';

@Injectable({
    providedIn: 'root'
})
export class EvacueeSearchService {

    private _evacueeSearchContext: EvacueeSearchContextModel;

    private _hasShownIdentification: boolean;
    private _evacueeSearchParameters: EvacueeDetailsModel;

    public get hasShownIdentification(): boolean {
        return this._hasShownIdentification;
    }

    public set hasShownIdentification(value: boolean) {
        this._hasShownIdentification = value;
    }

    public get evacueeSearchParameters(): EvacueeDetailsModel {
        return this._evacueeSearchParameters;
    }

    public set evacueeSearchParameters(value: EvacueeDetailsModel) {
        this._evacueeSearchParameters = value;
    }


    public getEvacueeSearchContext(): EvacueeSearchContextModel {
        return {
            hasShownIdentification: this._hasShownIdentification,
            evacueeSearchParameters: this._evacueeSearchParameters
        };
    }

    public setEvacueeSearchContext(evacueeSearchContext: EvacueeSearchContextModel): void {
        this._evacueeSearchContext = evacueeSearchContext;
    }

}
