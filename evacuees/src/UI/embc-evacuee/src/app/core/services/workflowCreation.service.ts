import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkflowCreationService {

    dynamicComponents: any = [{ type: 'personal-details' }, { type: 'address' }, { type: 'contact-info' }, { type: 'secret' }];
    nonVerifiedWorkflow: Array<any> =
        [
            {
                stepName: 'CollectionNotice',
                showButton: true,
                routerLink: ''
            },
            {
                stepName: 'Restriction',
                showButton: true
            },
            {
                stepName: 'CreateProfile',
                showButton: false
            },
            {
                stepName: 'NeedsAssessment',
                showButton: false
            },
            {
                stepName: 'Review'
            }
        ];

}
