import { Injectable } from '@angular/core';
import { EvacueeDetailsModel, EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';

@Injectable({
    providedIn: 'root'
})
export class EvacueeSearchService {

    private hasShownIdentification: boolean;
    private evacueeSearchParameters: EvacueeDetailsModel = {firstName: null, lastName: null, dateOfBirth: null};


    public getHasShownIdentification(): boolean {
        return this.hasShownIdentification;
    }

    public setHasShownIdentification(value: boolean): void {
        this.hasShownIdentification = value;
    }

    public getEvacueeSearchParameters(): EvacueeDetailsModel {
        return this.evacueeSearchParameters;
    }

    public setEvacueeSearchParameters(value: EvacueeDetailsModel): void {
        this.evacueeSearchParameters = value;
    }

    public getEvacueeSearchContext(): EvacueeSearchContextModel {
        return {
            hasShownIdentification: this.hasShownIdentification,
            evacueeSearchParameters: this.evacueeSearchParameters
        };
    }

}
