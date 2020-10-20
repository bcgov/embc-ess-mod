import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentMetaDataModel } from '../model/componentMetaData.model';

@Injectable({ providedIn: 'root' })
export class ComponentCreationService {

    dynamicComponents: any = [{ type: 'personal-details' }, { type: 'address' }, { type: 'contact-info' }, { type: 'secret' }];
    profileComponents: Array<any> =
        [
            {
                component: 'personal-details',
                nextButtonLabel: 'Next - Primary & Mailing Address',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: -2,
                stepName: 'Personal Details'
            },
            {
                component: 'address',
                nextButtonLabel: 'Next - Contact Information',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0,
                stepName: 'Address'
            },
            {
                component: 'contact-info',
                nextButtonLabel: 'Next - Security Question',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0,
                stepName: 'Contact'
            },
            {
                component: 'secret',
                nextButtonLabel: 'Next - Create Evacuation File',
                backButtonLabel: 'Go Back & Edit',
                isLast: true,
                loadWrapperButton: false,
                lastStep: 0,
                stepName: 'Security Question'
            }
        ];

        needsAssessmentComponents: Array<any> =
        [
            {
                component: 'evac-address',
                nextButtonLabel: 'Next - Family Information',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: -1,
                stepName: 'Evacuated From'
            },
            {
                component: 'family-information',
                nextButtonLabel: 'Next - Pets',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0,
                stepName: 'Family Members'
            },
            {
                component: 'pets',
                nextButtonLabel: 'Next - Identify Needs',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0,
                stepName: 'Pets'
            },
            {
                component: 'identify-needs',
                nextButtonLabel: 'Next - Review Submission',
                backButtonLabel: 'Go Back & Edit',
                isLast: false,
                loadWrapperButton: false,
                lastStep: 0,
                stepName: 'Needs'
            },
            // {
            //     component: 'pets',
            //     nextButtonLabel: 'Submit',
            //     backButtonLabel: 'Go Back & Edit',
            //     isLast: false,
            //     loadWrapperButton: false,
            //     lastStep: 0
            // }
        ];

    getProfileComponents(): Observable<any> {
        const profile = new Observable((observer) => {
            observer.next(this.dynamicComponents);
            observer.complete();
        });
        return profile;
    }

    createProfileSteps(): Array<ComponentMetaDataModel> {
        const componentArr: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
        for (const comp of this.profileComponents) {
            componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
        }
        return componentArr;
    }

    createEvacSteps(): Array<ComponentMetaDataModel> {
        const componentArr: Array<ComponentMetaDataModel> = new Array<ComponentMetaDataModel>();
        for (const comp of this.needsAssessmentComponents) {
            componentArr.push(Object.assign(new ComponentMetaDataModel(), comp));
        }
        return componentArr;
    }

}
