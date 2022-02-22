import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RestrictionService {
  private restrictedAcces: boolean;

  constructor() {}

  public get restrictedAccess(): boolean {
    return this.restrictedAcces;
  }
  public set restrictedAccess(value: boolean) {
    this.restrictedAcces = value;
  }
}
