import { Injectable } from "@angular/core";
import { Registration } from '../model/registration.model';

@Injectable({ providedIn: 'root' })
export class DataService {

    private registration: Partial<Registration> = {};

    public updateRegistartion(value): void {
       // Object.assign(value, this.registration)
       this.registration = { ...this.registration, ...value}
       console.log(this.registration)
    }

    public getRegistration() {
        return this.registration;
    }
}