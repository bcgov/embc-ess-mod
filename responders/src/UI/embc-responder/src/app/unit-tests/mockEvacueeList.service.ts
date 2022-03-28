import { Injectable } from '@angular/core';
import { LoadEvacueeListService } from '../core/services/load-evacuee-list.service';

@Injectable({ providedIn: 'root' })
export class MockEvacueeListService extends LoadEvacueeListService {
  public loadStaticEvacueeLists(): Promise<void> {
    return Promise.resolve();
  }
}
