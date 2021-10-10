using System.Threading.Tasks;
using EMBC.PDFGenerator.Utilities.PdfGenerator;
using Google.Protobuf;
using Grpc.Core;
using Microsoft.Extensions.Logging;

namespace EMBC.PDFGenerator
{
    public class PdfService : Generator.GeneratorBase
    {
        private readonly ILogger<PdfService> _logger;
        private readonly IPdfGenerator _generator;

        public PdfService(ILogger<PdfService> logger, IPdfGenerator generator)
        {
            _logger = logger;
            _generator = generator;
        }

        public override async Task<ConvertReply> Convert(ConvertRequest request, ServerCallContext context)
        {
            var data = await _generator.Generate(request.Data.ToStringUtf8());
            return await Task.FromResult(new ConvertReply
            {
                Data = ByteString.CopyFrom(data),
                ResultStatus = ResultStatus.Success
            });
        }
    }
}
