import { Invoices } from './invoices';
import { Referrals } from './referrals';
import { LineItems } from './lineItems';
import { Receipts } from './receipts';

export class Suppliers {
  suppliers: SupplierInformation[];
  receipts: Receipts[];
  invoices: Invoices[];
  referrals: Referrals[];
  lineItems: LineItems[];
  attachments: Attachment[];

  constructor(
    suppliers: SupplierInformation[],
    receipts: Receipts[],
    invoices: Invoices[],
    referrals: Referrals[],
    lineItems: LineItems[],
    attachments: Attachment[]
  ) {
    this.suppliers = suppliers;
    this.receipts = receipts;
    this.invoices = invoices;
    this.referrals = referrals;
    this.lineItems = lineItems;
    this.attachments = attachments;
  }
}

export class SupplierInformation {
  gstNumber: string;
  name: string;
  legalBusinessName: string;
  location: string;
  address: Address;
  contactPerson: ContactPerson;
  forRemittance: boolean;

  constructor(
    gstNumber: string,
    name: string,
    legalBusinessName: string,
    location: string,
    address: Address,
    contactPerson: ContactPerson,
    forRemittance: boolean
  ) {
    this.gstNumber = gstNumber;
    this.name = name;
    this.legalBusinessName = legalBusinessName;
    this.location = location;
    this.address = address;
    this.contactPerson = contactPerson;
    this.forRemittance = forRemittance;
  }
}

export class Address {
  addressLine1: string;
  addressLine2: string;
  cityCode: string;
  city: string;
  stateProvinceCode: string;
  stateProvince: string;
  countryCode: string;
  country: string;
  postalCode: string;

  constructor(
    addressLine1: string,
    addressLine2: string,
    cityCode: string,
    city: string,
    stateProvinceCode: string,
    stateProvince: string,
    countryCode: string,
    country: string,
    postalCode: string
  ) {
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.cityCode = cityCode;
    this.city = city;
    this.stateProvinceCode = stateProvinceCode;
    this.stateProvince = stateProvince;
    this.countryCode = countryCode;
    this.country = country;
    this.postalCode = postalCode;
  }
}

export class ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fax: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    fax: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.fax = fax;
  }
}

export class Attachment {
  content: string;
  contentType: string;
  fileName: string;
  invoiceNumber: string;
  referralNumber: string;
  type: number;

  constructor(
    content: string,
    contentType: string,
    fileName: string,
    invoiceNumber: string,
    referralNumber: string,
    type: number
  ) {
    this.content = content;
    this.contentType = contentType;
    this.fileName = fileName;
    this.invoiceNumber = invoiceNumber;
    this.referralNumber = referralNumber;
    this.type = type;
  }
}
