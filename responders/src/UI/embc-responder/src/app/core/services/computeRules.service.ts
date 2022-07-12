import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { computeInterfaceToken } from 'src/app/app.module';
import { Compute } from '../interfaces/compute';

@Injectable({
  providedIn: 'root'
})
export class ComputeRulesService {
  public eventSubject = new Subject<void>();
  public readonly eventSubject$: Observable<void> =
    this.eventSubject.asObservable();

  constructor(@Inject(computeInterfaceToken) private compute: Compute[]) {
    this.listener();
  }

  triggerEvent() {
    this.eventSubject.next();
  }

  listener() {
    this.eventSubject$.subscribe({
      next: () => {
        if (this.compute.length > 0) {
          this.compute.forEach((service) => service.execute());
        }
      }
    });
  }
}
