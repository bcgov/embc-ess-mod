using System.Collections.Generic;

namespace CASInterfaceService.Pages.Models
{
    public class CASAPQueryRegistration
    {
        List<CASAPQuery> casAPQueryList;
        static CASAPQueryRegistration casregd = null;

        private CASAPQueryRegistration()
        {
            casAPQueryList = new List<CASAPQuery>();
        }

        public static CASAPQueryRegistration getInstance()
        {
            if (casregd == null)
            {
                casregd = new CASAPQueryRegistration();
                return casregd;
            }
            else
            {
                return casregd;
            }
        }

        public void Add(CASAPQuery casapQuery)
        {
            casAPQueryList.Add(casapQuery);
        }

        public List<CASAPQuery> getAllCASAPQuery()
        {
            return casAPQueryList;
        }

        public List<CASAPQuery> getUpdateCASAPQuery()
        {
            return casAPQueryList;
        }
    }
}
