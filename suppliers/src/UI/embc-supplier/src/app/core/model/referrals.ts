export class Referrals {
  referralNumber: string;
  totalAmount: number;
  invoiceNumber: string;

  constructor(
    referralNumber: string,
    totalAmount: number,
    invoiceNumber: string
  ) {
    this.referralNumber = referralNumber;
    this.totalAmount = totalAmount;
    this.invoiceNumber = invoiceNumber;
  }
}
