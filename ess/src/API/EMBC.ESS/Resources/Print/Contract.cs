using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Print
{
    public interface IPrintRequestsRepository
    {
        Task<string> Manage(ManagePrintRequestCommand command);

        Task<IEnumerable<PrintRequest>> Query(QueryPrintRequests query);
    }

    public abstract class ManagePrintRequestCommand
    { }

    public class SavePrintRequest : ManagePrintRequestCommand
    {
        public PrintRequest PrintRequest { get; set; }
    }

    public class MarkPrintRequestAsComplete : ManagePrintRequestCommand
    {
        public string PrintRequestId { get; set; }
    }

    public class QueryPrintRequests
    {
        public string ById { get; set; }
    }

    public abstract class PrintRequest
    {
        public string Id { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class ReferralPrintRequest : PrintRequest
    {
        public string FileId { get; set; }
        public ReferralPrintType Type { get; set; } = ReferralPrintType.New;
        public bool IncludeSummary { get; set; }
        public string Comments { get; set; }
        public IEnumerable<string> SupportIds { get; set; }
        public string RequestingUserId { get; set; }
        public string Title { get; set; }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum ReferralPrintType
    {
        New = 174360000,
        Reprint = 174360001
    }

#pragma warning restore CA1008 // Enums should have zero value
}
