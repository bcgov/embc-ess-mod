import { Injectable } from '@angular/core';
import { EvacueeSearchContextModel } from 'src/app/core/models/evacuee-search-context.model';

@Injectable({
    providedIn: 'root'
})
export class EvacueeSearchService {

    evacueeSearchContext: EvacueeSearchContextModel;

    public getEvacueeSearchContext(): EvacueeSearchContextModel {
        return this.evacueeSearchContext;
    }

    public setEvacueeSearchContext(evacueeSearchContext: EvacueeSearchContextModel): void {
        this.evacueeSearchContext = evacueeSearchContext;
    }

}