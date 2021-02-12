import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnonymousRegistration, RegistrationResult } from '../../api/models';
import { RegistrationService } from '../../api/services';
import { DataService } from '../data.service';
import { RegistrationMappingService } from '../mappings/registrationMapping.service';

@Injectable({ providedIn: 'root' })
export class RegistrationApiService {

    constructor(private registrationService: RegistrationService, private registrationMapping: RegistrationMappingService) { }

    public submitRegistration(): Observable<RegistrationResult> {
        return this.registrationService.registrationCreate({ body: this.registrationMapping.mapAnonymousRegistration() });
    }

}
