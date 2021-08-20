import { Injectable } from '@angular/core';
import {
  SupplierContact,
  SupplierStatus,
  Team,
  SupplierListItem
} from 'src/app/core/api/models';
import { AddressModel } from 'src/app/core/models/address.model';
import { GstNumberModel } from 'src/app/core/models/gst-number.model';
import { SupplierModel } from 'src/app/core/models/supplier.model';

@Injectable({ providedIn: 'root' })
export class AddSupplierService {
  private supplierLegalNameVal: string;
  private supplierNameVal: string;
  private supplierAddressVal: AddressModel;
  private sharedWithTeamsVal: Array<Team>;
  private statusVal: SupplierStatus;
  private supplierGstNumberVal: GstNumberModel;
  private contactVal: SupplierContact;

  private existingSuppliersListVal: Array<SupplierListItem>;

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

  public get sharedWithTeams(): Array<Team> {
    return this.sharedWithTeamsVal;
  }
  public set sharedWithTeams(value: Array<Team>) {
    this.sharedWithTeamsVal = value;
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
    console.log({
      legalName: this.supplierLegalName,
      name: this.supplierName,
      address: this.supplierAddress,
      sharedWithTeams: this.sharedWithTeams,
      isActive: this.status,
      supplierGstNumber: this.supplierGstNumber,
      contact: this.contact
    });

    return {
      legalName: this.supplierLegalName,
      name: this.supplierName,
      address: this.supplierAddress,
      sharedWithTeams: this.sharedWithTeams,
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
    this.sharedWithTeams = undefined;
    this.status = undefined;
    this.supplierGstNumber = undefined;
    this.contact = undefined;
  }
}
