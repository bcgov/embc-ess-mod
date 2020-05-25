import { Injectable } from '@angular/core';
import { Community } from '../model/community';
import { Province } from '../model/province';
import { Suppliers, ContactPerson, SupplierInformation, Address, Attachment } from '../model/suppliers';
import { Invoices } from '../model/invoices';
import { LineItems } from '../model/lineItems';
import { Referrals } from '../model/referrals';
import { DataService } from './data.service';
import { Country, SupportItems } from '../model/country';
import { Receipts } from '../model/receipts';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SupplierService extends DataService {

    private supplierDetails: any;
    private cityList: Observable<Community[]>;
    private provinceList: Observable<Province[]>;
    private countryList: Country[];
    private stateList: Observable<Province[]>;
    private payLoad: Suppliers;
    private referenceNumber: string;
    private supportItems: SupportItems[];

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

    setCountryList(countryList: Country[]) {
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

    private setPayload(payLoad: Suppliers) {
        this.payLoad = payLoad
    }

    getPayload() {
        return this.payLoad;
    }

    setReferenceNumber(referenceNumber: string) {
        this.referenceNumber = referenceNumber
    }

    getReferenceNumber() {
        return this.referenceNumber;
    }

    createPayload(supplierDetails: any) {
        let contact = this.createContactRecord(supplierDetails);
        let address = this.createAddressRecord(supplierDetails);
        let supplierInformation = this.createSupplierInformationRecord(supplierDetails, contact, address, false);
        let remitSupplierInformation = null;
        if (supplierDetails.remitToOtherBusiness) {
            let remittanceAddress = this.createRemitAddressRecord(supplierDetails);
            remitSupplierInformation = this.createSupplierRemitInformationRecord(supplierDetails, contact, remittanceAddress, true);
        }
        let supplierInformationArr = [supplierInformation]
        if (remitSupplierInformation) {
            supplierInformationArr.push(remitSupplierInformation);
        }

        let invoices = this.createInvoiceRecord(supplierDetails);
        let lineItems = this.createLineItemsRecord(supplierDetails);
        let attachments = this.createAttachmentsRecord(supplierDetails);
        let referrals = this.createReferralsRecord(supplierDetails);
        let receipts = this.createReceiptslRecord(supplierDetails);
        let suppliers: Suppliers = new Suppliers(supplierInformationArr, receipts, invoices, referrals, lineItems, attachments);
        this.setPayload(suppliers);
        console.log(JSON.stringify(suppliers));
    }

    clearPayload() {
        this.setPayload(new Suppliers(null, null, null, null, null, null));
    }

    createContactRecord(supplierDetails: any) {
        return new ContactPerson(supplierDetails.contactPerson.firstName, supplierDetails.contactPerson.lastName,
            supplierDetails.contactPerson.email, supplierDetails.contactPerson.phone, supplierDetails.contactPerson.fax);
    }

    createAddressRecord(supplierDetails: any) {
        return new Address(supplierDetails.address.address1, supplierDetails.address.address2, supplierDetails.address.city.code, supplierDetails.address.city.name,
            supplierDetails.address.province.code, supplierDetails.address.province.name, supplierDetails.address.country.code, supplierDetails.address.country.name,
            supplierDetails.address.postalCode);
    }

    createRemitAddressRecord(supplierDetails: any) {
        return new Address(supplierDetails.remittanceAddress.address1, supplierDetails.remittanceAddress.address2, supplierDetails.remittanceAddress.city, supplierDetails.remittanceAddress.city.name,
            supplierDetails.remittanceAddress.province.code, supplierDetails.remittanceAddress.province.name, supplierDetails.remittanceAddress.country, supplierDetails.remittanceAddress.country,
            supplierDetails.remittanceAddress.postalCode);
    }

    createSupplierInformationRecord(supplierDetails: any, contact: ContactPerson, address: Address, remit: boolean) {
        return new SupplierInformation(supplierDetails.gstNumber, supplierDetails.supplierName, supplierDetails.supplierLegalName,
            supplierDetails.location, address, contact, remit);
    }

    createSupplierRemitInformationRecord(supplierDetails: any, contact: ContactPerson, address: Address, remit: boolean) {
        return new SupplierInformation(supplierDetails.gstNumber, supplierDetails.supplierName, supplierDetails.supplierLegalName,
            supplierDetails.location, address, contact, remit);
    }

    createInvoiceRecord(supplierDetails: any) {
        let invoices = [];
        supplierDetails.invoices.forEach(element => {
            let formattedDate = new DatePipe('en-US').transform(element.invoiceDate, 'yyyy-MM-dd');
            invoices.push(new Invoices(element.invoiceNumber, formattedDate, element.invoiceTotalGst, element.invoiceTotalAmount))
        });
        //  return new Invoices('string', '2020-01-30', 10, 300);
        return invoices;
    }

    createReceiptslRecord(supplierDetails: any) {
        let receipts = [];
        supplierDetails.receipts.forEach(element => { 
            element.referrals.forEach(ref => {
                let formattedDate = new DatePipe('en-US').transform(ref.referralDate, 'yyyy-MM-dd');
                console.log(new DatePipe('en-US').transform(ref.referralDate, 'yyyy-MM-dd'));
                console.log(ref.referralDate)
                receipts.push(new Receipts(ref.receiptNumber, formattedDate, element.receiptTotalGst, element.receiptTotalAmount, element.referralNumber))
            })
        });
        //  return new Invoices('string', '2020-01-30', 10, 300);
        return receipts;
    }


    createLineItemsRecord(supplierDetails: any) {
        let lineItems = [];
        supplierDetails.invoices.forEach(invoice => {
            invoice.referrals.forEach(ref => {
                ref.referralRows.forEach(element => {
                    lineItems.push(new LineItems(element.supportProvided.name, element.description, element.gst, element.amount, null, ref.referralNumber));
                })
            })
        });
        supplierDetails.receipts.forEach(receipt => {
            receipt.referrals.forEach(ref => {
                ref.referralRows.forEach(element => {
                    lineItems.push(new LineItems(element.supportProvided.name, element.description, element.gst, element.amount, ref.receiptNumber, receipt.referralNumber));
                })
            })
        });
        return lineItems;
        //return new LineItems('string', 'string', 2, 100, null, 'string');
    }

    createAttachmentsRecord(supplierDetails: any) {
        let attachments = [];
        if (supplierDetails.invoices.length>0) {
            supplierDetails.invoices.forEach(invoice => {
                invoice.invoiceAttachments.forEach(e => {
                    attachments.push(new Attachment(e.file, null, e.fileName, invoice.invoiceNumber, null, 2))
                })
                invoice.referrals.forEach(ref => {
                    ref.referralAttachments.forEach(e => {
                        attachments.push(new Attachment(e.file, null, e.fileName, invoice.invoiceNumber, ref.referralNumber, 1))
                    });
                    ref.receiptAttachments.forEach(e => {
                        attachments.push(new Attachment(e.file, null, e.fileName, invoice.invoiceNumber, ref.referralNumber, 0))
                    })
                })
            })
        } else if (supplierDetails.receipts.length>0) {
            supplierDetails.receipts.forEach(ref => {
                ref.referralAttachments.forEach(e => {
                    attachments.push(new Attachment(e.file, null, e.fileName, null, ref.referralNumber, 1))
                })
                ref.receiptAttachments.forEach(e => {
                    attachments.push(new Attachment(e.file, null, e.fileName, null, ref.referralNumber, 1))
                })
            });

        }

        return attachments;
        // return [];
    }

    createReferralsRecord(supplierDetails: any) {
        let referrals = [];
        supplierDetails.invoices.forEach(invoice => {
            invoice.referrals.forEach(element => {
                referrals.push(new Referrals(element.referralNumber, element.totalGst, element.totalAmount, invoice.invoiceNumber));
            })
        });
        supplierDetails.receipts.forEach(receipt => {
            receipt.referrals.forEach(element => {
                referrals.push(new Referrals(receipt.referralNumber, element.totalGst, element.totalAmount, null));
            })
        });
        return referrals;
        //return new Referrals('string', 10, 100, 'string');
    }
}