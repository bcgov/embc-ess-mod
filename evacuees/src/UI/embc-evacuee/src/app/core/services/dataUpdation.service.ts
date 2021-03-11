import { Injectable } from '@angular/core';
import { RegistrationResult } from '../api/models/registration-result';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class DataUpdationService {

    constructor(public dataService: DataService) { }

    updateRegisrationResult(registrationResult: RegistrationResult): void {
        this.dataService.setRegistrationResult(registrationResult);
    }

    updateVerifiedRegistrationResult(registrationResult: string): void {
        this.dataService.setVerifiedRegistrationResult(registrationResult);
    }

}
