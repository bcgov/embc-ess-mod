namespace EMBC.ESS.Shared.Contracts.Reports
{
    public class EvacueeReportQuery : Query<ReportQueryResult>
    {
        public string TaskNumber { get; set; }
        public string FileId { get; set; }
        public string EvacuatedFrom { get; set; }
        public string EvacuatedTo { get; set; }
        public string TimePeriod { get; set; }
        public bool IncludePersonalInfo { get; set; }
    }

    public class SupportReportQuery : Query<ReportQueryResult>
    {
        public string TaskNumber { get; set; }
        public string FileId { get; set; }
        public string EvacuatedFrom { get; set; }
        public string EvacuatedTo { get; set; }
        public string TimePeriod { get; set; }
    }

    public class ReportQueryResult
    {
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
    }
}
