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
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Reports
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            Func<string, bool> isGuid = s => Guid.TryParse(s, out var _);

            CreateMap<era_householdmember, Evacuee>()
                .ForMember(d => d.FileId, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_name))
                .ForMember(d => d.RegistrationCompleted, opts => opts.Ignore())
                .ForMember(d => d.TaskNumber, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_TaskId == null ? null : s.era_EvacuationFileid.era_TaskId.era_name))
                .ForMember(d => d.TaskStartDate, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_TaskId == null ? null : s.era_EvacuationFileid.era_TaskId.era_taskstartdate.Value.LocalDateTime.ToString("yyyy/MM/dd")))
                .ForMember(d => d.TaskStartTime, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_TaskId == null ? null : s.era_EvacuationFileid.era_TaskId.era_taskstartdate.Value.LocalDateTime.ToString("hh:mm tt")))
                .ForMember(d => d.TaskEndDate, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_TaskId == null ? null : s.era_EvacuationFileid.era_TaskId.era_taskenddate.Value.LocalDateTime.ToString("yyyy/MM/dd")))
                .ForMember(d => d.TaskEndTime, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_TaskId == null ? null : s.era_EvacuationFileid.era_TaskId.era_taskenddate.Value.LocalDateTime.ToString("hh:mm tt")))
                .ForMember(d => d.EvacuationFileStatus, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_essfilestatus))
                .ForMember(d => d.EvacuatedTo, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_TaskId == null ? null : s.era_EvacuationFileid.era_TaskId.era_JurisdictionID == null ? null : s.era_EvacuationFileid.era_TaskId.era_JurisdictionID.era_jurisdictionname))
                .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_EvacuatedFromID == null ? null : s.era_EvacuationFileid.era_EvacuatedFromID.era_jurisdictionname))
                .ForMember(d => d.FacilityName, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_registrationlocation))
                .ForMember(d => d.SelfRegistrationDate, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_selfregistrationdate.HasValue ? s.era_EvacuationFileid.era_selfregistrationdate.Value.LocalDateTime.ToString("yyyy/MM/dd") : null))
                .ForMember(d => d.SelfRegistrationTime, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_selfregistrationdate.HasValue ? s.era_EvacuationFileid.era_selfregistrationdate.Value.LocalDateTime.ToString("hh:mm tt") : null))
                .ForMember(d => d.RegistrationCompletedDate, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_registrationcompleteddate.HasValue ? s.era_EvacuationFileid.era_registrationcompleteddate.Value.LocalDateTime.ToString("yyyy/MM/dd") : null))
                .ForMember(d => d.RegistrationCompletedTime, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_registrationcompleteddate.HasValue ? s.era_EvacuationFileid.era_registrationcompleteddate.Value.LocalDateTime.ToString("hh:mm tt") : null))
                .ForMember(d => d.IsHeadOfHousehold, opts => opts.MapFrom(s => s.era_isprimaryregistrant))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_lastname))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_firstname))
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.era_dateofbirth))
                .ForMember(d => d.Gender, opts => opts.MapFrom(s => s.era_gender))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => string.Empty)) //the field in the wiki doesn't seem to exist
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_initials))
                .ForMember(d => d.AddressLine1, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.address1_line1))
                .ForMember(d => d.AddressLine2, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.address1_line2))
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_City == null ? s.era_Registrant.address1_city : s.era_Registrant.era_City.era_jurisdictionname))
                .ForMember(d => d.Province, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_ProvinceState == null ? s.era_Registrant.address1_stateorprovince : s.era_Registrant.era_ProvinceState.era_code))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.address1_postalcode))
                .ForMember(d => d.Country, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_Country == null ? s.era_Registrant.address1_country : s.era_Registrant.era_Country.era_countrycode))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.address1_telephone1))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.emailaddress1))
                .ForMember(d => d.MailingAddressLine1, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.address2_line1))
                .ForMember(d => d.MailingAddressLine2, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.address2_line2))
                .ForMember(d => d.MailingCommunity, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_MailingCity == null ? s.era_Registrant.address2_city : s.era_Registrant.era_MailingCity.era_jurisdictionname))
                .ForMember(d => d.MailingProvince, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_MailingProvinceState == null ? s.era_Registrant.address2_stateorprovince : s.era_Registrant.era_MailingProvinceState.era_code))
                .ForMember(d => d.MailingPostal, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.address2_postalcode))
                .ForMember(d => d.MailingCountry, opts => opts.MapFrom(s => s.era_Registrant == null ? null : s.era_Registrant.era_MailingCountry == null ? s.era_Registrant.address2_country : s.era_Registrant.era_MailingCountry.era_countrycode))
                .ForMember(d => d.Insurance, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? InsuranceOption.Unknown : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? InsuranceOption.Unknown : Enum.Parse<InsuranceOption>(((InsuranceOptionOptionSet)s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_insurancecoverage).ToString())))
                .ForMember(d => d.NumberOfPets, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? 0 : s.era_EvacuationFileid.era_era_evacuationfile_era_animal_ESSFileid.Count))
                .ForMember(d => d.Inquiry, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_hasinquiryreferral))
                .ForMember(d => d.HealthServices, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_hashealthservicesreferral))
                .ForMember(d => d.FirstAid, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_hasfirstaidreferral))
                .ForMember(d => d.PersonalServices, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_haspersonalservicesreferral))
                .ForMember(d => d.ChildCare, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_haschildcarereferral))
                .ForMember(d => d.PetCare, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_haspetcarereferral))
                .ForMember(d => d.CanProvideAccommodation, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_canevacueeprovidelodging))
                .ForMember(d => d.CanProvideClothing, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_canevacueeprovideclothing))
                .ForMember(d => d.CanProvideFood, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_canevacueeprovidefood))
                .ForMember(d => d.CanProvideIncidentals, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_canevacueeprovideincidentals))
                .ForMember(d => d.CanProvideTransportation, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_canevacueeprovidetransportation))
                .ForMember(d => d.NeedsMedication, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_medicationrequirement))
                .ForMember(d => d.HasEnoughSupply, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_hasenoughsupply))
                .ForMember(d => d.DietaryNeeds, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid == null ? null : s.era_EvacuationFileid.era_CurrentNeedsAssessmentid.era_dietaryrequirement))
                .ForMember(d => d.NumberOfSupports, opts => opts.MapFrom(s => s.era_EvacuationFileid == null ? 0 : s.era_EvacuationFileid.era_era_evacuationfile_era_evacueesupport_ESSFileId.Count))
                .ForMember(d => d.SupportsTotalAmount, opts => opts.Ignore())
                .AfterMap((s, d) =>
                {
                    d.RegistrationCompleted = !string.IsNullOrEmpty(d.TaskNumber);
                    decimal total = 0;
                    if (s.era_EvacuationFileid != null)
                    {
                        foreach (var support in s.era_EvacuationFileid.era_era_evacuationfile_era_evacueesupport_ESSFileId)
                        {
                            total += support.era_totalamount.HasValue ? support.era_totalamount.Value : 0;
                        }
                    }
                    d.SupportsTotalAmount = total;
                });
        }
    }

    public enum InsuranceOptionOptionSet
    {
        No = 174360000,
        Yes = 174360001,
        Unsure = 174360002,
        Unknown = 174360003
    }
}
