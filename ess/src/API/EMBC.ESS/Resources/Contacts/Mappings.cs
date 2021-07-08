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
using System.Linq;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Contacts
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            Func<string, bool> isGuid = s => Guid.TryParse(s, out var _);

            CreateMap<Contact, contact>(MemberList.None)
                .ForMember(d => d.contactid, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Id) ? (Guid?)null : Guid.Parse(s.Id)))
                .ForMember(d => d.era_bcservicescardid, opts => opts.MapFrom(s => s.UserId))
                .ForMember(d => d.era_collectionandauthorization, opts => opts.MapFrom(s => true))
                .ForMember(d => d.era_restriction, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.era_authenticated, opts => opts.MapFrom(s => s.Authenticated))
                .ForMember(d => d.era_verified, opts => opts.MapFrom(s => s.Verified))

                .ForMember(d => d.address1_line1, opts => opts.MapFrom(s => s.PrimaryAddress.AddressLine1))
                .ForMember(d => d.address1_line2, opts => opts.MapFrom(s => s.PrimaryAddress.AddressLine2))
                .ForMember(d => d.address1_country, opts => opts.MapFrom(s => s.PrimaryAddress.Country))
                .ForMember(d => d.address1_stateorprovince, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.PrimaryAddress.StateProvince) ? string.Empty : s.PrimaryAddress.StateProvince))
                .ForMember(d => d.address1_city, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.PrimaryAddress.City) ? string.Empty : s.PrimaryAddress.City))
                .ForMember(d => d.era_primarybcresident, opts => opts.MapFrom(s => s.PrimaryAddress.StateProvince == "BC"))

                .ForMember(d => d.address2_line1, opts => opts.MapFrom(s => s.MailingAddress.AddressLine1))
                .ForMember(d => d.address2_line2, opts => opts.MapFrom(s => s.MailingAddress.AddressLine2))
                .ForMember(d => d.address2_country, opts => opts.MapFrom(s => s.MailingAddress.Country))
                .ForMember(d => d.address2_stateorprovince, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.MailingAddress.StateProvince) ? string.Empty : s.MailingAddress.StateProvince))
                .ForMember(d => d.address2_city, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.MailingAddress.City) ? string.Empty : s.MailingAddress.City))
                .ForMember(d => d.era_isbcmailingaddress, opts => opts.MapFrom(s => s.MailingAddress.StateProvince == "BC"))
                .ForMember(d => d.era_issamemailingaddress, opts => opts.MapFrom(s =>
                    s.MailingAddress.Country == s.PrimaryAddress.Country &&
                    s.MailingAddress.StateProvince == s.PrimaryAddress.StateProvince &&
                    s.MailingAddress.Community == s.PrimaryAddress.Community &&
                    s.MailingAddress.PostalCode == s.PrimaryAddress.PostalCode &&
                    s.MailingAddress.AddressLine1 == s.PrimaryAddress.AddressLine1 &&
                    s.MailingAddress.AddressLine2 == s.PrimaryAddress.AddressLine2))
                .ForMember(d => d.gendercode, opts => opts.ConvertUsing<GenderConverter, string>(s => s.Gender))
                .ForMember(d => d.birthdate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.DateOfBirth) ? (Date?)null : Date.Parse(s.DateOfBirth)))
                .ForMember(d => d.emailaddress1, opts => opts.MapFrom(s => s.Email ?? string.Empty))
                .ForMember(d => d.telephone1, opts => opts.MapFrom(s => s.Phone ?? string.Empty))
                .ForMember(d => d.firstname, opts => opts.MapFrom(s => s.FirstName))
                .ForMember(d => d.lastname, opts => opts.MapFrom(s => s.LastName))
                .ForMember(d => d.gendercode, opts => opts.ConvertUsing<GenderConverter, string>(s => s.Gender))
                .ForMember(d => d.era_initial, opts => opts.MapFrom(s => s.Initials))
                .ForMember(d => d.era_preferredname, opts => opts.MapFrom(s => s.PreferredName))
                .ForMember(d => d.emailaddress1, opts => opts.MapFrom(s => s.Email))
                .ForMember(d => d.telephone1, opts => opts.MapFrom(s => s.Phone))
                .ForMember(d => d.era_securityquestion1answer, opts => opts.MapFrom(s => s.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault().AnswerIsMasked ? null : s.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault().Answer))
                .ForMember(d => d.era_securityquestion2answer, opts => opts.MapFrom(s => s.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault().AnswerIsMasked ? null : s.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault().Answer))
                .ForMember(d => d.era_securityquestion3answer, opts => opts.MapFrom(s => s.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault().AnswerIsMasked ? null : s.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault().Answer))
                .ForMember(d => d.era_securityquestiontext1, opts => opts.MapFrom(s => s.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault().AnswerIsMasked ? null : s.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault().Question))
                .ForMember(d => d.era_securityquestiontext2, opts => opts.MapFrom(s => s.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault().AnswerIsMasked ? null : s.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault().Question))
                .ForMember(d => d.era_securityquestiontext3, opts => opts.MapFrom(s => s.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault().AnswerIsMasked ? null : s.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault().Question))
                ;

            CreateMap<contact, Contact>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.contactid.ToString()))
                .ForMember(d => d.UserId, opts => opts.MapFrom(s => s.era_bcservicescardid))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.createdon.Value.DateTime))
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.MapFrom(s => s.modifiedon.Value.DateTime))
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.era_verified))
                .ForMember(d => d.Authenticated, opts => opts.MapFrom(s => s.era_authenticated))
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.era_restriction ?? false))
                .ForMember(d => d.SecurityQuestions, opts => opts.ConvertUsing<SecurityQuestionConverter, contact>(s => s))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_initial))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.era_preferredname))
                .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.gendercode))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.emailaddress1))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.telephone1))
                .ForPath(d => d.PrimaryAddress.AddressLine1, opts => opts.MapFrom(s => s.address1_line1))
                .ForPath(d => d.PrimaryAddress.AddressLine2, opts => opts.MapFrom(s => s.address1_line2))
                .ForPath(d => d.PrimaryAddress.City, opts => opts.MapFrom(s => isGuid(s.address1_city) ? null : s.address1_city))
                .ForPath(d => d.PrimaryAddress.PostalCode, opts => opts.MapFrom(s => s.address1_postalcode))
                .ForPath(d => d.PrimaryAddress.Country, opts => opts.MapFrom(s => s.era_Country != null ? s.era_Country.era_countrycode : s.address1_country))
                .ForPath(d => d.PrimaryAddress.StateProvince, opts => opts.MapFrom(s => s.era_ProvinceState != null ? s.era_ProvinceState.era_code : s.address1_stateorprovince))
                .ForPath(d => d.PrimaryAddress.Community, opts => opts.MapFrom(s => s.era_City != null ? s.era_City.era_jurisdictionid.ToString() : null))

                .ForPath(d => d.MailingAddress.AddressLine1, opts => opts.MapFrom(s => s.address2_line1))
                .ForPath(d => d.MailingAddress.AddressLine2, opts => opts.MapFrom(s => s.address2_line2))
                .ForPath(d => d.MailingAddress.City, opts => opts.MapFrom(s => isGuid(s.address2_city) ? null : s.address2_city))
                .ForPath(d => d.MailingAddress.PostalCode, opts => opts.MapFrom(s => s.address2_postalcode))
                .ForPath(d => d.MailingAddress.Country, opts => opts.MapFrom(s => s.era_MailingCountry != null ? s.era_MailingCountry.era_countrycode : s.address2_country))
                .ForPath(d => d.MailingAddress.StateProvince, opts => opts.MapFrom(s => s.era_MailingProvinceState != null ? s.era_MailingProvinceState.era_code : s.address2_stateorprovince))
                .ForPath(d => d.MailingAddress.Community, opts => opts.MapFrom(s => s.era_MailingCity != null ? s.era_MailingCity.era_jurisdictionid.ToString() : null))

                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.birthdate.HasValue
                    ? $"{s.birthdate.Value.Month:D2}/{s.birthdate.Value.Day:D2}/{s.birthdate.Value.Year:D2}"
                    : null))
              ;
        }
    }

    public class GenderConverter : IValueConverter<string, int?>, IValueConverter<int?, string>
    {
        public int? Convert(string sourceMember, ResolutionContext context) => sourceMember switch
        {
            "Male" => 1,
            "Female" => 2,
            "X" => 3,
            _ => null
        };

        public string Convert(int? sourceMember, ResolutionContext context) => sourceMember switch
        {
            1 => "Male",
            2 => "Female",
            3 => "X",
            _ => null
        };
    }

    public class SecurityQuestionConverter : IValueConverter<contact, IEnumerable<SecurityQuestion>>
    {
        public IEnumerable<SecurityQuestion> Convert(contact sourceMember, ResolutionContext context)
        {
            string mask = (string)(context.Options.Items.ContainsKey("MaskSecurityAnswers") ? context.Options.Items["MaskSecurityAnswers"] : "true");
            bool maskSecurityAnswers = mask.ToLower().Equals("true");
            List<SecurityQuestion> ret = new List<SecurityQuestion>();
            if (!string.IsNullOrEmpty(sourceMember.era_securityquestiontext1) && !string.IsNullOrEmpty(sourceMember.era_securityquestion1answer))
                ret.Add(new SecurityQuestion { Id = 1, Question = sourceMember.era_securityquestiontext1, Answer = MaskAnswer(sourceMember.era_securityquestion1answer, maskSecurityAnswers), AnswerIsMasked = maskSecurityAnswers });

            if (!string.IsNullOrEmpty(sourceMember.era_securityquestiontext2) && !string.IsNullOrEmpty(sourceMember.era_securityquestion2answer))
                ret.Add(new SecurityQuestion { Id = 2, Question = sourceMember.era_securityquestiontext2, Answer = MaskAnswer(sourceMember.era_securityquestion2answer, maskSecurityAnswers), AnswerIsMasked = maskSecurityAnswers });

            if (!string.IsNullOrEmpty(sourceMember.era_securityquestiontext3) && !string.IsNullOrEmpty(sourceMember.era_securityquestion3answer))
                ret.Add(new SecurityQuestion { Id = 3, Question = sourceMember.era_securityquestiontext3, Answer = MaskAnswer(sourceMember.era_securityquestion3answer, maskSecurityAnswers), AnswerIsMasked = maskSecurityAnswers });

            return ret;
        }

        private string MaskAnswer(string answer, bool maskSecurityAnswers)
        {
            if (!maskSecurityAnswers) return answer;

            if (string.IsNullOrEmpty(answer))
                return string.Empty;
            else
                return answer.Substring(0, 1) + "***" + answer.Substring(answer.Length - 1);
        }
    }
}
