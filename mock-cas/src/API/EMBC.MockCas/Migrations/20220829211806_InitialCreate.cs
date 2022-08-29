using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMBC.MockCas.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InvoiceItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Invoicenumber = table.Column<string>(type: "TEXT", nullable: false),
                    Suppliernumber = table.Column<string>(type: "TEXT", nullable: false),
                    Sitecode = table.Column<string>(type: "TEXT", nullable: false),
                    Invoicecreationdate = table.Column<string>(type: "TEXT", nullable: false),
                    Paymentnumber = table.Column<int>(type: "INTEGER", nullable: true),
                    Paygroup = table.Column<string>(type: "TEXT", nullable: true),
                    Paymentdate = table.Column<string>(type: "TEXT", nullable: true),
                    Paymentamount = table.Column<decimal>(type: "TEXT", nullable: true),
                    Paymentstatus = table.Column<string>(type: "TEXT", nullable: true),
                    Paymentstatusdate = table.Column<string>(type: "TEXT", nullable: true),
                    Cleareddate = table.Column<string>(type: "TEXT", nullable: true),
                    voiddate = table.Column<string>(type: "TEXT", nullable: true),
                    Voidreason = table.Column<string>(type: "TEXT", nullable: true),
                    Systemdate = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    InvoiceType = table.Column<string>(type: "TEXT", nullable: false),
                    SupplierNumber = table.Column<string>(type: "TEXT", nullable: false),
                    SupplierSiteNumber = table.Column<string>(type: "TEXT", nullable: false),
                    InvoiceDate = table.Column<string>(type: "TEXT", nullable: false),
                    InvoiceNumber = table.Column<string>(type: "TEXT", nullable: false),
                    InvoiceAmount = table.Column<decimal>(type: "TEXT", nullable: false),
                    PayGroup = table.Column<string>(type: "TEXT", nullable: false),
                    DateInvoiceReceived = table.Column<string>(type: "TEXT", nullable: false),
                    DateGoodsReceived = table.Column<string>(type: "TEXT", nullable: true),
                    RemittanceCode = table.Column<string>(type: "TEXT", nullable: false),
                    SpecialHandling = table.Column<string>(type: "TEXT", nullable: false),
                    NameLine1 = table.Column<string>(type: "TEXT", nullable: true),
                    NameLine2 = table.Column<string>(type: "TEXT", nullable: true),
                    AddressLine1 = table.Column<string>(type: "TEXT", nullable: true),
                    AddressLine2 = table.Column<string>(type: "TEXT", nullable: true),
                    AddressLine3 = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    Province = table.Column<string>(type: "TEXT", nullable: true),
                    PostalCode = table.Column<string>(type: "TEXT", nullable: true),
                    EftAdviceFlag = table.Column<string>(type: "TEXT", nullable: true),
                    QualifiedReceiver = table.Column<string>(type: "TEXT", nullable: true),
                    Terms = table.Column<string>(type: "TEXT", nullable: false),
                    PayAloneFlag = table.Column<string>(type: "TEXT", nullable: false),
                    PaymentAdviceComments = table.Column<string>(type: "TEXT", nullable: true),
                    RemittanceMessage1 = table.Column<string>(type: "TEXT", nullable: false),
                    RemittanceMessage2 = table.Column<string>(type: "TEXT", nullable: false),
                    RemittanceMessage3 = table.Column<string>(type: "TEXT", nullable: true),
                    GlDate = table.Column<string>(type: "TEXT", nullable: false),
                    InvoiceBatchName = table.Column<string>(type: "TEXT", nullable: false),
                    CurrencyCode = table.Column<string>(type: "TEXT", nullable: false),
                    InteracEmail = table.Column<string>(type: "TEXT", nullable: true),
                    InteracMobileCountryCode = table.Column<string>(type: "TEXT", nullable: true),
                    InteracMobileNumber = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Suppliernumber = table.Column<string>(type: "TEXT", nullable: false),
                    Suppliername = table.Column<string>(type: "TEXT", nullable: false),
                    Subcategory = table.Column<string>(type: "TEXT", nullable: true),
                    Sin = table.Column<string>(type: "TEXT", nullable: true),
                    Providerid = table.Column<string>(type: "TEXT", nullable: true),
                    Businessnumber = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: true),
                    Supplierprotected = table.Column<string>(type: "TEXT", nullable: true),
                    Standardindustryclassification = table.Column<string>(type: "TEXT", nullable: true),
                    Lastupdated = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceLineDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    InvoiceId = table.Column<int>(type: "INTEGER", nullable: true),
                    InvoiceLineNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    InvoiceLineType = table.Column<string>(type: "TEXT", nullable: false),
                    LineCode = table.Column<string>(type: "TEXT", nullable: false),
                    InvoiceLineAmount = table.Column<decimal>(type: "TEXT", nullable: false),
                    DefaultDistributionAccount = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    TaxClassificationCode = table.Column<string>(type: "TEXT", nullable: true),
                    DistributionSupplier = table.Column<string>(type: "TEXT", nullable: true),
                    Info1 = table.Column<string>(type: "TEXT", nullable: true),
                    Info2 = table.Column<string>(type: "TEXT", nullable: true),
                    Info3 = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceLineDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceLineDetails_Invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoices",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SupplierAddress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SupplierId = table.Column<int>(type: "INTEGER", nullable: true),
                    Suppliersitecode = table.Column<string>(type: "TEXT", nullable: false),
                    AddressLine1 = table.Column<string>(type: "TEXT", nullable: true),
                    AddressLine2 = table.Column<string>(type: "TEXT", nullable: true),
                    AddressLine3 = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    Province = table.Column<string>(type: "TEXT", nullable: true),
                    Country = table.Column<string>(type: "TEXT", nullable: true),
                    PostalCode = table.Column<string>(type: "TEXT", nullable: true),
                    EmailAddress = table.Column<string>(type: "TEXT", nullable: true),
                    AccountNumber = table.Column<string>(type: "TEXT", nullable: true),
                    BranchNumber = table.Column<string>(type: "TEXT", nullable: true),
                    BankNumber = table.Column<string>(type: "TEXT", nullable: true),
                    EftAdvicePref = table.Column<string>(type: "TEXT", nullable: true),
                    ProviderId = table.Column<string>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: true),
                    SiteProtected = table.Column<string>(type: "TEXT", nullable: true),
                    LastUpdated = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierAddress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupplierAddress_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineDetails_InvoiceId",
                table: "InvoiceLineDetails",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierAddress_SupplierId",
                table: "SupplierAddress",
                column: "SupplierId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceItems");

            migrationBuilder.DropTable(
                name: "InvoiceLineDetails");

            migrationBuilder.DropTable(
                name: "SupplierAddress");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "Suppliers");
        }
    }
}
