import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Suppliers, ContactPerson, SupplierInformation, Address, Attachment } from '../model/suppliers';
import { Invoices } from '../model/invoices';
import { LineItems } from '../model/lineItems';
import { Referrals } from '../model/referrals';
import { Receipts } from '../model/receipts';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    supplierForm: FormGroup;
    isReload: boolean = false;
    private payLoad: Suppliers;

    constructor(private builder: FormBuilder) {}

    private setPayload(payLoad: Suppliers) {
        this.payLoad = payLoad
    }

    getPayload() {
        return this.payLoad;
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
        if (supplierDetails.businessCountry.code === 'CAN') {
            let provinceName = '';
            let provinceCode = '';

            if (supplierDetails.remittanceAddress.province === '' || supplierDetails.remittanceAddress.province === null)  {
                provinceName = "British Columbia";
                provinceCode = "BC"
            } else {
                provinceName = supplierDetails.remittanceAddress.province.name;
                provinceCode = supplierDetails.remittanceAddress.province.code;
            }

            return new Address(supplierDetails.remittanceAddress.address1, supplierDetails.remittanceAddress.address2, null, supplierDetails.remittanceAddress.city,
                provinceCode, provinceName, supplierDetails.businessCountry.code, supplierDetails.businessCountry.name,
                supplierDetails.remittanceAddress.postalCode);

        } else if (supplierDetails.businessCountry.code === 'USA') {
            return new Address(supplierDetails.remittanceAddress.address1, supplierDetails.remittanceAddress.address2, null, supplierDetails.remittanceAddress.city,
                supplierDetails.remittanceAddress.state.code, supplierDetails.remittanceAddress.state.name, supplierDetails.businessCountry.code, supplierDetails.businessCountry.name,
                supplierDetails.remittanceAddress.zipCode);

        } else {
            return new Address(supplierDetails.remittanceAddress.address1, supplierDetails.remittanceAddress.address2, null, supplierDetails.remittanceAddress.city,
                null, supplierDetails.remittanceAddress.region, supplierDetails.businessCountry.code, supplierDetails.businessCountry.name,
                supplierDetails.remittanceAddress.otherCode);
        }
    }

    createSupplierInformationRecord(supplierDetails: any, contact: ContactPerson, address: Address, remit: boolean) {
        return new SupplierInformation(supplierDetails.gstNumber, supplierDetails.supplierName, supplierDetails.supplierLegalName,
            supplierDetails.location, address, contact, remit);
    }

    createSupplierRemitInformationRecord(supplierDetails: any, contact: ContactPerson, address: Address, remit: boolean) {
        return new SupplierInformation(supplierDetails.gstNumber, supplierDetails.supplierName, supplierDetails.businessName,
            supplierDetails.location, address, contact, remit);
    }

    createInvoiceRecord(supplierDetails: any) {
        let invoices = [];
        supplierDetails.invoices.forEach(element => {
            let formattedDate = new DatePipe('en-US').transform(element.invoiceDate, 'yyyy-MM-dd');
            invoices.push(new Invoices(element.invoiceNumber, formattedDate, element.invoiceTotalGst, element.invoiceTotalAmount))
        });
        return invoices;
    }

    createReceiptslRecord(supplierDetails: any) {
        let receipts = [];
        supplierDetails.receipts.forEach(element => {
            element.referrals.forEach(ref => {
                let formattedDate = new DatePipe('en-US').transform(ref.referralDate, 'yyyy-MM-dd');
                receipts.push(new Receipts(ref.receiptNumber, formattedDate, ref.totalGst, ref.totalAmount, element.referralNumber))
            })
        });
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
    }

    createAttachmentsRecord(supplierDetails: any) {
        let attachments = [];
        if (supplierDetails.invoices.length > 0) {
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
        } else if (supplierDetails.receipts.length > 0) {
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
    }

    createReferralsRecord(supplierDetails: any) {
        let referrals = [];
        supplierDetails.invoices.forEach(invoice => {
            invoice.referrals.forEach(element => {
                referrals.push(new Referrals(element.referralNumber, element.totalGst, element.totalAmount, invoice.invoiceNumber));
            })
        });
        supplierDetails.receipts.forEach(receipt => {
                referrals.push(new Referrals(receipt.referralNumber, receipt.receiptTotalGst, receipt.receiptTotalAmount, null));
        });
        return referrals;
    }
   
}