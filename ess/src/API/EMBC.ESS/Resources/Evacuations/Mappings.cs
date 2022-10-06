using System;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.Utilities.Extensions;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Evacuations
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            Func<string, bool> isGuid = s => Guid.TryParse(s, out var _);
            Func<Note, string> resolveNoteContent = n => n?.Content;

            CreateMap<EvacuationFile, era_evacuationfile>(MemberList.None)
                .IncludeAllDerived()
                .ForMember(d => d.era_name, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_paperbasedessfile, opts => opts.Ignore())
                .ForMember(d => d.era_essfilestatus, opts => opts.Ignore())
                .ForMember(d => d.era_evacuationfiledate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.era_CurrentNeedsAssessmentid, opts => opts.MapFrom(s => s.NeedsAssessment))
                .ForPath(d => d.era_CurrentNeedsAssessmentid.era_registrationlocation, opts => opts.MapFrom(s => s.RegistrationLocation))
                .ForMember(d => d.era_securityphrase, opts => opts.MapFrom(s => s.SecurityPhraseChanged ? s.SecurityPhrase : null))
                .ForMember(d => d._era_registrant_value, opts => opts.MapFrom(s => s.PrimaryRegistrantId))
                .ForMember(d => d._era_evacuatedfromid_value, opts => opts.MapFrom(s => s.EvacuatedFrom.CommunityCode))
                .ForMember(d => d.era_era_evacuationfile_era_animal_ESSFileid, opts => opts.MapFrom(s => s.NeedsAssessment.Pets))
                .ForMember(d => d.era_haspetfood, opts => opts.MapFrom(s => s.NeedsAssessment.HavePetsFood.HasValue && s.NeedsAssessment.HavePetsFood.Value ? EraTwoOptions.Yes : EraTwoOptions.No))
                .ForMember(d => d.era_petcareplans, opts => opts.MapFrom(s => resolveNoteContent(s.NeedsAssessment.Notes.FirstOrDefault(n => n.Type == NoteType.PetCarePlans))))
                .ForMember(d => d.era_paperbasedessfile, opts => opts.MapFrom(s => s.ManualFileId))
                .ForMember(d => d.era_registrationcompleteddate, opts => opts.MapFrom(s => s.CompletedOn))
                .ForMember(d => d.era_interviewername, opts => opts.MapFrom(s => s.CompletedBy))
                .AfterMap((s, d) =>
                {
                    //set link to primary registrant's household member entity
                    var primaryHouseholdMember = d.era_CurrentNeedsAssessmentid.era_era_householdmember_era_needassessment.SingleOrDefault(m => m.era_isprimaryregistrant == true);
                    if (primaryHouseholdMember != null)
                        primaryHouseholdMember._era_registrant_value = Guid.Parse(s.PrimaryRegistrantId);
                })
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_name))
                .ForMember(d => d.TaskId, opts => opts.MapFrom(s => s.era_TaskId == null ? null : s.era_TaskId.era_name))
                .ForMember(d => d.TaskLocationCommunityCode, opts => opts.MapFrom(s => s.era_TaskId == null ? null : s.era_TaskId._era_jurisdictionid_value))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
                .ForMember(d => d.LastModified, opts => opts.MapFrom(s => s.modifiedon.Value.UtcDateTime))
                .ForMember(d => d.PrimaryRegistrantId, opts => opts.MapFrom(s => s._era_registrant_value))
                .ForMember(d => d.PrimaryRegistrantUserId, opts => opts.MapFrom(s => s.era_Registrant.era_bcservicescardid))
                .ForMember(d => d.SecurityPhrase, opts => opts.ConvertUsing<SecurityPhraseConverter, string>(s => s.era_securityphrase))
                .ForMember(d => d.SecurityPhraseChanged, opts => opts.MapFrom(s => false))
                .ForMember(d => d.IsSecurityPhraseMasked, opts => opts.MapFrom((s, d, _, ctx) => SecurityPhraseConverter.ShouldMaskSecretPhrase(ctx)))
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => s.era_evacuationfiledate.Value.UtcDateTime))
                .ForMember(d => d.NeedsAssessment, opts => opts.MapFrom(s => s.era_CurrentNeedsAssessmentid))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.era_essfilestatus))
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.era_era_evacuationfile_era_householdmember_EvacuationFileid
                    .Where(m => m.era_Registrant != null)
                    .Any(m => m.era_Registrant.era_restriction == true)))
                .ForMember(d => d.RegistrationLocation, opts => opts.MapFrom(s => s.era_CurrentNeedsAssessmentid.era_registrationlocation))
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => s.era_era_evacuationfile_era_householdmember_EvacuationFileid))
                .ForMember(d => d.Notes, opts => opts.MapFrom(s => s.era_era_evacuationfile_era_essfilenote_ESSFileID))
                .ForMember(d => d.Supports, opts => opts.MapFrom(s => s.era_era_evacuationfile_era_evacueesupport_ESSFileId.Select(s => s.era_name)))
                .ForPath(d => d.NeedsAssessment.HavePetsFood, opts => opts.MapFrom(s => s.era_haspetfood == (int)EraTwoOptions.Yes))
                .ForPath(d => d.NeedsAssessment.Pets, opts => opts.MapFrom(s => s.era_era_evacuationfile_era_animal_ESSFileid))
                .ForPath(d => d.NeedsAssessment.Notes, opts => opts.MapFrom(s => new[]
                    {
                        string.IsNullOrEmpty(s.era_CurrentNeedsAssessmentid.era_householdrecoveryplan) ? null : new Note { Type = NoteType.RecoveryPlan, Content = s.era_CurrentNeedsAssessmentid.era_householdrecoveryplan },
                        string.IsNullOrEmpty(s.era_CurrentNeedsAssessmentid.era_evacuationimpacttohousehold) ? null : new Note { Type = NoteType.EvacuationImpact, Content = s.era_CurrentNeedsAssessmentid.era_evacuationimpacttohousehold },
                        string.IsNullOrEmpty(s.era_CurrentNeedsAssessmentid.era_externalreferralsdetails) ? null : new Note { Type = NoteType.ExternalReferralServices, Content = s.era_CurrentNeedsAssessmentid.era_externalreferralsdetails },
                        string.IsNullOrEmpty(s.era_petcareplans) ? null : new Note { Type = NoteType.PetCarePlans, Content = s.era_petcareplans },
                    }.Where(n => n != null).ToArray()))
                .ForMember(d => d.ManualFileId, opts => opts.MapFrom(s => s.era_paperbasedessfile))
                .ForMember(d => d.IsPaper, opts => opts.MapFrom(s => s.era_paperbasedessfile != null))
                ;

            CreateMap<NeedsAssessment, era_needassessment>(MemberList.None)
                  .ForMember(d => d.era_needassessmentid, opts => opts.MapFrom(s => Guid.NewGuid()))
                  .ForMember(d => d._era_reviewedbyid_value, opts => opts.MapFrom(s => s.CompletedByTeamMemberId))
                  .ForMember(d => d.era_needsassessmenttype, opts => opts.MapFrom(s => (int?)Enum.Parse<NeedsAssessmentTypeOptionSet>(s.Type.ToString())))
                  .ForMember(d => d.era_canevacueeprovidefood, opts => opts.MapFrom(s => Lookup(s.CanProvideFood)))
                  .ForMember(d => d.era_canevacueeprovideclothing, opts => opts.MapFrom(s => Lookup(s.CanProvideClothing)))
                  .ForMember(d => d.era_canevacueeprovideincidentals, opts => opts.MapFrom(s => Lookup(s.CanProvideIncidentals)))
                  .ForMember(d => d.era_canevacueeprovidelodging, opts => opts.MapFrom(s => Lookup(s.CanProvideLodging)))
                  .ForMember(d => d.era_canevacueeprovidetransportation, opts => opts.MapFrom(s => Lookup(s.CanProvideTransportation)))
                  .ForMember(d => d.era_dietaryrequirement, opts => opts.MapFrom(s => s.HaveSpecialDiet))
                  .ForMember(d => d.era_dietaryrequirementdetails, opts => opts.MapFrom(s => s.SpecialDietDetails))
                  .ForMember(d => d.era_medicationrequirement, opts => opts.MapFrom(s => s.TakeMedication))
                  .ForMember(d => d.era_hasenoughsupply, opts => opts.MapFrom(s => s.HaveMedicalSupplies))
                  .ForMember(d => d.era_insurancecoverage, opts => opts.MapFrom(s => (int?)Enum.Parse<InsuranceOptionOptionSet>(s.Insurance.ToString())))
                  .ForMember(d => d.era_householdrecoveryplan, opts => opts.MapFrom(s => resolveNoteContent(s.Notes.FirstOrDefault(n => n.Type == NoteType.RecoveryPlan))))
                  .ForMember(d => d.era_evacuationimpacttohousehold, opts => opts.MapFrom(s => resolveNoteContent(s.Notes.FirstOrDefault(n => n.Type == NoteType.EvacuationImpact))))
                  .ForMember(d => d.era_externalreferralsdetails, opts => opts.MapFrom(s => resolveNoteContent(s.Notes.FirstOrDefault(n => n.Type == NoteType.ExternalReferralServices))))
                  .ForMember(d => d.era_haschildcarereferral, opts => opts.MapFrom(s => s.RecommendedReferralServices.Contains(ReferralServices.ChildCare)))
                  .ForMember(d => d.era_hasfirstaidreferral, opts => opts.MapFrom(s => s.RecommendedReferralServices.Contains(ReferralServices.FirstAid)))
                  .ForMember(d => d.era_hasinquiryreferral, opts => opts.MapFrom(s => s.RecommendedReferralServices.Contains(ReferralServices.Inquiry)))
                  .ForMember(d => d.era_haspersonalservicesreferral, opts => opts.MapFrom(s => s.RecommendedReferralServices.Contains(ReferralServices.Personal)))
                  .ForMember(d => d.era_haspetcarereferral, opts => opts.MapFrom(s => s.RecommendedReferralServices.Contains(ReferralServices.PetCare)))
                  .ForMember(d => d.era_hashealthservicesreferral, opts => opts.MapFrom(s => s.RecommendedReferralServices.Contains(ReferralServices.Health)))
                  .ForMember(d => d.era_addressline1, opts => opts.MapFrom(s => s.EvacuatedFrom.AddressLine1))
                  .ForMember(d => d.era_addressline2, opts => opts.MapFrom(s => s.EvacuatedFrom.AddressLine2))
                  .ForMember(d => d.era_postalcode, opts => opts.MapFrom(s => s.EvacuatedFrom.PostalCode))
                  .ForMember(d => d._era_jurisdictionid_value, opts => opts.MapFrom(s => s.EvacuatedFrom.CommunityCode))
                  .ForMember(d => d.era_era_householdmember_era_needassessment, opts => opts.MapFrom(s => s.HouseholdMembers))
                  .ForPath(d => d.era_registrationlocation, opts => opts.Ignore())
                  ;

            CreateMap<era_needassessment, EvacuationAddress>()
                  .ForMember(d => d.AddressLine1, opts => opts.MapFrom(s => s.era_addressline1))
                  .ForMember(d => d.AddressLine2, opts => opts.MapFrom(s => s.era_addressline2))
                  .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.era_postalcode))
                  .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s._era_jurisdictionid_value))
                  ;

            CreateMap<era_needassessment, NeedsAssessment>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_needassessmentid))
                .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s))
                .ForMember(d => d.CompletedByTeamMemberId, opts => opts.MapFrom(s => s._era_reviewedbyid_value))
                .ForMember(d => d.CompletedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
                .ForMember(d => d.LastModified, opts => opts.MapFrom(s => s.modifiedon.Value.UtcDateTime))
                .ForMember(d => d.LastModifiedTeamMemberId, opts => opts.MapFrom(s => s._era_reviewedbyid_value))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => (int?)Enum.Parse<NeedsAssessmentType>(((NeedsAssessmentTypeOptionSet)s.era_needsassessmenttype).ToString())))
                .ForMember(d => d.CanProvideClothing, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideclothing)))
                .ForMember(d => d.CanProvideFood, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidefood)))
                .ForMember(d => d.CanProvideIncidentals, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideincidentals)))
                .ForMember(d => d.CanProvideLodging, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidelodging)))
                .ForMember(d => d.CanProvideTransportation, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidetransportation)))
                .ForMember(d => d.TakeMedication, opts => opts.MapFrom(s => s.era_medicationrequirement))
                .ForMember(d => d.HaveMedicalSupplies, opts => opts.MapFrom(s => s.era_hasenoughsupply))
                .ForMember(d => d.Insurance, opts => opts.MapFrom(s => Enum.Parse<InsuranceOption>(((InsuranceOptionOptionSet)s.era_insurancecoverage).ToString())))
                .ForMember(d => d.HaveSpecialDiet, opts => opts.MapFrom(s => s.era_dietaryrequirement))
                .ForMember(d => d.SpecialDietDetails, opts => opts.MapFrom(s => s.era_dietaryrequirementdetails))
                .ForMember(d => d.HavePetsFood, opts => opts.Ignore())
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => s.era_era_householdmember_era_needassessment))
                .ForMember(d => d.Pets, opts => opts.Ignore())
                .ForMember(d => d.Notes, opts => opts.Ignore())
                .ForMember(s => s.RecommendedReferralServices, opts => opts.MapFrom(s => new[]
                    {
                        s.era_haschildcarereferral.GetValueOrDefault(false) ? ReferralServices.ChildCare : null,
                        s.era_hasfirstaidreferral.GetValueOrDefault(false) ? ReferralServices.FirstAid : null,
                        s.era_hasinquiryreferral.GetValueOrDefault(false) ? ReferralServices.Inquiry : null,
                        s.era_haspersonalservicesreferral.GetValueOrDefault(false) ? ReferralServices.Personal : null,
                        s.era_haspetcarereferral.GetValueOrDefault(false) ? ReferralServices.PetCare : null,
                        s.era_hashealthservicesreferral.GetValueOrDefault(false) ? ReferralServices.Health : (ReferralServices?)null,
                    }.Where(r => r != null).ToArray()))
               ;

            CreateMap<era_householdmember, HouseholdMember>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_householdmemberid))
                .ForMember(d => d.LinkedRegistrantId, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.contactid))
                .ForMember(d => d.HasAccessRestriction, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_restriction))
                .ForMember(d => d.IsVerifiedRegistrant, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_verified))
                .ForMember(d => d.IsAuthenticatedRegistrant, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_authenticated))
                .ForMember(d => d.IsPrimaryRegistrant, opts => opts.MapFrom(s => s.era_isprimaryregistrant))
                .ForMember(d => d.IsMinor, opts => opts.MapFrom(s => s.era_isunder19))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_firstname.ToString()))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_lastname.ToString()))
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => !s.era_dateofbirth.HasValue
                    ? null
                    : $"{s.era_dateofbirth.Value.Month:D2}/{s.era_dateofbirth.Value.Day:D2}/{s.era_dateofbirth.Value.Year:D4}"))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_initials.ToString()))
                .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.era_gender))

                .ReverseMap()
                .ForMember(d => d.era_householdmemberid, opts => opts.MapFrom(s => isGuid(s.Id) ? Guid.Parse(s.Id) : (Guid?)null))
                .ForMember(d => d.era_isprimaryregistrant, opts => opts.MapFrom(s => s.IsPrimaryRegistrant))
                .ForMember(d => d.era_isunder19, opts => opts.MapFrom(s => DateTime.Parse(s.DateOfBirth).CalculatetAge() < 19))
                .ForMember(d => d.era_firstname, opts => opts.MapFrom(s => s.FirstName))
                .ForMember(d => d.era_lastname, opts => opts.MapFrom(s => s.LastName))
                .ForMember(d => d.era_initials, opts => opts.MapFrom(s => s.Initials))
                .ForMember(d => d.era_gender, opts => opts.ConvertUsing<GenderConverter, string>(s => s.Gender))
                .ForMember(d => d.era_dateofbirth, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.DateOfBirth) ? (Date?)null : Date.Parse(s.DateOfBirth)))
                .ForMember(d => d._era_registrant_value, opts => opts.MapFrom(s => s.LinkedRegistrantId))
                ;

            CreateMap<era_animal, Pet>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_animalid.ToString()))
                .ForMember(d => d.Quantity, opts => opts.MapFrom(s => s.era_numberofpets))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.era_name))

                .ReverseMap()
                .ValidateMemberList(MemberList.Source)
                .ForSourceMember(s => s.Id, opts => opts.DoNotValidate())
                .ForMember(d => d.era_animalid, opts => opts.MapFrom(s => Guid.NewGuid()))
                .ForMember(d => d.era_numberofpets, opts => opts.MapFrom(s => s.Quantity))
                .ForMember(d => d.era_name, opts => opts.MapFrom(s => s.Type));

            CreateMap<era_essfilenote, Note>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_essfilenoteid))
                .ForMember(d => d.Content, opts => opts.MapFrom(s => s.era_notetext))
                .ForMember(d => d.AddedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.modifiedon.Value.UtcDateTime))
                .ForMember(d => d.CreatingTeamMemberId, opts => opts.MapFrom(s => s._era_essteamuserid_value))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => NoteType.General))
                .ForMember(d => d.IsHidden, opts => opts.MapFrom(s => s.era_ishidden == true))
                ;

            CreateMap<Note, era_essfilenote>(MemberList.None)
                .ForMember(d => d.era_essfilenoteid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_notetext, opts => opts.MapFrom(s => s.Content))
                .ForMember(d => d._era_essteamuserid_value, opts => opts.MapFrom(s => isGuid(s.CreatingTeamMemberId) ? Guid.Parse(s.CreatingTeamMemberId) : (Guid?)null))
                .ForMember(d => d.era_ishidden, opts => opts.MapFrom(s => s.IsHidden))
                ;
        }

        private static int Lookup(bool? value) => value.HasValue ? value.Value ? 174360000 : 174360001 : 174360002;

        private static bool? Lookup(int? value) => value switch
        {
            174360000 => true,
            174360001 => false,
            174360002 => null,
            _ => null
        };

        public static bool CheckIfUnder19Years(Date birthdate, Date currentDate)
        {
            return birthdate.AddYears(19) >= currentDate;
        }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum InsuranceOptionOptionSet
    {
        No = 174360000,
        Yes = 174360001,
        Unsure = 174360002,
        Unknown = 174360003
    }

    public enum NeedsAssessmentTypeOptionSet
    {
        Preliminary = 174360000,
        Assessed = 174360001
    }

    public enum RegistrantType
    {
        Primary = 174360000,
        Member = 174360001
    }

#pragma warning restore CA1008 // Enums should have zero value

    public class SecurityPhraseConverter : IValueConverter<string, string>
    {
        public string Convert(string sourceMember, ResolutionContext context)
        {
            if (!ShouldMaskSecretPhrase(context)) return sourceMember;

            if (string.IsNullOrEmpty(sourceMember))
                return string.Empty;
            else
                return string.Concat(sourceMember.AsSpan()[..1], "****", sourceMember.AsSpan(sourceMember.Length - 1));
        }

        public static bool ShouldMaskSecretPhrase(ResolutionContext ctx) =>
            ctx.Items.ContainsKey("MaskSecurityPhrase") && bool.Parse(ctx.Items["MaskSecurityPhrase"].ToString());
    }

    public class GenderConverter : IValueConverter<string, int?>, IValueConverter<int?, string>
    {
        public int? Convert(string sourceMember, ResolutionContext context) => sourceMember?.ToLowerInvariant() switch
        {
            "male" => 1,
            "female" => 2,
            "x" => 3,
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
}
