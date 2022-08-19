import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { EssTask } from '../core/api/models';
import { TaskSearchService } from '../feature-components/search/task-search/task-search.service';

@Injectable({
  providedIn: 'root'
})
export class MockTaskSearchService extends TaskSearchService {
  public mockEssTask: EssTask;

  searchTask(taskNumber: string): Observable<EssTask> {
    return new BehaviorSubject<EssTask>(this.mockEssTask);
  }

  taskSignIn(taskNumber?: string): Observable<void> {
    return new BehaviorSubject<void>(null);
  }
}
