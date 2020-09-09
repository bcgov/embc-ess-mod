import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentMetaDataModel } from 'src/app/model/componentMetaData.model';

@Injectable({ providedIn: 'root' })
export class ComponentCreationService {

    dynamicComponents: any = [{ type: 'personal-details' }, { type: 'address' }, { type: 'contact-info' }, { type: 'secret' }];
    profileComponents: Array<any> =
        [
            {
                component: 'personal-details',
                nextButtonLabel: 'Next-Primary & Mailing Address',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: -2
            },
            {
                component: 'address',
                nextButtonLabel: 'Next-Contact Information',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0
            },
            {
                component: 'contact-info',
                nextButtonLabel: 'Next-Security Question',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0
            },
            {
                component: 'secret',
                nextButtonLabel: 'Next-Create Evacuation File',
                backButtonLabel: 'Go Back & Edit',
                isLast: true,
                loadWrapperButton: false,
                lastStep: 0
            }
        ];

        needsAssessmentComponents: Array<any> =
        [
            {
                component: 'evac-address',
                nextButtonLabel: 'Next-Family Information',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: -1
            },
            {
                component: 'family-information',
                nextButtonLabel: 'Next-Pets',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0
            },
            {
                component: 'pets',
                nextButtonLabel: 'Next-Identify Needs',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0
            },
            {
                component: 'identify-needs',
                nextButtonLabel: 'Next-Review Submission',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0
            },
            {
                component: 'pets',
                nextButtonLabel: 'Submit',
                backButtonLabel: 'Go Back & Edit',
                isLast: true,
                loadWrapperButton: false,
                lastStep: 0
            }
        ];

    getProfileComponents(): Observable<any> {
        const profile = new Observable((observer) => {
            observer.next(this.dynamicComponents);
            observer.complete();
        })
        return profile;
    }

    createProfileSteps(): Array<ComponentMetaDataModel> {
        let componentArr: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
        for (let comp of this.profileComponents) {
            componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
        }
        return componentArr;
    }

    createEvacSteps(): Array<ComponentMetaDataModel> {
        let componentArr: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
        for (let comp of this.needsAssessmentComponents) {
            componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
        }
        return componentArr;
    }

}
