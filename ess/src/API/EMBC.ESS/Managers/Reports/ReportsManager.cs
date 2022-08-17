using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Reports;
using EMBC.ESS.Shared.Contracts.Reports;
using EMBC.Utilities.Csv;

namespace EMBC.ESS.Managers.Reports
{
    public class ReportsManager
    {
        private readonly IMapper mapper;
        private readonly IReportRepository reportRepository;
        private readonly IMetadataRepository metadataRepository;

        public ReportsManager(
            IMapper mapper,
            IReportRepository reportRepository,
            IMetadataRepository metadataRepository)
        {
            this.mapper = mapper;
            this.reportRepository = reportRepository;
            this.metadataRepository = metadataRepository;
        }

        public async Task<ReportQueryResult> Handle(EvacueeReportQuery query)
        {
            var evacueeQuery = new ReportQuery
            {
                FileId = query.FileId,
                TaskNumber = query.TaskNumber,
                EvacuatedFrom = query.EvacuatedFrom,
                EvacuatedTo = query.EvacuatedTo,
                StartDate = query.From,
                EndDate = query.To,
            };

            var results = (await reportRepository.QueryEvacuee(evacueeQuery)).Items;
            var evacuees = mapper.Map<IEnumerable<Evacuee>>(results, opt => opt.Items["IncludePersonalInfo"] = query.IncludePersonalInfo.ToString());

            var communities = await metadataRepository.GetCommunities();
            evacueeQuery.EvacuatedFrom = communities.SingleOrDefault(c => c.Code == evacueeQuery.EvacuatedFrom)?.Name;
            evacueeQuery.EvacuatedTo = communities.SingleOrDefault(c => c.Code == evacueeQuery.EvacuatedTo)?.Name;

            var csv = evacuees.ToCSV(evacueeQuery);

            var content = Encoding.UTF8.GetBytes(csv);
            var contentType = "text/csv";

            return new ReportQueryResult
            {
                Content = content,
                ContentType = contentType
            };
        }

        public async Task<ReportQueryResult> Handle(SupportReportQuery query)
        {
            var supportQuery = new ReportQuery
            {
                FileId = query.FileId,
                TaskNumber = query.TaskNumber,
                EvacuatedFrom = query.EvacuatedFrom,
                EvacuatedTo = query.EvacuatedTo,
                StartDate = query.From,
                EndDate = query.To,
            };

            var supports = (await reportRepository.QuerySupport(supportQuery)).Items;

            var communities = await metadataRepository.GetCommunities();
            supportQuery.EvacuatedFrom = communities.SingleOrDefault(c => c.Code == supportQuery.EvacuatedFrom)?.Name;
            supportQuery.EvacuatedTo = communities.SingleOrDefault(c => c.Code == supportQuery.EvacuatedTo)?.Name;

            var csv = supports.ToCSV(supportQuery, "\"");

            var content = Encoding.UTF8.GetBytes(csv);
            var contentType = "text/csv";

            return new ReportQueryResult
            {
                Content = content,
                ContentType = contentType
            };
        }
    }
}
