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

using System.Threading.Tasks;
using Wkhtmltopdf.NetCore;
using Wkhtmltopdf.NetCore.Options;

namespace EMBC.ESS.Utilities.PdfGenerator
{
    public interface IPdfGenerator
    {
        public Task<byte[]> Generate(string source);
    }

    public class PdfGenerator : IPdfGenerator
    {
        private readonly IGeneratePdf generatePdf;

        public PdfGenerator(IGeneratePdf generatePdf)
        {
            this.generatePdf = generatePdf;
            this.generatePdf.SetConvertOptions(new ConvertOptions
            {
                PageSize = Size.Letter,
                //PageMargins = new Margins(5, 5, 5, 5)
            });
        }

        public async Task<byte[]> Generate(string source)
        {
            return await generatePdf.GetByteArrayViewInHtml(source);
        }
    }
}
