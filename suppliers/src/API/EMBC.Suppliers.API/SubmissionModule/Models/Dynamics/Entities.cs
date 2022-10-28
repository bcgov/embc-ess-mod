// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using Newtonsoft.Json;

namespace EMBC.Suppliers.API.SubmissionModule.Models.Dynamics
{
    public class SubmissionEntity
    {
        public bool isInvoice { get; set; }
        public IEnumerable<InvoiceEntity> invoiceCollection { get; set; }
        public IEnumerable<ReferralEntity> referralCollection { get; set; }
        public IEnumerable<LineItemEntity> lineItemCollection { get; set; }
        public IEnumerable<AttachmentEntity> documentCollection { get; set; }
    }

    public class InvoiceEntity
    {
        [JsonProperty("@odata.type")]
        public string Type { get; set; } = "Microsoft.Dynamics.CRM.era_supplierinvoice";

#pragma warning disable CA1707 // Identifiers should not contain underscores
        public string era_invoicedate { get; set; }
        public string era_invoiceref { get; set; }
        public string era_referencenumber { get; set; }
        public bool era_remitpaymenttootherbusiness { get; set; }
        public decimal era_totalinvoiceamount { get; set; }
        public int era_invoicetype { get; set; }
        public string era_supplierinvoicenumber { get; set; }
        public string era_suppliername { get; set; }
        public string era_supplierlegalname { get; set; }
        public string era_storenumber { get; set; }
        public string era_gstnumber { get; set; }
        public string era_addressline1 { get; set; }
        public string era_addressline2 { get; set; }
        public string era_city { get; set; }
        public string era_postalcode { get; set; }
        public string era_country { get; set; }
        public string era_legalbusinessname { get; set; }
        public string era_remitcountry { get; set; }
        public string era_remitcity { get; set; }
        public string era_remitaddress1 { get; set; }
        public string era_remitaddress2 { get; set; }
        public string era_remitprovincestate { get; set; }
        public string era_remitpostalcode { get; set; }
        public string era_contactfirstname { get; set; }
        public string era_contactlastname { get; set; }
        public string era_contactemail { get; set; }
        public string era_contactnumber { get; set; }
        public string era_contactfax { get; set; }

        [JsonProperty("era_Province@odata.bind")]
        public string era_province { get; set; }

        [JsonProperty("era_RelatedJurisdiction@odata.bind")]
        public string era_RelatedJurisdiction { get; internal set; }

#pragma warning restore CA1707 // Identifiers should not contain underscores
    }

    public class ReferralEntity
    {
        [JsonProperty("@odata.type")]
        public string Type { get; set; } = "Microsoft.Dynamics.CRM.era_referral";

#pragma warning disable CA1707 // Identifiers should not contain underscores
        public string era_referralnumber { get; set; }
        public decimal era_totalamount { get; set; }
        public string era_invoicereference { get; set; }
        public string era_submissionreference { get; set; }
#pragma warning restore CA1707 // Identifiers should not contain underscores
    }

    public class LineItemEntity
    {
        [JsonProperty("@odata.type")]
        public string Type { get; set; } = "Microsoft.Dynamics.CRM.era_supportlineitem";

#pragma warning disable CA1707 // Identifiers should not contain underscores
        public string era_description { get; set; }
        public decimal era_amount { get; set; }
        public string era_receipt { get; set; }
        public string era_receiptdate { get; set; }
        public string era_referralreference { get; set; }
        public string era_submissionreference { get; set; }

        [JsonProperty("era_SupportProvided@odata.bind")]
        public string era_SupportsProvided { get; set; }

#pragma warning restore CA1707 // Identifiers should not contain underscores
    }

    public class AttachmentEntity
    {
        [JsonProperty("@odata.type")]
        public string Type { get; set; } = "Microsoft.Dynamics.CRM.activitymimeattachment";

        public string filename { get; set; }
        public string subject { get; set; }
        public string activitysubject { get; set; }
        public byte[] body { get; set; }
    }
}
