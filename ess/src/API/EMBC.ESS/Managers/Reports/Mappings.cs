using AutoMapper;
using EMBC.ESS.Resources.Reports;

namespace EMBC.ESS.Managers.Reports
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<Evacuee, Evacuee>()
                .ForMember(d => d.LastName, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.LastName))
                .ForMember(d => d.FirstName, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.FirstName))
                .ForMember(d => d.DateOfBirth, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.DateOfBirth))
                .ForMember(d => d.Gender, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.Gender))
                .ForMember(d => d.PreferredName, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.PreferredName))
                .ForMember(d => d.Initials, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.Initials))
                .ForMember(d => d.AddressLine1, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.AddressLine1))
                .ForMember(d => d.AddressLine2, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.AddressLine2))
                .ForMember(d => d.Community, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.Community))
                .ForMember(d => d.Province, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.Province))
                .ForMember(d => d.PostalCode, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.PostalCode))
                .ForMember(d => d.Country, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.Country))
                .ForMember(d => d.Phone, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.Phone))
                .ForMember(d => d.Email, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.Email))
                .ForMember(d => d.MailingAddressLine1, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.MailingAddressLine1))
                .ForMember(d => d.MailingAddressLine2, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.MailingAddressLine2))
                .ForMember(d => d.MailingCommunity, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.MailingCommunity))
                .ForMember(d => d.MailingProvince, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.MailingProvince))
                .ForMember(d => d.MailingPostal, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.MailingPostal))
                .ForMember(d => d.MailingCountry, opts => opts.ConvertUsing<PersonalInfoConverter, string>(s => s.MailingCountry))
                ;
        }

#pragma warning disable CA1034 // Nested types should not be visible

        public class PersonalInfoConverter : IValueConverter<string, string>
#pragma warning restore CA1034 // Nested types should not be visible
        {
            public string Convert(string sourceMember, ResolutionContext context)
            {
                if (ShouldShowPersonalInfo(context)) return sourceMember;
                else return string.Empty;
            }

            public static bool ShouldShowPersonalInfo(ResolutionContext ctx) =>
                ctx.Items.ContainsKey("IncludePersonalInfo") && bool.Parse(ctx.Items["IncludePersonalInfo"].ToString());
        }
    }
}
