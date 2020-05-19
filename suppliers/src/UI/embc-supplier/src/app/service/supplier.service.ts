import { Injectable } from '@angular/core';
import { Community } from '../model/community';
import { Observable } from 'rxjs';
import { Province } from '../model/province';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    private supplierDetails: any;
    private cityList: Community[];
    private provinceList: Province[];

    setSupplierDetails(supplierDetails: any) {
        this.supplierDetails = supplierDetails;
    }

    getSupplierDetails() {
        return this.supplierDetails;
    }

    setCityList(cityList: Community[]) {
        this.cityList = cityList;
    }

    getCityList() {
        return this.cityList;
    }

    setProvinceList(provinceList: Province[]) {
        this.provinceList = provinceList;
    }

    getProvinceList() {
        return this.provinceList;
    }


}