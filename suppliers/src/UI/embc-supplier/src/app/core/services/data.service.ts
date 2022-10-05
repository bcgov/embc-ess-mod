import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  Suppliers,
  ContactPerson,
  SupplierInformation,
  Address,
  Attachment
} from '../model/suppliers';
import { Invoices } from '../model/invoices';
import { LineItems } from '../model/lineItems';
import { Referrals } from '../model/referrals';
import { Receipts } from '../model/receipts';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  supplierForm: UntypedFormGroup;
  isReload = false;
  private payLoad: Suppliers;

  constructor() {}

  getPayload() {
    return this.payLoad;
  }

  createPayload(supplierDetails: any) {
    const contact = this.createContactRecord(supplierDetails);
    const address = this.createAddressRecord(supplierDetails);
    const supplierInformation = this.createSupplierInformationRecord(
      supplierDetails,
      contact,
      address,
      false
    );
    let remitSupplierInformation = null;
    if (supplierDetails.remitToOtherBusiness) {
      const remittanceAddress = this.createRemitAddressRecord(supplierDetails);
      remitSupplierInformation = this.createSupplierRemitInformationRecord(
        supplierDetails,
        contact,
        remittanceAddress,
        true
      );
    }
    const supplierInformationArr = [supplierInformation];
    if (remitSupplierInformation) {
      supplierInformationArr.push(remitSupplierInformation);
    }

    const invoices = this.createInvoiceRecord(supplierDetails);
    const lineItems = this.createLineItemsRecord(supplierDetails);
    const attachments = this.createAttachmentsRecord(supplierDetails);
    const referrals = this.createReferralsRecord(supplierDetails);
    const receipts = this.createReceiptslRecord(supplierDetails);
    const suppliers: Suppliers = new Suppliers(
      supplierInformationArr,
      receipts,
      invoices,
      referrals,
      lineItems,
      attachments
    );
    this.setPayload(suppliers);
  }

  clearPayload() {
    this.setPayload(new Suppliers(null, null, null, null, null, null));
  }

  createContactRecord(supplierDetails: any) {
    return new ContactPerson(
      supplierDetails.contactPerson.firstName,
      supplierDetails.contactPerson.lastName,
      supplierDetails.contactPerson.email,
      supplierDetails.contactPerson.phone,
      supplierDetails.contactPerson.fax
    );
  }

  createAddressRecord(supplierDetails: any) {
    return new Address(
      supplierDetails.address.address1,
      supplierDetails.address.address2,
      supplierDetails.address.city.code,
      supplierDetails.address.city.name,
      supplierDetails.address.province.code,
      supplierDetails.address.province.name,
      supplierDetails.address.country.code,
      supplierDetails.address.country.name,
      supplierDetails.address.postalCode
    );
  }

  createRemitAddressRecord(supplierDetails: any) {
    if (supplierDetails.businessCountry.code === 'CAN') {
      let provinceName = '';
      let provinceCode = '';

      if (
        supplierDetails.remittanceAddress.province === '' ||
        supplierDetails.remittanceAddress.province === null
      ) {
        provinceName = 'British Columbia';
        provinceCode = 'BC';
      } else {
        provinceName = supplierDetails.remittanceAddress.province.name;
        provinceCode = supplierDetails.remittanceAddress.province.code;
      }

      return new Address(
        supplierDetails.remittanceAddress.address1,
        supplierDetails.remittanceAddress.address2,
        null,
        supplierDetails.remittanceAddress.city,
        provinceCode,
        provinceName,
        supplierDetails.businessCountry.code,
        supplierDetails.businessCountry.name,
        supplierDetails.remittanceAddress.postalCode
      );
    } else if (supplierDetails.businessCountry.code === 'USA') {
      return new Address(
        supplierDetails.remittanceAddress.address1,
        supplierDetails.remittanceAddress.address2,
        null,
        supplierDetails.remittanceAddress.city,
        supplierDetails.remittanceAddress.state.code,
        supplierDetails.remittanceAddress.state.name,
        supplierDetails.businessCountry.code,
        supplierDetails.businessCountry.name,
        supplierDetails.remittanceAddress.zipCode
      );
    } else {
      return new Address(
        supplierDetails.remittanceAddress.address1,
        supplierDetails.remittanceAddress.address2,
        null,
        supplierDetails.remittanceAddress.city,
        null,
        supplierDetails.remittanceAddress.region,
        supplierDetails.businessCountry.code,
        supplierDetails.businessCountry.name,
        supplierDetails.remittanceAddress.otherCode
      );
    }
  }

  createSupplierInformationRecord(
    supplierDetails: any,
    contact: ContactPerson,
    address: Address,
    remit: boolean
  ) {
    return new SupplierInformation(
      supplierDetails.gstNumber,
      supplierDetails.supplierName,
      supplierDetails.supplierLegalName,
      supplierDetails.location,
      address,
      contact,
      remit
    );
  }

  createSupplierRemitInformationRecord(
    supplierDetails: any,
    contact: ContactPerson,
    address: Address,
    remit: boolean
  ) {
    return new SupplierInformation(
      supplierDetails.gstNumber,
      supplierDetails.supplierName,
      supplierDetails.businessName,
      supplierDetails.location,
      address,
      contact,
      remit
    );
  }

  createInvoiceRecord(supplierDetails: any) {
    const invoices = [];
    supplierDetails.invoices.forEach((element) => {
      const invDate = new Date(element.invoiceDate);
      const formattedDate = invDate.toISOString();
      invoices.push(
        new Invoices(
          element.invoiceNumber,
          formattedDate,
          +element.invoiceTotalAmount
        )
      );
    });
    return invoices;
  }

  createReceiptslRecord(supplierDetails: any) {
    const receipts = [];
    supplierDetails.receipts.forEach((element) => {
      element.referrals.forEach((ref) => {
        const formattedDate = new DatePipe('en-US').transform(
          ref.referralDate,
          'yyyy-MM-dd'
        );
        receipts.push(
          new Receipts(
            ref.receiptNumber,
            formattedDate,
            +ref.totalAmount,
            element.referralNumber
          )
        );
      });
    });
    return receipts;
  }

  createLineItemsRecord(supplierDetails: any) {
    const lineItems = [];
    supplierDetails.invoices.forEach((invoice) => {
      invoice.referrals.forEach((ref) => {
        ref.referralRows.forEach((element) => {
          lineItems.push(
            new LineItems(
              element.supportProvided.name,
              element.description,
              +element.amount,
              null,
              ref.referralNumber
            )
          );
        });
      });
    });
    supplierDetails.receipts.forEach((receipt) => {
      receipt.referrals.forEach((ref) => {
        ref.referralRows.forEach((element) => {
          lineItems.push(
            new LineItems(
              element.supportProvided.name,
              element.description,
              +element.amount,
              ref.receiptNumber,
              receipt.referralNumber
            )
          );
        });
      });
    });
    return lineItems;
  }

  createAttachmentsRecord(supplierDetails: any) {
    const attachments = [];
    if (supplierDetails.invoices.length > 0) {
      supplierDetails.invoices.forEach((invoice) => {
        invoice.invoiceAttachments.forEach((e) => {
          attachments.push(
            new Attachment(
              e.file.substring(e.file.indexOf(',') + 1),
              e.contentType,
              e.fileName,
              invoice.invoiceNumber,
              null,
              2
            )
          );
        });
        invoice.referrals.forEach((ref) => {
          ref.referralAttachments.forEach((e) => {
            attachments.push(
              new Attachment(
                e.file.substring(e.file.indexOf(',') + 1),
                e.contentType,
                e.fileName,
                invoice.invoiceNumber,
                ref.referralNumber,
                1
              )
            );
          });
          ref.receiptAttachments.forEach((e) => {
            attachments.push(
              new Attachment(
                e.file.substring(e.file.indexOf(',') + 1),
                e.contentType,
                e.fileName,
                invoice.invoiceNumber,
                ref.referralNumber,
                0
              )
            );
          });
        });
      });
    } else if (supplierDetails.receipts.length > 0) {
      supplierDetails.receipts.forEach((ref) => {
        ref.referralAttachments.forEach((e) => {
          attachments.push(
            new Attachment(
              e.file.substring(e.file.indexOf(',') + 1),
              e.contentType,
              e.fileName,
              null,
              ref.referralNumber,
              1
            )
          );
        });
        ref.receiptAttachments.forEach((e) => {
          attachments.push(
            new Attachment(
              e.file.substring(e.file.indexOf(',') + 1),
              e.contentType,
              e.fileName,
              null,
              ref.referralNumber,
              1
            )
          );
        });
      });
    }

    return attachments;
  }

  createReferralsRecord(supplierDetails: any) {
    const referrals = [];
    supplierDetails.invoices.forEach((invoice) => {
      invoice.referrals.forEach((element) => {
        referrals.push(
          new Referrals(
            element.referralNumber,
            +element.totalAmount,
            invoice.invoiceNumber
          )
        );
      });
    });
    supplierDetails.receipts.forEach((receipt) => {
      referrals.push(
        new Referrals(receipt.referralNumber, +receipt.receiptTotalAmount, null)
      );
    });
    return referrals;
  }

  private setPayload(payLoad: Suppliers) {
    this.payLoad = payLoad;
  }
}
