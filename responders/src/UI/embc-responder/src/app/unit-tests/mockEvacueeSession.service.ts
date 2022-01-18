import { Injectable } from '@angular/core';
import { EvacueeSessionService } from '../core/services/evacuee-session.service';

@Injectable({
  providedIn: 'root'
})
export class MockEvacueeSessionService extends EvacueeSessionService {
  public paperBasedValue: boolean;

  public get paperBased(): boolean {
    return this.paperBasedValue;
  }
  public set paperBased(value: boolean) {
    this.paperBasedValue = value;
  }
}
