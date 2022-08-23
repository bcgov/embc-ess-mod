using EMBC.MockCas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EMBC.MockCas.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly ILogger<InvoicesController> _logger;
        private readonly MockCasDb db;

        public InvoicesController(ILogger<InvoicesController> logger, MockCasDb db)
        {
            _logger = logger;
            this.db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Invoice>>> Get()
        {
            return await db.Invoices.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<InvoiceResponse>> CreateInvoice(Invoice invoice)
        {
            await db.Invoices.AddAsync(invoice);
            var item = CreateItemFromInvoice(invoice);
            item.Invoicecreationdate = DateTime.UtcNow;
            await db.InvoiceItems.AddAsync(item);
            var response = new InvoiceResponse
            {
                InvoiceNumber = invoice.InvoiceNumber,
                CASReturnedMessages = "SUCCEEDED"
            };
            await db.SaveChangesAsync();
            return await Task.FromResult(response);

        }

        private InvoiceItem CreateItemFromInvoice(Invoice invoice)
        {
            var invoiceItem = new InvoiceItem
            {
                Invoicenumber = invoice.InvoiceNumber,
                Suppliernumber = invoice.SupplierNumber,
                Sitecode = "001",
                Invoicecreationdate = invoice.InvoiceDate,
                Paymentnumber = 123,
                Paygroup = invoice.PayGroup,
                Paymentdate = invoice.DateInvoiceReceived,
                Paymentamount = invoice.InvoiceAmount,
                Paymentstatus = "NEGOTIABLE",
                Paymentstatusdate = DateTime.UtcNow,
            };

            return invoiceItem;
        }
    }
}
