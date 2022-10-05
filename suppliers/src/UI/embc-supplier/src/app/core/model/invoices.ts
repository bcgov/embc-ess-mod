export class Invoices {
  invoiceNumber: string;
  date: string;
  totalAmount: number;

  constructor(invoiceNumber: string, date: string, totalAmount: number) {
    this.invoiceNumber = invoiceNumber;
    this.date = date;
    this.totalAmount = totalAmount;
  }
}
