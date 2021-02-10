export class Invoices {
        invoiceNumber: string;
        date: string;
        totalGST: number;
        totalAmount: number;

        constructor(invoiceNumber: string, date: string, totalGST: number, totalAmount: number) {
                this.invoiceNumber = invoiceNumber;
                this.date = date;
                this.totalGST = totalGST;
                this.totalAmount = totalAmount;
        }
}
