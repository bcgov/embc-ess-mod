export class Receipts {
  receiptNumber: string;
  date: string;
  totalAmount: number;
  referralNumber: string;

  constructor(
    receiptNumber: string,
    date: string,
    totalAmount: number,
    referralNumber: string
  ) {
    this.receiptNumber = receiptNumber;
    this.date = date;
    this.totalAmount = totalAmount;
    this.referralNumber = referralNumber;
  }
}
