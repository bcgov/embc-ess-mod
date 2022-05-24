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
                TimePeriod = query.TimePeriod
            };

            var results = (await reportRepository.QueryEvacuee(evacueeQuery)).Items;
            var evacuees = mapper.Map<IEnumerable<Evacuee>>(results, opt => opt.Items["IncludePersonalInfo"] = query.IncludePersonalInfo.ToString());

            var communities = await metadataRepository.GetCommunities();
            evacueeQuery.EvacuatedFrom = communities.Where(c => c.Code == evacueeQuery.EvacuatedFrom).SingleOrDefault()?.Name;
            evacueeQuery.EvacuatedTo = communities.Where(c => c.Code == evacueeQuery.EvacuatedTo).SingleOrDefault()?.Name;

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
            };

            var supports = (await reportRepository.QuerySupport(supportQuery)).Items;

            var communities = await metadataRepository.GetCommunities();
            supportQuery.EvacuatedFrom = communities.Where(c => c.Code == supportQuery.EvacuatedFrom).SingleOrDefault()?.Name;
            supportQuery.EvacuatedTo = communities.Where(c => c.Code == supportQuery.EvacuatedTo).SingleOrDefault()?.Name;

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
