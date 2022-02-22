import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoadTeamListService } from '../core/services/load-team-list.service';

@Injectable({ providedIn: 'root' })
export class MockTeamListService extends LoadTeamListService {
  public loadStaticTeamLists(): Promise<void> {
    return Promise.resolve();
  }
}
