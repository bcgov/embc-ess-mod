using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CASInterfaceService.Pages.Models
{
    public class CASAPTransactionRegistrationReply
    {
        String name;
        public String Name
        {
            get { return name; }
            set { name = value; }
        }
        String registrationNumber;
        public String RegistrationNumber
        {
            get { return registrationNumber; }
            set { registrationNumber = value; }
        }
        String registrationStatus;
        public String RegistrationStatus
        {
            get { return registrationStatus; }
            set { registrationStatus = value; }
        }
    }
}