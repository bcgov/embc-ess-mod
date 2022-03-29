import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ComputeFeaturesService } from './helper/computeFeatures.service';

@Injectable({
  providedIn: 'root'
})
export class ComputeRulesService {
  public eventSubject = new Subject<void>();
  public readonly eventSubject$: Observable<void> =
    this.eventSubject.asObservable();

  constructor(private computeFeaturesService: ComputeFeaturesService) {
    this.listener();
  }

  triggerEvent() {
    this.eventSubject.next();
  }

  listener() {
    this.eventSubject$.subscribe({
      next: () => {
        this.computeFeaturesService.execute();
      }
    });
  }
}
