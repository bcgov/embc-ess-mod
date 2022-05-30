import { Injectable } from '@angular/core';
import { SupplierModel } from '../core/models/supplier.model';
import { EditSupplierService } from '../feature-components/supplier-management/edit-supplier/edit-supplier.service';

@Injectable({ providedIn: 'root' })
export class MockEditSupplierService extends EditSupplierService {
  public mockEditSupplier: SupplierModel;

  public get editedSupplier(): SupplierModel {
    return this.mockEditSupplier;
  }
  public set editedSupplier(value: SupplierModel) {
    this.mockEditSupplier = value;
  }
}
