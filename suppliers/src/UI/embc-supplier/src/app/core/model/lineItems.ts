export class LineItems {
    supportProvided: string;
    description: string;
    gst: number;
    amount: number;
    receiptNumber: any;
    referralNumber: string;

    constructor(supportProvided: string, description: string, gst: number, amount: number, receiptNumber: any, referralNumber: string) {
        this.supportProvided = supportProvided;
        this.description = description;
        this.gst = 0;
        this.amount = amount;
        this.receiptNumber = receiptNumber;
        this.referralNumber = referralNumber;
    }
}
