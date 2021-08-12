import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddressModel } from 'src/app/core/models/address.model';
import {
  GstModel,
  SupplierContact,
  SupplierTemp
} from '../suppliers-list/supplier-list-data.service';

@Injectable({ providedIn: 'root' })
export class AddSupplierService {
  private supplierLegalNameVal: string;
  private supplierNameVal: string;
  private supplierAddressVal: AddressModel;
  private isMutualAidVal: boolean;
  private isActiveVal: boolean;
  private gstNumberVal: GstModel;
  private primaryContactVal: SupplierContact;

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

  public get isMutualAid(): boolean {
    return this.isMutualAidVal;
  }
  public set isMutualAid(value: boolean) {
    this.isMutualAidVal = value;
  }

  public get isActive(): boolean {
    return this.isActiveVal;
  }
  public set isActive(value: boolean) {
    this.isActiveVal = value;
  }

  public get gstNumber(): GstModel {
    return this.gstNumberVal;
  }
  public set gstNumber(gstNumberVal: GstModel) {
    this.gstNumberVal = gstNumberVal;
  }

  public get primaryContact(): SupplierContact {
    return this.primaryContactVal;
  }
  public set primaryContact(value: SupplierContact) {
    this.primaryContactVal = value;
  }

  checkSupplierExists(gstNumber: GstModel): Observable<boolean> {
    const result = new Subject<boolean>();
    result.next(true);
    return result;
  }

  /**
   * Gets the data of the supplier that is going to be added
   *
   * @returns Supplier object
   */
  getAddedSupplier(): SupplierTemp {
    console.log({
      legalName: this.supplierLegalName,
      name: this.supplierName,
      address: this.supplierAddress,
      isMutualAid: this.isMutualAid,
      isActive: this.isActive,
      gstNumber: this.gstNumber,
      primaryContact: this.primaryContact
    });

    return {
      legalName: this.supplierLegalName,
      name: this.supplierName,
      address: this.supplierAddress,
      isMutualAid: this.isMutualAid,
      isActive: this.isActive,
      gstNumber: this.gstNumber,
      primaryContact: this.primaryContact
    };
  }

  /**
   * Clears the data of the supplier that was added
   */
  clearAddedSupplier(): void {
    this.supplierLegalName = undefined;
    this.supplierName = undefined;
    this.supplierAddress = undefined;
    this.isMutualAid = undefined;
    this.isActive = undefined;
    this.gstNumber = undefined;
    this.primaryContact = undefined;
  }
}
