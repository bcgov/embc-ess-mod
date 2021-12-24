// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

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
