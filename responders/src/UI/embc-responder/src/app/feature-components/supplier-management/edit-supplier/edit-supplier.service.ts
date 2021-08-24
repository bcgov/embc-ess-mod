import { Injectable } from '@angular/core';
import { Supplier } from 'src/app/core/api/models/supplier';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { LocationsService } from 'src/app/core/services/locations.service';
import { SupplierManagementService } from '../supplier-management.service';

@Injectable({ providedIn: 'root' })
export class EditSupplierService {
  private editedSupplierVal: SupplierModel;

  constructor(
    private locationServices: LocationsService,
    private supplierManagementService: SupplierManagementService
  ) {}

  public get editedSupplier(): SupplierModel {
    return this.editedSupplierVal;
  }
  public set editedSupplier(value: SupplierModel) {
    this.editedSupplierVal = value;
  }

  public getEditedSupplierDTO(): Supplier {
    return {
      address: this.locationServices.setAddressObjectForDTO(
        this.editedSupplier.address
      ),
      contact: this.editedSupplier.contact,
      gstNumber: this.editedSupplier.gstNumber,
      id: this.editedSupplier.id,
      legalName: this.editedSupplier.legalName,
      name: this.editedSupplier.name,
      sharedWithTeams: this.editedSupplier.sharedWithTeams,
      status: this.editedSupplier.status,
      team: this.editedSupplier.team
    };
  }
}
