using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Payments
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<Payment, era_etransfertransaction>()
                .IncludeAllDerived()
                .ForMember(d => d.era_totalamount, opts => opts.MapFrom(s => s.Amount))
                ;

            CreateMap<InteracSupportPayment, era_etransfertransaction>(MemberList.Source)
                .ForSourceMember(s => s.LinkedSupportIds, opts => opts.DoNotValidate())
                .ForMember(d => d.era_firstname, opts => opts.MapFrom(s => s.RecipientFirstName))
                .ForMember(d => d.era_lastname, opts => opts.MapFrom(s => s.RecipientLastName))
                .ForMember(d => d.era_emailaddress, opts => opts.MapFrom(s => s.NotificationEmail))
                .ForMember(d => d.era_phonenumber, opts => opts.MapFrom(s => s.NotificationPhone))
                .ForMember(d => d.era_securityanswer, opts => opts.MapFrom(s => s.SecurityAnswer))
                .ForMember(d => d.era_securityquestion, opts => opts.MapFrom(s => s.SecurityQuestion))
                ;
        }
    }
}
