using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CASInterfaceService.Pages.Models
{
    public class CASAPQuery
    {
        String InvoiceNumber;
        [Required]
        [MaxLength(40)]
        public String invoiceNumber
        {
            get { return InvoiceNumber; }
            set { InvoiceNumber = value; }
        }

        String SupplierNumber;
        [Required]
        [MaxLength(40)]
        public String supplierNumber
        {
            get { return SupplierNumber; }
            set { SupplierNumber = value; }
        }

        String SupplierSiteNumber;
        [Required]
        [MaxLength(40)]
        public String supplierSiteNumber
        {
            get { return SupplierSiteNumber; }
            set { SupplierSiteNumber = value; }
        }
    }
}
