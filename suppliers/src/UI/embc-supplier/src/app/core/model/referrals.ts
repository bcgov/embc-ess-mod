export class Referrals {
    referralNumber: string;
    totalGST: number;
    totalAmount: number;
    invoiceNumber: string;

    constructor(referralNumber: string, totalGST: number, totalAmount: number, invoiceNumber: string) {
        this.referralNumber = referralNumber;
        this.totalGST = totalGST;
        this.totalAmount = totalAmount;
        this.invoiceNumber = invoiceNumber;
    }
}
