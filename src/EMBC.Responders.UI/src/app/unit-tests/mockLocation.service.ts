import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocationsService } from '../core/services/locations.service';

@Injectable({ providedIn: 'root' })
export class MockLocationService extends LocationsService {
  public loadStaticLocationLists(): Promise<void> {
    return Promise.resolve();
  }
}
