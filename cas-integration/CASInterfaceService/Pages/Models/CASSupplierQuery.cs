using System;
using System.ComponentModel.DataAnnotations;

namespace CASInterfaceService.Pages.Models
{
    public class CASSupplierQuery
    {
        String SupplierNumber;
        [MaxLength(40)]
        public String supplierNumber
        {
            get { return SupplierNumber; }
            set { SupplierNumber = value; }
        }

        String SupplierSiteNumber;
        [MaxLength(40)]
        public String supplierSiteNumber
        {
            get { return SupplierSiteNumber; }
            set { SupplierSiteNumber = value; }
        }

        String SupplierName;
        [MaxLength(40)]
        public String supplierName
        {
            get { return SupplierName; }
            set { SupplierName = value; }
        }

        String PostalCode;
        [MaxLength(10)]
        public String postalCode
        {
            get { return PostalCode; }
            set { PostalCode = value; }
        }
    }
}
