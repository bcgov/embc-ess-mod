﻿// -------------------------------------------------------------------------
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
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Teams;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.ESS.Shared.Contracts.Profile;
using EMBC.ESS.Shared.Contracts.Suppliers;
using EMBC.ESS.Shared.Contracts.Team;
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Managers.Admin
{
    public class AdminManager
    {
        private readonly ITeamRepository teamRepository;
        private readonly ISupplierRepository supplierRepository;
        private readonly IMapper mapper;
        private readonly IMetadataRepository metadataRepository;
        private readonly IEssContextStateReporter essContextStatusReporter;
        private static TeamMemberStatus[] activeOnlyStatus = new[] { TeamMemberStatus.Active };
        private static TeamMemberStatus[] activeAndInactiveStatus = new[] { TeamMemberStatus.Active, TeamMemberStatus.Inactive };

        public AdminManager(
            ITeamRepository teamRepository,
            ISupplierRepository supplierRepository,
            IMapper mapper,
            IMetadataRepository metadataRepository,
            IEssContextStateReporter essContextStatusReporter)
        {
            this.teamRepository = teamRepository;
            this.supplierRepository = supplierRepository;
            this.mapper = mapper;
            this.metadataRepository = metadataRepository;
            this.essContextStatusReporter = essContextStatusReporter;
        }

        public async Task<TeamsQueryResponse> Handle(TeamsQuery cmd)
        {
            var teams = (await teamRepository.QueryTeams(new TeamQuery { Id = cmd.TeamId, AssignedCommunityCode = cmd.CommunityCode })).Items;

            return new TeamsQueryResponse { Teams = mapper.Map<IEnumerable<EMBC.ESS.Shared.Contracts.Team.Team>>(teams) };
        }

        public async Task<TeamMembersQueryResponse> Handle(TeamMembersQuery cmd)
        {
            var teamMemberStatuses = cmd.IncludeActiveUsersOnly ? activeOnlyStatus : null;
            var members = await teamRepository.GetMembers(cmd.TeamId, cmd.UserName, cmd.MemberId, teamMemberStatuses);

            return new TeamMembersQueryResponse { TeamMembers = mapper.Map<IEnumerable<Shared.Contracts.Team.TeamMember>>(members) };
        }

        public async Task<string> Handle(SaveTeamMemberCommand cmd)
        {
            var teamMembersWithSameUserName = await teamRepository.GetMembers(userName: cmd.Member.UserName, includeStatuses: activeAndInactiveStatus);
            //filter this user if exists
            if (cmd.Member.Id != null) teamMembersWithSameUserName = teamMembersWithSameUserName.Where(m => m.Id != cmd.Member.Id);
            if (teamMembersWithSameUserName.Any()) throw new UsernameAlreadyExistsException(cmd.Member.UserName);

            var id = await teamRepository.SaveMember(mapper.Map<Resources.Teams.TeamMember>(cmd.Member));

            return id;
        }

        public async Task Handle(DeleteTeamMemberCommand cmd)
        {
            var result = await teamRepository.DeleteMember(cmd.TeamId, cmd.MemberId);
            if (!result) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);
        }

        public async Task Handle(DeactivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId, includeStatuses: activeAndInactiveStatus)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);

            member.IsActive = false;
            await teamRepository.SaveMember(member);
        }

        public async Task Handle(ActivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId, includeStatuses: activeAndInactiveStatus)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);

            member.IsActive = true;
            await teamRepository.SaveMember(member);
        }

        public async Task<ValidateTeamMemberResponse> Handle(ValidateTeamMemberCommand cmd)
        {
            var members = await teamRepository.GetMembers(userName: cmd.TeamMember.UserName, includeStatuses: activeAndInactiveStatus);
            //filter this user if exists
            if (!string.IsNullOrEmpty(cmd.TeamMember.Id)) members = members.Where(m => m.Id != cmd.TeamMember.Id);
            return new ValidateTeamMemberResponse
            {
                UniqueUserName = !members.Any()
            };
        }

        public async Task Handle(AssignCommunitiesToTeamCommand cmd)
        {
            var allTeams = (await teamRepository.QueryTeams(new TeamQuery())).Items;
            var team = allTeams.SingleOrDefault(t => t.Id == cmd.TeamId);
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            var allAssignedCommunities = allTeams.Where(t => t.Id != cmd.TeamId).SelectMany(t => t.AssignedCommunities).Select(c => c.Code);
            var alreadyAssignedCommunities = cmd.Communities.Intersect(allAssignedCommunities).ToArray();
            if (alreadyAssignedCommunities.Any()) throw new CommunitiesAlreadyAssignedException(alreadyAssignedCommunities);

            var now = DateTime.UtcNow;
            var newCommunities = cmd.Communities
                .Where(c => !team.AssignedCommunities.Any(ac => ac.Code == c))
                .Select(c => new Resources.Teams.AssignedCommunity { Code = c, DateAssigned = now });
            team.AssignedCommunities = team.AssignedCommunities.Concat(newCommunities).ToArray();
            await teamRepository.SaveTeam(team);
        }

        public async Task Handle(UnassignCommunitiesFromTeamCommand cmd)
        {
            var team = (await teamRepository.QueryTeams(new TeamQuery { Id = cmd.TeamId })).Items.SingleOrDefault();
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            team.AssignedCommunities = team.AssignedCommunities.Where(c => !cmd.Communities.Contains(c.Code));
            await teamRepository.SaveTeam(team);
        }

        public async Task<LogInUserResponse> Handle(LogInUserCommand cmd)
        {
            var member = (await teamRepository.GetMembers(userName: cmd.UserName, includeStatuses: activeOnlyStatus)).SingleOrDefault();
            if (member == null) return new FailedLogin { Reason = $"User {cmd.UserName} not found" };
            if (member.ExternalUserId != null && member.ExternalUserId != cmd.UserId)
                throw new BusinessLogicException($"User {cmd.UserName} has external id {member.ExternalUserId} but trying to log in with user id {cmd.UserId}");
            if (member.ExternalUserId == null && member.LastSuccessfulLogin.HasValue)
                throw new BusinessLogicException($"User {cmd.UserName} has no external id but somehow logged in already");

            if (!member.LastSuccessfulLogin.HasValue || string.IsNullOrEmpty(member.ExternalUserId))
            {
                member.ExternalUserId = cmd.UserId;
            }

            member.LastSuccessfulLogin = DateTime.UtcNow;

            await teamRepository.SaveMember(member);

            return new SuccessfulLogin { Profile = mapper.Map<UserProfile>(member) };
        }

        public async Task Handle(SignResponderAgreementCommand cmd)
        {
            var member = (await teamRepository.GetMembers(userName: cmd.UserName, includeStatuses: activeOnlyStatus)).SingleOrDefault();
            if (member == null) throw new NotFoundException($"team member not found", cmd.UserName);

            member.AgreementSignDate = cmd.SignatureDate;
            await teamRepository.SaveMember(member);
        }

        public async Task<SuppliersQueryResult> Handle(SuppliersQuery query)
        {
            if (!string.IsNullOrEmpty(query.TeamId))
            {
                var suppliers = (await supplierRepository.QuerySupplier(new SuppliersByTeamQuery
                {
                    TeamId = query.TeamId,
                    ActiveOnly = false
                })).Items;

                var res = mapper.Map<IEnumerable<Shared.Contracts.Suppliers.Supplier>>(suppliers);
                return new SuppliersQueryResult { Items = res };
            }
            else if (!string.IsNullOrEmpty(query.SupplierId) || !string.IsNullOrEmpty(query.LegalName) || !string.IsNullOrEmpty(query.GSTNumber))
            {
                var suppliers = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
                {
                    SupplierId = query.SupplierId,
                    LegalName = query.LegalName,
                    GSTNumber = query.GSTNumber,
                })).Items;

                var res = mapper.Map<IEnumerable<Shared.Contracts.Suppliers.Supplier>>(suppliers);
                return new SuppliersQueryResult { Items = res };
            }
            else
            {
                return new SuppliersQueryResult { Items = Array.Empty<Shared.Contracts.Suppliers.Supplier>() };
            }
        }

        public async Task<string> Handle(SaveSupplierCommand cmd)
        {
            var supplier = mapper.Map<Resources.Suppliers.Supplier>(cmd.Supplier);
            var res = await supplierRepository.ManageSupplier(new SaveSupplier { Supplier = supplier });

            return res.SupplierId;
        }

        public async Task<string> Handle(RemoveSupplierCommand cmd)
        {
            var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
            {
                SupplierId = cmd.SupplierId,
            })).Items.SingleOrDefault(m => m.Id == cmd.SupplierId);
            if (supplier == null) throw new NotFoundException($"Supplier {cmd.SupplierId} not found", cmd.SupplierId);

            supplier.Team.Id = null;
            supplier.SharedWithTeams = Array.Empty<Resources.Suppliers.Team>();
            var res = await supplierRepository.ManageSupplier(new SaveSupplier { Supplier = supplier });

            return res.SupplierId;
        }

        public async Task<string> Handle(ActivateSupplierCommand cmd)
        {
            var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
            {
                SupplierId = cmd.SupplierId,
            })).Items.SingleOrDefault(m => m.Id == cmd.SupplierId);
            if (supplier == null) throw new NotFoundException($"Supplier {cmd.SupplierId} not found", cmd.SupplierId);

            supplier.Status = Resources.Suppliers.SupplierStatus.Active;
            var res = await supplierRepository.ManageSupplier(new SaveSupplier { Supplier = supplier });

            return res.SupplierId;
        }

        public async Task<string> Handle(DeactivateSupplierCommand cmd)
        {
            var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
            {
                SupplierId = cmd.SupplierId,
            })).Items.SingleOrDefault(m => m.Id == cmd.SupplierId);
            if (supplier == null) throw new NotFoundException($"Supplier {cmd.SupplierId} not found", cmd.SupplierId);

            supplier.Status = Resources.Suppliers.SupplierStatus.Inactive;
            var res = await supplierRepository.ManageSupplier(new SaveSupplier { Supplier = supplier });

            return res.SupplierId;
        }

        public async Task<string> Handle(ClaimSupplierCommand cmd)
        {
            var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
            {
                SupplierId = cmd.SupplierId,
            })).Items.SingleOrDefault(m => m.Id == cmd.SupplierId);
            if (supplier == null) throw new NotFoundException($"Supplier {cmd.SupplierId} not found", cmd.SupplierId);
            if (supplier.Team != null && supplier.Team.Id != null) throw new BusinessLogicException($"Supplier already has a primary team");

            supplier.Team = new Resources.Suppliers.Team { Id = cmd.TeamId };
            supplier.Status = Resources.Suppliers.SupplierStatus.Active;
            var res = await supplierRepository.ManageSupplier(new SaveSupplier { Supplier = supplier });

            return res.SupplierId;
        }

        public async Task<string> Handle(ShareSupplierWithTeamCommand cmd)
        {
            var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
            {
                SupplierId = cmd.SupplierId,
            })).Items.SingleOrDefault(m => m.Id == cmd.SupplierId);
            if (supplier == null) throw new NotFoundException($"Supplier {cmd.SupplierId} not found", cmd.SupplierId);
            if (supplier.Team.Id == cmd.TeamId) throw new BusinessLogicException("Can not share with primary team");
            if (supplier.SharedWithTeams.Any(t => t.Id == cmd.TeamId)) throw new BusinessLogicException("Already shared with this team");

            var team = new Resources.Suppliers.Team { Id = cmd.TeamId };
            supplier.SharedWithTeams = supplier.SharedWithTeams.Concat(new[] { team });
            var res = await supplierRepository.ManageSupplier(new SaveSupplier { Supplier = supplier });

            return res.SupplierId;
        }

        public async Task<string> Handle(UnshareSupplierWithTeamCommand cmd)
        {
            var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
            {
                SupplierId = cmd.SupplierId,
            })).Items.SingleOrDefault(m => m.Id == cmd.SupplierId);
            if (supplier == null) throw new NotFoundException($"Supplier {cmd.SupplierId} not found", cmd.SupplierId);
            if (supplier.Team.Id == cmd.TeamId) throw new BusinessLogicException("Can not remove primary team");
            if (!supplier.SharedWithTeams.Any(t => t.Id == cmd.TeamId)) throw new BusinessLogicException("Not shared with this team");

            supplier.SharedWithTeams = supplier.SharedWithTeams.Where(t => t.Id != cmd.TeamId);
            var res = await supplierRepository.ManageSupplier(new SaveSupplier { Supplier = supplier });

            return res.SupplierId;
        }

        public async Task<CountriesQueryResponse> Handle(CountriesQuery _)
        {
            var countries = mapper.Map<IEnumerable<Shared.Contracts.Metadata.Country>>(await metadataRepository.GetCountries());

            return new CountriesQueryResponse { Items = countries };
        }

        public async Task<StateProvincesQueryResponse> Handle(StateProvincesQuery req)
        {
            var stateProvinces = mapper.Map<IEnumerable<Shared.Contracts.Metadata.StateProvince>>(await metadataRepository.GetStateProvinces());

            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                stateProvinces = stateProvinces.Where(sp => sp.CountryCode == req.CountryCode);
            }

            return new StateProvincesQueryResponse { Items = stateProvinces };
        }

        public async Task<CommunitiesQueryResponse> Handle(CommunitiesQuery req)
        {
            var communities = mapper.Map<IEnumerable<Shared.Contracts.Metadata.Community>>(await metadataRepository.GetCommunities());
            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                communities = communities.Where(c => c.CountryCode == req.CountryCode);
            }
            if (!string.IsNullOrEmpty(req.StateProvinceCode))
            {
                communities = communities.Where(c => c.StateProvinceCode == req.StateProvinceCode);
            }

            if (req.Types != null && req.Types.Any())
            {
                var types = req.Types.Select(t => t.ToString()).ToArray();
                communities = communities.Where(c => types.Any(t => t == c.Type.ToString()));
            }

            return new CommunitiesQueryResponse { Items = communities };
        }

        public async Task<SecurityQuestionsQueryResponse> Handle(SecurityQuestionsQuery _)
        {
            return new SecurityQuestionsQueryResponse { Items = await metadataRepository.GetSecurityQuestions() };
        }

        public async Task<OutageQueryResponse> Handle(Shared.Contracts.Metadata.OutageQuery query)
        {
            var unplannedOutage = (await essContextStatusReporter.IsBroken())
                ? new Shared.Contracts.Metadata.OutageInformation { Content = "Unplanned outage detected" }
                : null;

            if (unplannedOutage == null)
            {
                var plannedOutages = mapper.Map<IEnumerable<Shared.Contracts.Metadata.OutageInformation>>(await metadataRepository.GetPlannedOutages(new Resources.Metadata.OutageQuery
                {
                    DisplayDate = DateTime.UtcNow,
                    PortalType = Enum.Parse<Resources.Metadata.PortalType>(query.PortalType.ToString())
                }));

                return new OutageQueryResponse { OutageInfo = plannedOutages.OrderBy(o => o.OutageStartDate).FirstOrDefault() };
            }
            else
            {
                return new OutageQueryResponse { OutageInfo = unplannedOutage };
            }
        }
    }
}
