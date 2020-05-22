export class Receipts {
    receiptNumber: string;
    date: string;
    totalGST: number;
    totalAmount: number;
    referralNumber: string;

    constructor(receiptNumber: string, date: string, totalGST: number, totalAmount: number, referralNumber: string) {
            this.receiptNumber= receiptNumber;
            this.date= date;
            this.totalGST= totalGST;
            this.totalAmount= totalAmount;
            this.referralNumber= referralNumber;
        }
}