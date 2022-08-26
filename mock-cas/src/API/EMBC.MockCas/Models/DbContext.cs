using Microsoft.EntityFrameworkCore;

namespace EMBC.MockCas.Models
{
    public class MockCasDb : DbContext
    {
        public MockCasDb(DbContextOptions options) : base(options) { }
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<InvoiceItem> InvoiceItems { get; set; } = null!;
        public DbSet<InvoiceLineDetail> InvoiceLineDetails { get; set; } = null!;
        public DbSet<GetSupplierResponse> Suppliers { get; set; } = null!;
        public DbSet<Supplieraddress> SupplierAddress { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Invoice>()
                .HasMany(c => c.InvoiceLineDetails)
                .WithOne(e => e.Invoice);

            modelBuilder.Entity<GetSupplierResponse>()
                .HasMany(c => c.SupplierAddress)
                .WithOne(e => e.Supplier);
        }
    }

}
