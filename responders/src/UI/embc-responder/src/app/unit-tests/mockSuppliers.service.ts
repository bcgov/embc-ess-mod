import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierResult } from '../core/api/models';
import { SupplierService } from '../core/services/suppliers.service';

@Injectable({ providedIn: 'root' })
export class MockSupplierService extends SupplierService {
  public mockSupplierResult: SupplierResult = {
    id: '03d0a11b-99a4-4c4a-8f97-2f39d3500972'
  };

  public loadStaticMutualAidSuppliersList(): Promise<void> {
    return Promise.resolve();
  }

  deleteSupplier(supplierId: string): Observable<SupplierResult> {
    return new BehaviorSubject<SupplierResult>(this.mockSupplierResult);
  }
}
