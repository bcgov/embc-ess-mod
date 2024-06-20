using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MockCas.Models;

namespace MockCas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly MockCasDb db;

        public InvoicesController(MockCasDb db)
        {
            this.db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Invoice>>> Get()
        {
            var ret = await db.Invoices.ToListAsync();
            foreach (var invoice in ret)
            {
                invoice.InvoiceLineDetails = await db.InvoiceLineDetails.Where(d => d.Invoice.Id == invoice.Id).ToListAsync();
            }
            return ret;
        }

        [HttpGet("items")]
        public async Task<ActionResult<List<InvoiceItem>>> GetInvoiceItems()
        {
            return await db.InvoiceItems.ToListAsync();
        }

        [HttpPost("{invoiceNumber}/payment")]
        public async Task<ActionResult<int>> SetPaymentDate(string invoiceNumber, SetPaymentRequest request)
        {
            var invoice = await db.InvoiceItems.FirstOrDefaultAsync(s => s.Invoicenumber == invoiceNumber);
            if (invoice == null) return NotFound();

            invoice.Paymentdate = request.PaymentDate;
            invoice.Paymentstatus = request.PaymentStatus;
            db.InvoiceItems.Update(invoice);
            await db.SaveChangesAsync();
            return invoice.Id;
        }

        [HttpDelete("{invoiceNumber}")]
        public async Task<ActionResult<int>> DeleteInvoiceByNumber(string invoiceNumber)
        {
            var invoice = db.Invoices.FirstOrDefault(s => s.InvoiceNumber == invoiceNumber);
            if (invoice == null) return NotFound();

            var invoiceItem = await db.InvoiceItems.FirstOrDefaultAsync(item => item.Invoicenumber == invoiceNumber);
            if (invoiceItem != null) db.InvoiceItems.Remove(invoiceItem);

            var details = db.InvoiceLineDetails.Include(d => d.Invoice).Where(d => d.Invoice.Id == invoice.Id).ToList();
            foreach (var detail in details)
            {
                db.InvoiceLineDetails.Remove(detail);
            }
            db.Invoices.Remove(invoice);
            await db.SaveChangesAsync();

            return invoice.Id;
        }
    }

    public class SetPaymentRequest
    {
        public string PaymentDate { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
    }
}