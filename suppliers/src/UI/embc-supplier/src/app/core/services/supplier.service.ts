import { Injectable } from '@angular/core';
import { Community } from '../model/community';
import { Province } from '../model/province';
import { DataService } from './data.service';
import { Country, SupportItems } from '../model/country';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends DataService {
  private supplierDetails: any;
  private cityList: Observable<Community[]>;
  private provinceList: Observable<Province[]>;
  private countryList: Observable<Country[]>;
  private stateList: Observable<Province[]>;
  private referenceNumber: string;
  private supportItems: SupportItems[];

  constructor(private modalService: NgbModal) {
    super();
  }

  setSupplierDetails(supplierDetails: any) {
    this.supplierDetails = supplierDetails;
  }

  getSupplierDetails() {
    return this.supplierDetails;
  }

  setCityList(cityList: Observable<Community[]>) {
    this.cityList = cityList;
  }

  getCityList() {
    return this.cityList;
  }

  setCountryList(countryList: Observable<Country[]>) {
    this.countryList = countryList;
  }

  getCountryListt() {
    return this.countryList;
  }

  setStateList(stateList: Observable<Province[]>) {
    this.stateList = stateList;
  }

  getStateList() {
    return this.stateList;
  }

  setProvinceList(provinceList: Observable<Province[]>) {
    this.provinceList = provinceList;
  }

  getProvinceList() {
    return this.provinceList;
  }

  setSupportItems(supportItems: SupportItems[]) {
    this.supportItems = supportItems;
  }

  getSupportItems() {
    return this.supportItems;
  }

  setReferenceNumber(referenceNumber: string) {
    this.referenceNumber = referenceNumber;
  }

  getReferenceNumber() {
    return this.referenceNumber;
  }

  confirmModal(message: string, button: string): Observable<boolean> {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.messageBody = message;
    modalRef.componentInstance.buttonText = button;
    const modalButtonClick = modalRef.componentInstance.clearIndicator;
    return modalButtonClick;
  }
}
