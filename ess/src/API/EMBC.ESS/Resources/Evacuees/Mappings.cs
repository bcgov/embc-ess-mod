using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.Utilities.Extensions;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Evacuees
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            Func<string, bool> isGuid = s => Guid.TryParse(s, out var _);

            CreateMap<Evacuee, contact>(MemberList.None)
                .ForSourceMember(s => s.Addresses, opts => opts.DoNotValidate())
                .ForMember(d => d.contactid, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Id) ? (Guid?)null : Guid.Parse(s.Id)))
                .ForMember(d => d.era_bcservicescardid, opts => opts.MapFrom(s => s.UserId))
                .ForMember(d => d.era_collectionandauthorization, opts => opts.MapFrom(s => true))
                .ForMember(d => d.era_restriction, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.era_authenticated, opts => opts.MapFrom(s => s.Authenticated))
                .ForMember(d => d.era_verified, opts => opts.MapFrom(s => s.Verified))
                .ForMember(d => d.gendercode, opts => opts.ConvertUsing<GenderConverter, string>(s => s.Gender))
                .ForMember(d => d.birthdate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.DateOfBirth) ? (Date?)null : Date.Parse(s.DateOfBirth)))
                .ForMember(d => d.emailaddress1, opts => opts.MapFrom(s => s.Email ?? string.Empty))
                .ForMember(d => d.address1_telephone1, opts => opts.MapFrom(s => s.Phone ?? string.Empty))
                .ForMember(d => d.firstname, opts => opts.MapFrom(s => s.FirstName))
                .ForMember(d => d.lastname, opts => opts.MapFrom(s => s.LastName))
                .ForMember(d => d.era_initial, opts => opts.MapFrom(s => s.Initials))
                .ForMember(d => d.era_preferredname, opts => opts.MapFrom(s => s.PreferredName))
                .ForMember(d => d.era_securityquestion1answer, opts => opts.MapFrom(s => s.SecurityQuestions.SingleOrDefaultProperty(q => q.Id == 1 && !q.AnswerIsMasked, q => q.Answer)))
                .ForMember(d => d.era_securityquestion2answer, opts => opts.MapFrom(s => s.SecurityQuestions.SingleOrDefaultProperty(q => q.Id == 2 && !q.AnswerIsMasked, q => q.Answer)))
                .ForMember(d => d.era_securityquestion3answer, opts => opts.MapFrom(s => s.SecurityQuestions.SingleOrDefaultProperty(q => q.Id == 3 && !q.AnswerIsMasked, q => q.Answer)))
                .ForMember(d => d.era_securityquestiontext1, opts => opts.MapFrom(s => s.SecurityQuestions.SingleOrDefaultProperty(q => q.Id == 1 && !q.AnswerIsMasked, q => q.Question)))
                .ForMember(d => d.era_securityquestiontext2, opts => opts.MapFrom(s => s.SecurityQuestions.SingleOrDefaultProperty(q => q.Id == 2 && !q.AnswerIsMasked, q => q.Question)))
                .ForMember(d => d.era_securityquestiontext3, opts => opts.MapFrom(s => s.SecurityQuestions.SingleOrDefaultProperty(q => q.Id == 3 && !q.AnswerIsMasked, q => q.Question)))
                .AfterMap((s, d) =>
                {
                    var primaryAddress = s.Addresses.FirstOrDefault(a => a.Type == AddressType.Primary);
                    var mailingAddress = s.Addresses.FirstOrDefault(a => a.Type == AddressType.Mailing);

                    d.era_issamemailingaddress = primaryAddress == mailingAddress;
                    if (primaryAddress != null)
                    {
                        d.address1_line1 = primaryAddress.AddressLine1;
                        d.address1_line2 = primaryAddress.AddressLine2;
                        d.address1_country = primaryAddress.Country;
                        d.address1_stateorprovince = string.IsNullOrEmpty(primaryAddress.StateProvince) ? string.Empty : primaryAddress.StateProvince;
                        d.address1_city = string.IsNullOrEmpty(primaryAddress.City) ? string.Empty : primaryAddress.City;
                        d.address1_postalcode = primaryAddress.PostalCode;
                        d.era_primarybcresident = primaryAddress.StateProvince == "BC";
                    }

                    if (mailingAddress != null)
                    {
                        d.address2_line1 = mailingAddress.AddressLine1;
                        d.address2_line2 = mailingAddress.AddressLine2;
                        d.address2_country = mailingAddress.Country;
                        d.address2_stateorprovince = string.IsNullOrEmpty(mailingAddress.StateProvince) ? string.Empty : mailingAddress.StateProvince;
                        d.address2_city = string.IsNullOrEmpty(mailingAddress.City) ? string.Empty : mailingAddress.City;
                        d.address2_postalcode = mailingAddress.PostalCode;
                        d.era_isbcmailingaddress = mailingAddress.StateProvince == "BC";
                    }
                })
                ;

            CreateMap<contact, Evacuee>()

                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.contactid.ToString()))
                .ForMember(d => d.UserId, opts => opts.MapFrom(s => s.era_bcservicescardid))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.MapFrom(s => s.modifiedon.Value.UtcDateTime))
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.era_verified))
                .ForMember(d => d.Authenticated, opts => opts.MapFrom(s => s.era_authenticated))
                .ForMember(d => d.Minor, opts => opts.MapFrom(s => s.birthdate.HasValue && ((DateTime)s.birthdate.Value).CalculatetAge() < 19))
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.era_restriction ?? false))
                .ForMember(d => d.SecurityQuestions, opts => opts.ConvertUsing<SecurityQuestionConverter, contact>(s => s))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_initial))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.era_preferredname))
                .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.gendercode))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.emailaddress1))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.address1_telephone1))
                .ForMember(d => d.Addresses, opts => opts.Ignore())
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.birthdate.HasValue
                    ? $"{s.birthdate.Value.Month:D2}/{s.birthdate.Value.Day:D2}/{s.birthdate.Value.Year:D2}"
                    : null))

                .AfterMap((s, d) =>
                {
                    var primaryAddress = new Address
                    {
                        Type = AddressType.Primary,
                        AddressLine1 = s.address1_line1,
                        AddressLine2 = s.address1_line2,
                        City = isGuid(s.address1_city) ? null : s.address1_city,
                        Country = s.era_Country != null ? s.era_Country.era_countrycode : s.address1_country,
                        StateProvince = s.era_ProvinceState != null ? s.era_ProvinceState.era_code : s.address1_stateorprovince,
                        PostalCode = s.address1_postalcode,
                        Community = s.era_City != null ? s.era_City.era_jurisdictionid.ToString() : null
                    };
                    var mailingAddress = new Address
                    {
                        Type = AddressType.Mailing,
                        AddressLine1 = s.address2_line1,
                        AddressLine2 = s.address2_line2,
                        City = isGuid(s.address2_city) ? null : s.address2_city,
                        Country = s.era_MailingCountry != null ? s.era_MailingCountry.era_countrycode : s.address2_country,
                        StateProvince = s.era_MailingProvinceState != null ? s.era_MailingProvinceState.era_code : s.address2_stateorprovince,
                        PostalCode = s.address2_postalcode,
                        Community = s.era_MailingCity != null ? s.era_MailingCity.era_jurisdictionid.ToString() : null
                    };
                    d.Addresses = [primaryAddress, mailingAddress];
                })

              ;

            CreateMap<era_evacueeemailinvite, Invitation>()
                .ForMember(d => d.InviteId, opts => opts.MapFrom(s => s.era_evacueeemailinviteid.ToString()))
                .ForMember(d => d.EvacueeId, opts => opts.MapFrom(s => s._era_registrant_value.ToString()))
                .ForMember(d => d.ExpiryDate, opts => opts.MapFrom(s => s.era_expirydate.Value.UtcDateTime))
                ;
        }
    }

    public class GenderConverter : IValueConverter<string, int?>, IValueConverter<int?, string>
    {
        public int? Convert(string sourceMember, ResolutionContext? context) => sourceMember switch
        {
            "Male" => 1,
            "Female" => 2,
            "X" => 3,
            _ => null
        };

        public string Convert(int? sourceMember, ResolutionContext? context) => sourceMember switch
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
            var mask = (string)(context.Items.ContainsKey("MaskSecurityAnswers") ? context.Items["MaskSecurityAnswers"] : "true");
            var maskSecurityAnswers = mask.Equals("true", StringComparison.OrdinalIgnoreCase);
            var ret = new List<SecurityQuestion>();
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
                return string.Concat(answer.AsSpan()[..1], "*****", answer.AsSpan(answer.Length - 1));
        }
    }
}
