import { Injectable } from '@angular/core';
import {
  SupplierContact,
  SupplierStatus,
  Team,
  SupplierListItem,
  Supplier,
  MutualAid
} from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { GstNumberModel } from 'src/app/core/models/gst-number.model';
import { SupplierModel } from 'src/app/core/models/supplier.model';
import { LocationsService } from 'src/app/core/services/locations.service';
import { SupplierManagementService } from '../supplier-management.service';

@Injectable({ providedIn: 'root' })
export class AddSupplierService {
  private supplierLegalNameVal: string;
  private supplierNameVal: string;
  private supplierAddressVal: AddressModel;
  private mutualAidsVal: Array<MutualAid>;
  private statusVal: SupplierStatus;
  private supplierGstNumberVal: GstNumberModel;
  private contactVal: SupplierContact;

  private existingSuppliersListVal: Array<SupplierListItem>;

  constructor(
    private locationService: LocationsService,
    private supplierManagementService: SupplierManagementService
  ) {}

  public get supplierLegalName(): string {
    return this.supplierLegalNameVal;
  }
  public set supplierLegalName(value: string) {
    this.supplierLegalNameVal = value;
  }

  public get supplierName(): string {
    return this.supplierNameVal;
  }
  public set supplierName(value: string) {
    this.supplierNameVal = value;
  }

  public get supplierAddress(): AddressModel {
    return this.supplierAddressVal;
  }
  public set supplierAddress(value: AddressModel) {
    this.supplierAddressVal = value;
  }

  public get mutualAids(): Array<MutualAid> {
    return this.mutualAidsVal;
  }
  public set mutualAids(value: Array<MutualAid>) {
    this.mutualAidsVal = value;
  }

  public get status(): SupplierStatus {
    return this.statusVal;
  }
  public set status(value: SupplierStatus) {
    this.statusVal = value;
  }

  public get supplierGstNumber(): GstNumberModel {
    return this.supplierGstNumberVal;
  }
  public set supplierGstNumber(supplierGstNumberVal: GstNumberModel) {
    this.supplierGstNumberVal = supplierGstNumberVal;
  }

  public get contact(): SupplierContact {
    return this.contactVal;
  }
  public set contact(value: SupplierContact) {
    this.contactVal = value;
  }

  public get existingSuppliersList(): Array<SupplierListItem> {
    return this.existingSuppliersListVal;
  }
  public set existingSuppliersList(value: Array<SupplierListItem>) {
    this.existingSuppliersListVal = value;
  }

  /**
   * Gets the data of the supplier that is going to be added
   *
   * @returns Supplier object
   */
  getAddedSupplier(): SupplierModel {
    return {
      legalName: this.supplierLegalName,
      name: this.supplierName,
      address: this.supplierAddress,
      mutualAids: this.mutualAidsVal,
      status: this.status,
      supplierGstNumber: this.supplierGstNumber,
      contact: this.contact
    };
  }

  /**
   * Clears the data of the supplier that was added
   */
  clearAddedSupplier(): void {
    this.supplierLegalName = undefined;
    this.supplierName = undefined;
    this.supplierAddress = undefined;
    this.mutualAidsVal = undefined;
    this.status = undefined;
    this.supplierGstNumber = undefined;
    this.contact = undefined;
  }

  /**
   * Builds a create Supplier payload to be sent to the API
   *
   * @returns a Supplier object
   */
  getCreateSupplierDTO(): Supplier {
    return {
      address: this.locationService.setAddressObjectForDTO(
        this.supplierAddress
      ),
      contact: this.contact,
      gstNumber:
        this.supplierManagementService.convertSupplierGSTNumbertoString(
          this.supplierGstNumber
        ),
      legalName: this.supplierLegalName,
      name: this.supplierName,
      status: SupplierStatus.Active
    };
  }
}
