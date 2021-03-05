import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RestrictionService {

    private _restrictedAccess: boolean;

    constructor() { }

    public get restrictedAccess(): boolean {
        return this._restrictedAccess;
    }
    public set restrictedAccess(value: boolean) {
        this._restrictedAccess = value;
    }

}
