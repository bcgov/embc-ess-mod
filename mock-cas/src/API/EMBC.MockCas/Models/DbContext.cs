using Microsoft.EntityFrameworkCore;

namespace EMBC.MockCas.Models
{
    public class MockCasDb : DbContext
    {
        public MockCasDb(DbContextOptions options) : base(options) { }
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<InvoiceItem> InvoiceItems { get; set; } = null!;
        public DbSet<GetSupplierResponse> Suppliers { get; set; } = null!;
    }
}
