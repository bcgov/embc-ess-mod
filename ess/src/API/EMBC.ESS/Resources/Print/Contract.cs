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
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Print
{
    public interface IPrintRequestsRepository
    {
        Task<string> Manage(ManagePrintRequestCommand request);

        Task<IEnumerable<PrintRequest>> Query(QueryPrintRequests query);
    }

    public abstract class ManagePrintRequestCommand { }

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
    }

    public enum ReferralPrintType
    {
        New = 174360000,
        Reprint = 174360001
    }
}
