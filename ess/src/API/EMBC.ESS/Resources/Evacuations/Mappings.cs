﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.Utilities.Extensions;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Evacuations;

public class Mappings : Profile
{
    public Mappings()
    {
        Func<string, bool> isGuid = s => Guid.TryParse(s, out var _);
        Func<Date?, string?> formatDateOfBirth = dob => dob == null ? null : $"{dob.Value.Month:D2}/{dob.Value.Day:D2}/{dob.Value.Year:D4}";

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
            .ForPath(d => d.NeedsAssessment.Pets, opts => opts.MapFrom(s => s.era_era_evacuationfile_era_animal_ESSFileid))
            .ForMember(d => d.ManualFileId, opts => opts.MapFrom(s => s.era_paperbasedessfile))
            .ForMember(d => d.IsPaper, opts => opts.MapFrom(s => s.era_paperbasedessfile != null))
            ;

        CreateMap<NeedsAssessment, era_needassessment>(MemberList.None)
              .ForMember(d => d.era_needassessmentid, opts => opts.MapFrom(s => Guid.NewGuid()))
              .ForMember(d => d._era_reviewedbyid_value, opts => opts.MapFrom(s => s.CompletedByTeamMemberId))
              .ForMember(d => d.era_needsassessmenttype, opts => opts.MapFrom(s => (int?)Enum.Parse<NeedsAssessmentTypeOptionSet>(s.Type.ToString())))
              .ForMember(d => d.era_canevacueeprovidefood, opts => opts.MapFrom(s => s.Needs.Contains(IdentifiedNeed.Food) ? (int)NeedTrueFalse.False : (int)NeedTrueFalse.True))
              .ForMember(d => d.era_canevacueeprovideclothing, opts => opts.MapFrom(s => s.Needs.Contains(IdentifiedNeed.Clothing) ? (int)NeedTrueFalse.False : (int)NeedTrueFalse.True))
              .ForMember(d => d.era_canevacueeprovideincidentals, opts => opts.MapFrom(s => s.Needs.Contains(IdentifiedNeed.Incidentals) ? (int)NeedTrueFalse.False : (int)NeedTrueFalse.True))
              .ForMember(d => d.era_canevacueeprovidetransportation, opts => opts.MapFrom(s => s.Needs.Contains(IdentifiedNeed.Transportation) ? (int)NeedTrueFalse.False : (int)NeedTrueFalse.True))
              .ForMember(d => d.era_insurancecoverage, opts => opts.MapFrom(s => (int?)Enum.Parse<InsuranceOptionOptionSet>(s.Insurance.ToString())))
              .ForMember(d => d.era_addressline1, opts => opts.MapFrom(s => s.EvacuatedFrom.AddressLine1))
              .ForMember(d => d.era_addressline2, opts => opts.MapFrom(s => s.EvacuatedFrom.AddressLine2))
              .ForMember(d => d.era_postalcode, opts => opts.MapFrom(s => s.EvacuatedFrom.PostalCode))
              .ForMember(d => d._era_jurisdictionid_value, opts => opts.MapFrom(s => s.EvacuatedFrom.CommunityCode))
              .ForMember(d => d.era_era_householdmember_era_needassessment, opts => opts.MapFrom(s => s.HouseholdMembers))
              .ForPath(d => d.era_registrationlocation, opts => opts.Ignore())
              .AfterMap((s, d) =>
              {
                  if (s.Needs.Contains(IdentifiedNeed.ShelterReferral))
                  {
                      d.era_shelteroptions = (int)ShelterOptionSet.Referral;
                  }
                  else if (s.Needs.Contains(IdentifiedNeed.ShelterAllowance))
                  {
                      d.era_shelteroptions = (int)ShelterOptionSet.Allowance;
                  }
              })
              ;

        CreateMap<era_needassessment, EvacuationAddress>()
              .ForMember(d => d.AddressLine1, opts => opts.MapFrom(s => s.era_addressline1))
              .ForMember(d => d.AddressLine2, opts => opts.MapFrom(s => s.era_addressline2))
              .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.era_postalcode))
              .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s._era_jurisdictionid_value))
              ;

        CreateMap<era_needassessment, NeedsAssessment>()
            .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_needassessmentid))
            .ForMember(d => d.TaskNumber, opts => opts.MapFrom(s => s.era_TaskNumber == null ? null : s.era_TaskNumber.era_name))
            .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s))
            .ForMember(d => d.CompletedByTeamMemberId, opts => opts.MapFrom(s => s._era_reviewedbyid_value))
            .ForMember(d => d.CompletedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
            .ForMember(d => d.LastModified, opts => opts.MapFrom(s => s.modifiedon.Value.UtcDateTime))
            .ForMember(d => d.LastModifiedTeamMemberId, opts => opts.MapFrom(s => s._era_reviewedbyid_value))
            .ForMember(d => d.Type, opts => opts.MapFrom(s => (int?)Enum.Parse<NeedsAssessmentType>(((NeedsAssessmentTypeOptionSet)s.era_needsassessmenttype).ToString())))
            .ForMember(d => d.Insurance, opts => opts.MapFrom(s => Enum.Parse<InsuranceOption>(((InsuranceOptionOptionSet)s.era_insurancecoverage).ToString())))
            .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => s.era_era_householdmember_era_needassessment))
            .ForMember(d => d.EligibilityCheck, opts => opts.MapFrom(s => s.era_EligibilityCheck))
            .ForMember(d => d.Pets, opts => opts.Ignore())
            .ForMember(d => d.Notes, opts => opts.Ignore())
            .ForMember(d => d.Needs, opts => opts.Ignore())
            .AfterMap((s, d) =>
            {
                var needs = new List<IdentifiedNeed>();
                if (s.era_canevacueeprovideclothing.GetValueOrDefault(0) == (int)NeedTrueFalse.False) needs.Add(IdentifiedNeed.Clothing);
                if (s.era_canevacueeprovidefood.GetValueOrDefault(0) == (int)NeedTrueFalse.False) needs.Add(IdentifiedNeed.Food);
                if (s.era_canevacueeprovideincidentals.GetValueOrDefault(0) == (int)NeedTrueFalse.False) needs.Add(IdentifiedNeed.Incidentals);
                if (s.era_canevacueeprovidetransportation.GetValueOrDefault(0) == (int)NeedTrueFalse.False) needs.Add(IdentifiedNeed.Transportation);
                if (s.era_shelteroptions.GetValueOrDefault(0) == (int)ShelterOptionSet.Allowance) needs.Add(IdentifiedNeed.ShelterAllowance);
                if (s.era_shelteroptions.GetValueOrDefault(0) == (int)ShelterOptionSet.Referral) needs.Add(IdentifiedNeed.ShelterReferral);
                d.Needs = needs;
            })
            ;

        CreateMap<era_householdmember, HouseholdMember>()
            .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_householdmemberid))
            .ForMember(d => d.LinkedRegistrantId, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.contactid))
            .ForMember(d => d.HasAccessRestriction, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_restriction))
            .ForMember(d => d.IsVerifiedRegistrant, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_verified))
            .ForMember(d => d.IsAuthenticatedRegistrant, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_authenticated))
            .ForMember(d => d.IsPrimaryRegistrant, opts => opts.MapFrom(s => s.era_isprimaryregistrant))
            .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_Registrant == null ? s.era_firstname : s.era_Registrant.firstname))
            .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_Registrant == null ? s.era_lastname : s.era_Registrant.lastname))
            .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => formatDateOfBirth(s.era_Registrant == null ? s.era_dateofbirth : s.era_Registrant.birthdate)))
            .ForMember(d => d.IsMinor, opts => opts.MapFrom(s => s.era_isunder19))
            .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_Registrant == null ? s.era_initials : s.era_Registrant.era_initial))
            .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.era_Registrant == null ? s.era_gender : s.era_Registrant.gendercode))
            .ForMember(d => d.Email, opts => opts.MapFrom(s => s.era_Registrant == null ? s.era_emailaddress : s.era_Registrant.emailaddress1))
            .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.era_Registrant == null ? s.era_telephonemobile : s.era_Registrant.address1_telephone1))

            .ReverseMap()
            .ForMember(d => d.era_householdmemberid, opts => opts.MapFrom(s => isGuid(s.Id) ? Guid.Parse(s.Id) : (Guid?)null))
            .ForMember(d => d.era_isprimaryregistrant, opts => opts.MapFrom(s => s.IsPrimaryRegistrant))
            .ForMember(d => d.era_isunder19, opts => opts.MapFrom(s => DateTime.Parse(s.DateOfBirth, CultureInfo.InvariantCulture).CalculateAge() < 19))
            .ForMember(d => d.era_firstname, opts => opts.MapFrom(s => s.FirstName))
            .ForMember(d => d.era_lastname, opts => opts.MapFrom(s => s.LastName))
            .ForMember(d => d.era_initials, opts => opts.MapFrom(s => s.Initials))
            .ForMember(d => d.era_gender, opts => opts.ConvertUsing<GenderConverter, string>(s => s.Gender))
            .ForMember(d => d.era_dateofbirth, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.DateOfBirth) ? (Date?)null : Date.Parse(s.DateOfBirth)))
            .ForMember(d => d._era_registrant_value, opts => opts.MapFrom(s => s.LinkedRegistrantId))
            .ForMember(d => d.era_telephonemobile, opts => opts.MapFrom(s => s.Phone))
            .ForMember(d => d.era_emailaddress, opts => opts.MapFrom(s => s.Email))
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
            .ForMember(d => d.IsImportant, opts => opts.MapFrom(s => s.era_important == true))
            ;

        CreateMap<Note, era_essfilenote>(MemberList.None)
            .ForMember(d => d.era_essfilenoteid, opts => opts.MapFrom(s => s.Id))
            .ForMember(d => d.era_notetext, opts => opts.MapFrom(s => s.Content))
            .ForMember(d => d._era_essteamuserid_value, opts => opts.MapFrom(s => isGuid(s.CreatingTeamMemberId) ? Guid.Parse(s.CreatingTeamMemberId) : (Guid?)null))
            .ForMember(d => d.era_ishidden, opts => opts.MapFrom(s => s.IsHidden))
            .ForMember(d => d.era_important, opts => opts.MapFrom(s => s.IsImportant))
            ;

        CreateMap<AddEligibilityCheck, era_eligibilitycheck>(MemberList.Source)
            .ForSourceMember(s => s.TaskNumber, opts => opts.DoNotValidate())
            .ForSourceMember(s => s.HomeAddressReferenceId, opts => opts.DoNotValidate())
            .ForSourceMember(s => s.EvacuationFileNumber, opts => opts.DoNotValidate())
            .ForSourceMember(s => s.Eligible, opts => opts.DoNotValidate())
            .ForSourceMember(s => s.EligibleSupports, opts => opts.DoNotValidate())
            .ForMember(d => d.era_iseligible, opts => opts.MapFrom(s => s.Eligible ? Eligible.Yes : Eligible.No))
            .ForMember(d => d.era_reason, opts => opts.MapFrom(s => s.Reason))
            .ForMember(d => d.era_eligibilityperiodfrom, opts => opts.MapFrom(s => s.From))
            .ForMember(d => d.era_eligibilityperiodto, opts => opts.MapFrom(s => s.To))
            ;

        CreateMap<era_eligibilitycheck, SelfServeEligibilityCheck>()
            .ForMember(d => d.Eligible, opts => opts.MapFrom(s => s.era_iseligible == (int)Eligible.Yes))
            .ForMember(d => d.TaskNumber, opts => opts.MapFrom(s => s.era_Task == null ? null : s.era_Task.era_name))
            .ForMember(d => d.From, opts => opts.MapFrom(s => s.era_eligibilityperiodfrom.HasValue ? s.era_eligibilityperiodfrom.Value.DateTime : (DateTime?)null))
            .ForMember(d => d.To, opts => opts.MapFrom(s => s.era_eligibilityperiodto.HasValue ? s.era_eligibilityperiodto.Value.DateTime : (DateTime?)null))
            .ForMember(d => d.SupportSettings, opts => opts.MapFrom((s, _, _, ctx) => s.era_era_eligibilitycheck_era_eligiblesupport_EligibilityCheck))
            ;

        CreateMap<era_eligiblesupport, SelfServeSupportSetting>()
            .ForCtorParam(nameof(SelfServeSupportSetting.State), opts => opts.MapFrom(s => s.era_supporteligible))
            .ForCtorParam(nameof(SelfServeSupportSetting.Type), opts => opts.MapFrom(s => s.era_SelfServeSupportLimit.era_supporttypeoption))
            ;
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

public enum NeedTrueFalse
{
    True = 174360000,
    False = 174360001
}

public enum ShelterOptionSet
{
    Allowance = 174360000,
    Referral = 174360001
}

public enum Eligible
{
    Yes = 174360000,
    No = 174360001
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
