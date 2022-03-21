using System;
using System.Threading.Tasks;
using EMBC.PDFGenerator;

namespace EMBC.ESS.Utilities.PdfGenerator
{
    public interface IPdfGenerator
    {
        public Task<byte[]> Generate(string source);
    }

    public class PdfGenerator : IPdfGenerator
    {
        private readonly Generator.GeneratorClient pdfGenerator;

        public PdfGenerator(Generator.GeneratorClient pdfGenerator)
        {
            this.pdfGenerator = pdfGenerator;
        }

        public async Task<byte[]> Generate(string source)
        {
            var result = await pdfGenerator.ConvertAsync(new ConvertRequest { Data = Google.Protobuf.ByteString.CopyFromUtf8(source) });
            if (result.ResultStatus == ResultStatus.Fail) throw new Exception($"Failed to generate PDF: {result.ErrorDetail}");
            return result.Data.ToByteArray();
        }
    }
}
