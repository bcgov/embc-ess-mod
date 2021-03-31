using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CASInterfaceService.Pages.Models
{
    public class CASAPTransaction
    {
        String OperatingUnit;
        public String operatingUnit
        {
            get { return OperatingUnit; }
            set { OperatingUnit = value; }
        }

        String InvoiceType;
        [Required]
        [MaxLength(25)]
        public String invoiceType 
        {
            get { return InvoiceType;  }
            set { InvoiceType = value; } 
        }

        String PONumber; // Must be NULL
        public String poNumber
        {
            get { return PONumber;  }
            set { PONumber = null; }
        }

        String SupplierName;
        public String supplierName
        {
            get { return SupplierName;  }
            set { SupplierName = value; }
        }

        String SupplierNumber;
        [Required]
        [MaxLength(30)]
        public String supplierNumber
        {
            get { return SupplierNumber;  }
            set { SupplierNumber = value; }
        }

        String SupplierSiteNumber;
        [Required]
        [MaxLength(3)]
        public String supplierSiteNumber
        {
            get { return SupplierSiteNumber; }
            set { SupplierSiteNumber = value; }
        }

        String InvoiceDate; // Format: 21-FEB-2017
        [Required]
        public String invoiceDate
        {
            get { return InvoiceDate; }
            set { InvoiceDate = value; }
        }

        String InvoiceNumber;
        [Required]
        [MaxLength(40)]
        public String invoiceNumber
        {
            get { return InvoiceNumber; }
            set { InvoiceNumber = value; }
        }

        Decimal InvoiceAmount; // Format: 9(12).99
        [Required]
        public Decimal invoiceAmount
        {
            get { return InvoiceAmount; }
            set { InvoiceAmount = value; }
        }

        String PayGroup;
        [Required]
        [MaxLength(7)]
        public String payGroup
        {
            get { return PayGroup; }
            set { PayGroup = value; }
        }

        String DateInvoiceReceived; // Format: 21-FEB-2017
        [Required]
        public String dateInvoiceReceived
        {
            get { return DateInvoiceReceived; }
            set { DateInvoiceReceived = value; }
        }

        String DateGoodsReceived; // Format: 21-FEB-2017
        public String dateGoodsReceived
        {
            get { return DateGoodsReceived; }
            set { DateGoodsReceived = value; }
        }

        String RemittanceCode;
        [Required]
        [MaxLength(2)]
        public String remittanceCode
        {
            get { return RemittanceCode; }
            set { RemittanceCode = value; }
        }

        String SpecialHandling;
        [Required]
        [MaxLength(1)]
        public String specialHandling
        {
            get { return SpecialHandling; }
            set { SpecialHandling = value; }
        }

        String BankNumber;
        [MaxLength(4)]
        public String bankNumber
        {
            get { return BankNumber; }
            set { BankNumber = value; }
        }

        String BranchNumber;
        [MaxLength(5)]
        public String branchNumber
        {
            get { return BranchNumber; }
            set { BranchNumber = value; }
        }

        String AccountNumber;
        [MaxLength(12)]
        public String accountNumber
        {
            get { return AccountNumber; }
            set { AccountNumber = value; }
        }

        String EFTAdvice;
        [MaxLength(1)]
        public String eftAdviceFlag
        {
            get { return EFTAdvice; }
            set { EFTAdvice = value; }
        }

        String Email;
        [MaxLength(35)]
        public String eftEmailAddress
        {
            get { return Email; }
            set { Email = value; }
        }

        String NameLine1;
        [MaxLength(40)]
        public String nameLine1
        {
            get { return NameLine1; }
            set { NameLine1 = value; }
        }

        String NameLine2;
        [MaxLength(40)]
        public String nameLine2
        {
            get { return NameLine2; }
            set { NameLine2 = value; }
        }

        String AddressLine1;
        [MaxLength(40)]
        public String addressLine1
        {
            get { return AddressLine1; }
            set { AddressLine1 = value; }
        }

        String AddressLine2;
        [MaxLength(40)]
        public String addressLine2
        {
            get { return AddressLine2; }
            set { AddressLine2 = value; }
        }

        String AddressLine3;
        [MaxLength(40)]
        public String addressLine3
        {
            get { return AddressLine3; }
            set { AddressLine3 = value; }
        }

        String City;
        [MaxLength(25)]
        public String city
        {
            get { return City; }
            set { City = value; }
        }

        String Country;
        [MaxLength(2)]
        public String country
        {
            get { return Country; }
            set { Country = value; }
        }

        String Province;
        [MaxLength(2)]
        public String province
        {
            get { return Province; }
            set { Province = value; }
        }

        String PostalCode;
        [MaxLength(10)]
        public String postalCode
        {
            get { return PostalCode; }
            set { PostalCode = value; }
        }

        String QualifiedReceiver;
        [MaxLength(150)]
        public String qualifiedReceiver
        {
            get { return QualifiedReceiver; }
            set { QualifiedReceiver = value; }
        }

        String Terms;
        [Required]
        [MaxLength(50)]
        public String terms
        {
            get { return Terms; }
            set { Terms = value; }
        }

        String PayAloneFlag;
        [Required]
        [MaxLength(1, ErrorMessage = "payAlone must be 'Y' or 'N'")]
        public String payAloneFlag
        {
            get { return PayAloneFlag; }
            set {
                if (value == "")
                {
                    PayAloneFlag = "N";
                }
                else
                {
                    PayAloneFlag = value;
                }
            }
        }

        String PaymentAdviceComments;
        [MaxLength(40)]
        public String paymentAdviceComments
        {
            get { return PaymentAdviceComments; }
            set { PaymentAdviceComments = value; }
        }

        String RemittanceMessage1;
        [MaxLength(150)]
        public String remittanceMessage1
        {
            get { return RemittanceMessage1; }
            set { RemittanceMessage1 = value; }
        }

        String RemittanceMessage2;
        [MaxLength(150)]
        public String remittanceMessage2
        {
            get { return RemittanceMessage2; }
            set { RemittanceMessage2 = value; }
        }

        String RemittanceMessage3;
        [MaxLength(150)]
        public String remittanceMessage3
        {
            get { return RemittanceMessage3; }
            set { RemittanceMessage3 = value; }
        }

        String TermsDate; // Format: 21-FEB-2017
        public String termsDate
        {
            get { return TermsDate; }
            set { TermsDate = value; }
        }

        String GLDate; // Format: 21-FEB-2017
        [Required]
        public String glDate
        {
            get { return GLDate; }
            set { GLDate = value; }
        }

        String InvoiceBatchName;
        [Required]
        [MaxLength(50)]
        public String invoiceBatchName
        {
            get { return InvoiceBatchName; }
            set { InvoiceBatchName = value; }
        }

        String CurrencyCode;
        [Required]
        [MaxLength(3)]
        public String currencyCode
        {
            get { return CurrencyCode; }
            set { CurrencyCode = "CAD"; }
        }

        List<InvoiceLineDetail> InvoiceLineDetails;
        public List<InvoiceLineDetail> invoiceLineDetails
        {
            get { return InvoiceLineDetails; }
            set { InvoiceLineDetails = value; }
        }





        //DateTime glDate; // Format: 21-FEB-2017
        //public DateTime GLDate
        //{
        //    get { return glDate; }
        //    set { glDate = value; }
        //}

        String POReference; 
        public String poReference
        {
            get { return POReference; }
            set { POReference = value; }
        }

        String T4aReportingCode;
        public String t4aReportingCode
        {
            get { return T4aReportingCode; }
            set { T4aReportingCode = value; }
        }

        String T4aInvoiceDate; // Format: 21-FEB-2017
        public String t4aInvoiceDate
        {
            get { return T4aInvoiceDate; }
            set { T4aInvoiceDate = value; }
        }

        String LineSource;
        public String lineSource
        {
            get { return LineSource; }
            set { LineSource = value; }
        }

        String ApprovalStatus;
        public String approvalStatus
        {
            get { return ApprovalStatus; }
            set { ApprovalStatus = value; }
        }

        //String poNumber;
        //public String PONumber
        //{
        //    get { return poNumber; }
        //    set { poNumber = value; }
        //}

        String POLine;
        public String poLine
        {
            get { return POLine; }
            set { POLine = value; }
        }

        String POShipment;
        public String poShipment
        {
            get { return POShipment; }
            set { POShipment = value; }
        }

        String PODistribution;
        public String poDistribution
        {
            get { return PODistribution; }
            set { PODistribution = value; }
        }

        String TrackAsAsset;
        public String trackAsAsset
        {
            get { return TrackAsAsset; }
            set { TrackAsAsset = value; }
        }

        String AssetBook;
        public String assetBook
        {
            get { return AssetBook; }
            set { AssetBook = value; }
        }

        String QuantityInvoiced;
        public String quantityInvoiced
        {
            get { return QuantityInvoiced; }
            set { QuantityInvoiced = value; }
        }

        //String lineSource;
        //public String LineSource
        //{
        //    get { return lineSource; }
        //    set { lineSource = value; }
        //}

        String ExpenditureItemDate; // Format: 21-FEB-2017
        public String expenditureItemDate
        {
            get { return ExpenditureItemDate; }
            set { ExpenditureItemDate = value; }
        }

        String UOM;
        public String uom
        {
            get { return UOM; }
            set { UOM = value; }
        }

        Decimal UnitPrice; // Format: 9(12).99
        public Decimal unitPrice
        {
            get { return UnitPrice; }
            set { UnitPrice = value; }
        }

        String ItemDescription;
        public String itemDescription
        {
            get { return ItemDescription; }
            set { ItemDescription = value; }
        }

        //String approvalStatus;
        //public String ApprovalStatus
        //{
        //    get { return approvalStatus; }
        //    set { approvalStatus = value; }
        //}
    }




    //public class InvoiceLineDetail:IValidatableObject
    //{
    //    Int32 invoiceLineNumber;
    //    [Required]
    //    public Int32 InvoiceLineNumber
    //    {
    //        get { return invoiceLineNumber; }
    //        set { invoiceLineNumber = value; }
    //    }

    //    String invoiceLineType;
    //    [Required]
    //    [MaxLength(4, ErrorMessage = "invoiceLineType must be 'Item'")]
    //    public String InvoiceLineType
    //    {
    //        get { return invoiceLineType; }
    //        set { invoiceLineType = "Item"; }
    //    }

    //    String distributionTotal; // Must be NULL
    //    public String DistributionTotal
    //    {
    //        get { return distributionTotal; }
    //        set { distributionTotal = null; }
    //    }

    //    String lineCode;
    //    [Required]
    //    [MaxLength(2, ErrorMessage = "lineCode must be 'DR' or 'CR'")]
    //    public String LineCode
    //    {
    //        get { return lineCode; }
    //        set { lineCode = value; }
    //    }

    //    Decimal invoiceLineAmount; // Format: 9(12).99
    //    [Required]
    //    public Decimal InvoiceLineAmount
    //    {
    //        get { return invoiceLineAmount; }
    //        set { invoiceLineAmount = value; }
    //    }

    //    String defaultDistributionAccount;
    //    [Required]
    //    [MaxLength(40)]
    //    public String DefaultDistributionAccount
    //    {
    //        get { return defaultDistributionAccount; }
    //        set { defaultDistributionAccount = value; }
    //    }

    //    String description;
    //    public String Description
    //    {
    //        get { return description; }
    //        set { description = value; }
    //    }

    //    String taxClassificationCode;
    //    [MaxLength(30)]
    //    public String TaxClassificationCode
    //    {
    //        get { return taxClassificationCode; }
    //        set { taxClassificationCode = value; }
    //    }

    //    String distributionSupplier;
    //    [MaxLength(30)]
    //    public String DistributionSupplier
    //    {
    //        get { return distributionSupplier; }
    //        set { distributionSupplier = value; }
    //    }

    //    String info1;
    //    [MaxLength(25)]
    //    public String Info1
    //    {
    //        get { return info1; }
    //        set { info1 = value; }
    //    }

    //    String info2;
    //    [MaxLength(10)]
    //    public String Info2
    //    {
    //        get { return info2; }
    //        set { info2 = value; }
    //    }

    //    String info3;
    //    [MaxLength(8)]
    //    public String Info3
    //    {
    //        get { return info3; }
    //        set { info3 = value; }
    //    }

    //    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    //    {
    //        if (!(LineCode == "DR" || LineCode == "CR"))
    //        {
    //            yield return new ValidationResult("Invalid LineCode");
    //        }
    //    }
    //}

    //public class UpdateCASAPTransaction
    //{
    //    String invoiceNumber;
    //    [Required]
    //    [MaxLength(40)]
    //    public String InvoiceNumber
    //    {
    //        get { return invoiceNumber; }
    //        set { invoiceNumber = value; }
    //    }

    //    String invoiceStatus;
    //    public string InvoiceStatus
    //    {
    //        get { return invoiceStatus; }
    //        set { invoiceStatus = value; }
    //    }

    //    String paymentStatus;
    //    public string PaymentStatus
    //    {
    //        get { return paymentStatus; }
    //        set { paymentStatus = value; }
    //    }

    //    Double paymentNumber;
    //    public Double PaymentNumber
    //    {
    //        get { return paymentNumber;  }
    //        set { paymentNumber = value; }
    //    }

    //    DateTime paymentDate;
    //    public DateTime PaymentDate
    //    {
    //        get { return paymentDate; }
    //        set { paymentDate = value; }
    //    }
    //}
}
