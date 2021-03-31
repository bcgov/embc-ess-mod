using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CASInterfaceService.Pages.Models
{
    public class InvoiceLineDetail:IValidatableObject
    {
        Int32 InvoiceLineNumber;
        [Required]
        public Int32 invoiceLineNumber
        {
            get { return InvoiceLineNumber; }
            set { InvoiceLineNumber = value; }
        }

        String InvoiceLineType;
        [Required]
        [MaxLength(4, ErrorMessage = "invoiceLineType must be 'Item'")]
        public String invoiceLineType
        {
            get { return InvoiceLineType; }
            set { InvoiceLineType = "Item"; }
        }

        String DistributionTotal; // Must be NULL
        public String distributionTotal
        {
            get { return DistributionTotal; }
            set { DistributionTotal = null; }
        }

        String LineCode;
        [Required]
        [MaxLength(2, ErrorMessage = "lineCode must be 'DR' or 'CR'")]
        public String lineCode
        {
            get { return LineCode; }
            set { LineCode = value; }
        }

        Decimal InvoiceLineAmount; // Format: 9(12).99
        [Required]
        public Decimal invoiceLineAmount
        {
            get { return InvoiceLineAmount; }
            set { InvoiceLineAmount = value; }
        }

        String DefaultDistributionAccount;
        [Required]
        [MaxLength(40)]
        public String defaultDistributionAccount
        {
            get { return DefaultDistributionAccount; }
            set { DefaultDistributionAccount = value; }
        }

        String Description;
        public String description
        {
            get { return Description; }
            set { Description = value; }
        }

        String TaxClassificationCode;
        [MaxLength(30)]
        public String taxClassificationCode
        {
            get { return TaxClassificationCode; }
            set { TaxClassificationCode = value; }
        }

        String DistributionSupplier;
        [MaxLength(30)]
        public String distributionSupplier
        {
            get { return DistributionSupplier; }
            set { DistributionSupplier = value; }
        }

        String Info1;
        [MaxLength(25)]
        public String info1
        {
            get { return Info1; }
            set { Info1 = value; }
        }

        String Info2;
        [MaxLength(10)]
        public String info2
        {
            get { return Info2; }
            set { Info2 = value; }
        }

        String Info3;
        [MaxLength(8)]
        public String info3
        {
            get { return Info3; }
            set { Info3 = value; }
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (!(lineCode == "DR" || lineCode == "CR"))
            {
                yield return new ValidationResult("Invalid LineCode");
            }
        }
    }
}
