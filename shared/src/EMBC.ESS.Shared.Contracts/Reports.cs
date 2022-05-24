using System;

namespace EMBC.ESS.Shared.Contracts.Reports
{
    public class EvacueeReportQuery : Query<ReportQueryResult>
    {
        public string TaskNumber { get; set; }
        public string FileId { get; set; }
        public string EvacuatedFrom { get; set; }
        public string EvacuatedTo { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public bool IncludePersonalInfo { get; set; }
    }

    public class SupportReportQuery : Query<ReportQueryResult>
    {
        public string TaskNumber { get; set; }
        public string FileId { get; set; }
        public string EvacuatedFrom { get; set; }
        public string EvacuatedTo { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }

    public class ReportQueryResult
    {
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
    }
}
