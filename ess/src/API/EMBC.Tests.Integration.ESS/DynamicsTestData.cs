using System;
using System.Collections.ObjectModel;
using System.Linq;
using EMBC.ESS.Resources.Evacuations;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsTestData
    {
        private readonly string testPrefix;
        private readonly era_essteam team1;
        private readonly era_essteam team2;
        private readonly era_essteam team3;
        private readonly era_essteam team4;
        private readonly era_essteamuser team1Tier4Member;
        private readonly era_essteamuser team2Tier1Member;
        private readonly string activeTaskId;
        private readonly string inactiveTaskId;
        private readonly era_jurisdiction[] jurisdictions;
        private readonly contact testContact;
        private readonly era_task activeTask;
        private readonly era_task inactiveTask;
        private readonly era_evacuationfile testEvacuationfile;
        private readonly era_evacuationfile testPaperEvacuationFile;
        private readonly era_supplier supplierA;
        private readonly era_supplier supplierB;
        private readonly era_supplier supplierC;
        private readonly era_supplier inactiveSupplier;
        private readonly era_country canada;
        private readonly era_provinceterritories bc;

        public string[] Commmunities => jurisdictions.Select(j => j.era_jurisdictionid.GetValueOrDefault().ToString()).ToArray();

        public string TestPrefix => testPrefix;
        public string Team1Id => team1.era_essteamid.GetValueOrDefault().ToString();
        public string Team1Name => team1.era_name;
        public string Team1CommunityId => team1.era_ESSTeam_ESSTeamArea_ESSTeamID.First()._era_jurisdictionid_value.GetValueOrDefault().ToString();
        public string Team2Id => team2.era_essteamid.GetValueOrDefault().ToString();
        public string Team3Id => team3.era_essteamid.GetValueOrDefault().ToString();
        public string Team4Id => team4.era_essteamid.GetValueOrDefault().ToString();
        public string OtherCommunityId => jurisdictions.Last().era_jurisdictionid.GetValueOrDefault().ToString();
        public string Tier4TeamMemberId => team1Tier4Member.era_essteamuserid.GetValueOrDefault().ToString();
        public string OtherTeamMemberId => team2Tier1Member.era_essteamuserid.GetValueOrDefault().ToString();
        public string ActiveTaskId => activeTaskId;
        public string ActiveTaskCommunity => activeTask._era_jurisdictionid_value.GetValueOrDefault().ToString();
        public string InactiveTaskId => inactiveTaskId;
        public string ContactId => testContact.contactid.GetValueOrDefault().ToString();
        public string ContactUserId => testContact.era_bcservicescardid;
        public string ContactFirstName => testContact.firstname;
        public string ContactLastName => testContact.lastname;
        public string ContactDateOfBirth => $"{testContact.birthdate.GetValueOrDefault().Month:D2}/{testContact.birthdate.GetValueOrDefault().Day:D2}/{testContact.birthdate.GetValueOrDefault().Year:D4}";
        public string ContactPostalCode => testContact.address1_postalcode;
        public string EvacuationFileId => testEvacuationfile.era_name;
        public string PaperEvacuationFileId => testPaperEvacuationFile.era_name;
        public string PaperEvacuationFilePaperId => testPaperEvacuationFile.era_paperbasedessfile;
        public string EvacuationFileCurrentNeedsAssessmentId => testEvacuationfile._era_currentneedsassessmentid_value.GetValueOrDefault().ToString();
        public string PaperEvacuationFileNeedsAssessmentId => testPaperEvacuationFile._era_currentneedsassessmentid_value.GetValueOrDefault().ToString();
        public string EvacuationFileSecurityPhrase => testPrefix + "-securityphrase";
        public string SupplierAId => supplierA.era_supplierid.GetValueOrDefault().ToString();
        public string SupplierAName => supplierA.era_suppliername;
        public string SupplierALegalName => supplierA.era_name;
        public string SupplierAGST => supplierA.era_gstnumber;
        public string SupplierBId => supplierB.era_supplierid.GetValueOrDefault().ToString();
        public string SupplierCId => supplierC.era_supplierid.GetValueOrDefault().ToString();
        public string InactiveSupplierId => inactiveSupplier.era_supplierid.GetValueOrDefault().ToString();
        public string InactiveSupplierName => inactiveSupplier.era_suppliername;
        public string InactiveSupplierLegalName => inactiveSupplier.era_name;
        public string InactiveSupplierGST => inactiveSupplier.era_gstnumber;
        public string[] SupportIds => testEvacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId.Select(s => s.era_name).ToArray();
        public string[] ReferralIds => testEvacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId.Where(s => s.era_supportdeliverytype == 174360000).Select(s => s.era_name).ToArray();
        public string[] ETransferIds => testEvacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId.Where(s => s.era_supportdeliverytype == 174360001).Select(s => s.era_name).ToArray();

        public string[] HouseholdMemberIds => testEvacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid.Select(s => s.era_householdmemberid?.ToString() ?? string.Empty).ToArray();

        public DynamicsTestData(IEssContextFactory essContextFactory)
        {
            var essContext = essContextFactory.Create();
            jurisdictions = essContext.era_jurisdictions.OrderBy(j => j.era_jurisdictionid).ToArray();
            canada = essContext.era_countries.Where(c => c.era_countrycode == "CAN").Single();
            bc = essContext.era_provinceterritorieses.Where(c => c.era_code == "BC").Single();
#if DEBUG
            this.testPrefix = $"autotest-dev";
#else
            this.testPrefix = $"autotest-{TestHelper.GenerateNewUniqueId(string.Empty)}";
#endif
            this.activeTaskId = testPrefix + "-active-task";
            this.inactiveTaskId = testPrefix + "-inactive-task";

            this.team1 = GetOrCreateTeam(essContext, testPrefix + "-team1");

            this.team2 = GetOrCreateTeam(essContext, testPrefix + "-team2");
            this.team3 = GetOrCreateTeam(essContext, testPrefix + "-team3");
            this.team4 = GetOrCreateTeam(essContext, testPrefix + "-team4");

            team1Tier4Member = GetOrCreateTeamMember(essContext, team1, testPrefix + "team1-tier4", EMBC.ESS.Resources.Teams.TeamUserRoleOptionSet.Tier4);
            GetOrCreateTeamMember(essContext, team1, testPrefix + "team1-tier3", EMBC.ESS.Resources.Teams.TeamUserRoleOptionSet.Tier3);
            GetOrCreateTeamMember(essContext, team1, testPrefix + "team1-tier2", EMBC.ESS.Resources.Teams.TeamUserRoleOptionSet.Tier2);
            GetOrCreateTeamMember(essContext, team1, testPrefix + "team1-tier1", EMBC.ESS.Resources.Teams.TeamUserRoleOptionSet.Tier1);
            team2Tier1Member = GetOrCreateTeamMember(essContext, team2, testPrefix + "team2-tier1", EMBC.ESS.Resources.Teams.TeamUserRoleOptionSet.Tier1);

            this.activeTask = essContext.era_tasks.Where(t => t.era_name == activeTaskId).SingleOrDefault() ?? CreateTask(essContext, activeTaskId, DateTime.UtcNow);

            this.inactiveTask = essContext.era_tasks.Where(t => t.era_name == activeTaskId).SingleOrDefault() ?? CreateTask(essContext, inactiveTaskId, DateTime.UtcNow.AddDays(-7));

            this.testContact = essContext.contacts.Where(c => c.firstname == this.testPrefix + "-first" && c.lastname == this.testPrefix + "-last").SingleOrDefault() ?? CreateContact(essContext);

            this.supplierA = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-A").SingleOrDefault() ?? CreateSupplier(essContext, "A", this.team1);
            this.supplierB = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-B").SingleOrDefault() ?? CreateSupplier(essContext, "B", this.team1);
            this.supplierC = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-C").SingleOrDefault() ?? CreateSupplier(essContext, "C", this.team2);
            this.inactiveSupplier = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-inactive").SingleOrDefault() ?? CreateSupplier(essContext, "inactive", null);

            var evacuationfile = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Expand(f => f.era_Registrant)
                .Where(f => f.era_name == testPrefix + "-digital").SingleOrDefault();

            if (evacuationfile == null)
            {
                evacuationfile = CreateEvacuationFile(essContext, this.testContact, testPrefix + "-digital");
            }
            else
            {
                essContext.LoadProperty(evacuationfile, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));
                CreateEvacueeSupports(essContext, evacuationfile, this.testContact, this.team1Tier4Member, testPrefix);
            }

            var paperEvacuationfile = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Expand(f => f.era_Registrant)
                .Where(f => f.era_name == testPrefix + "-paper").SingleOrDefault();

            if (paperEvacuationfile == null)
            {
                paperEvacuationfile = CreateEvacuationFile(essContext, this.testContact, testPrefix + "-paper", testPrefix + "-paper");
                CreateEvacueeSupports(essContext, paperEvacuationfile, this.testContact, this.team1Tier4Member, testPrefix);
            }
            else
            {
                essContext.LoadProperty(paperEvacuationfile, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));
            }

            essContext.SaveChanges();

            essContext.DeactivateObject(this.inactiveSupplier, 2);
            essContext.SaveChanges();
            essContext.DetachAll();

            this.testEvacuationfile = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Expand(f => f.era_Registrant)
                .Where(f => f.era_evacuationfileid == evacuationfile.era_evacuationfileid).Single();

            essContext.LoadProperty(this.testEvacuationfile, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));
            essContext.LoadProperty(this.testEvacuationfile, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));

            this.testPaperEvacuationFile = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Expand(f => f.era_Registrant)
                .Where(f => f.era_evacuationfileid == paperEvacuationfile.era_evacuationfileid).Single();

            essContext.LoadProperty(this.testPaperEvacuationFile, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));
            essContext.LoadProperty(this.testPaperEvacuationFile, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));

            essContext.DetachAll();
        }

        public string RandomCommunity => Commmunities.Skip(Random.Shared.Next(jurisdictions.Length - 1)).First().ToString();

        private era_essteam GetOrCreateTeam(EssContext essContext, string teamName)
        {
            var team = essContext.era_essteams.Where(t => t.era_name == teamName).SingleOrDefault();
            if (team != null)
            {
                essContext.LoadProperty(team, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID));
            }
            else
            {
                team = CreateTeam(essContext, teamName);
            }
            return team;
        }

        private era_essteam CreateTeam(EssContext essContext, string teamName)
        {
            var team = new era_essteam
            {
                era_essteamid = Guid.NewGuid(),
                era_name = teamName,
            };
            essContext.AddToera_essteams(team);

            var assignedCommunities = essContext.era_essteamareas.AsEnumerable().Select(a => a._era_jurisdictionid_value).OrderBy(id => id).ToList();
            if (this.team1 != null)
            {
                assignedCommunities.Add(this.team1.era_ESSTeam_ESSTeamArea_ESSTeamID.FirstOrDefault()?._era_jurisdictionid_value);
            }

            var jurisdictionsToAssign = jurisdictions.Where(j => !assignedCommunities.Contains(j.era_jurisdictionid.GetValueOrDefault())).Take(1).ToArray();
            foreach (var jurisdiction in jurisdictionsToAssign)
            {
                var teamArea = new era_essteamarea { era_essteamareaid = Guid.NewGuid() };
                essContext.AddToera_essteamareas(teamArea);
                essContext.SetLink(teamArea, nameof(era_essteamarea.era_JurisdictionID), jurisdiction);
                essContext.SetLink(teamArea, nameof(era_essteamarea.era_ESSTeamID), team);
                essContext.AddLink(team, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID), teamArea);
                teamArea._era_jurisdictionid_value = jurisdiction.era_jurisdictionid;
                team.era_ESSTeam_ESSTeamArea_ESSTeamID.Add(teamArea);
            }

            return team;
        }

        private era_essteamuser GetOrCreateTeamMember(EssContext essContext, era_essteam team, string name, EMBC.ESS.Resources.Teams.TeamUserRoleOptionSet role)
        {
            var firstName = $"{name}-first";
            var lastName = $"{name}-last";
            var user = essContext.era_essteamusers.Where(tu => tu.era_firstname == firstName && tu.era_lastname == lastName).SingleOrDefault();
            if (user == null) user = CreateTeamMember(essContext, team, firstName, lastName, role);
            return user;
        }

        private era_essteamuser CreateTeamMember(EssContext essContext, era_essteam team, string firstName, string lastName, EMBC.ESS.Resources.Teams.TeamUserRoleOptionSet role)
        {
            var member = new era_essteamuser
            {
                era_essteamuserid = Guid.NewGuid(),
                era_firstname = firstName,
                era_lastname = lastName,
                era_role = (int)role,
                era_externalsystemusername = this.testPrefix + "-" + Guid.NewGuid().ToString("N").Substring(0, 4)
            };
            essContext.AddToera_essteamusers(member);
            essContext.SetLink(member, nameof(era_essteamuser.era_ESSTeamId), team);

            return member;
        }

        private era_task CreateTask(EssContext essContext, string taskId, DateTime startDate)
        {
            var task = new era_task
            {
                era_taskid = Guid.NewGuid(),
                era_name = taskId,
                era_taskstartdate = startDate,
                era_currentdateandtime = startDate.AddDays(3),
            };
            essContext.AddToera_tasks(task);

            var jurisdiction = jurisdictions.SingleOrDefault(j => j.era_jurisdictionid == team1.era_ESSTeam_ESSTeamArea_ESSTeamID.FirstOrDefault()?._era_jurisdictionid_value);
            if (jurisdiction != null)
            {
                essContext.SetLink(task, nameof(era_task.era_JurisdictionID), jurisdiction);
                task._era_jurisdictionid_value = jurisdiction.era_jurisdictionid;
            }

            return task;
        }

        private contact CreateContact(EssContext essContext)
        {
            var contact = new contact
            {
                contactid = Guid.NewGuid(),
                firstname = this.testPrefix + "-first",
                lastname = this.testPrefix + "-last",
                era_bcservicescardid = this.testPrefix + "-userId",
                gendercode = Random.Shared.Next(1, 3),
                address1_line1 = this.testPrefix + "-line1",
                address1_line2 = this.testPrefix + "-line2",
                address1_postalcode = "V8Z 7X9",
                address1_country = "CAN",
                address1_stateorprovince = "BC",
                birthdate = new Date(1999, 5, 10)
            };

            essContext.AddTocontacts(contact);
            essContext.SetLink(contact, nameof(contact.era_City), jurisdictions.Skip(Random.Shared.Next(jurisdictions.Length - 1)).First());
            essContext.SetLink(contact, nameof(contact.era_ProvinceState), bc);
            essContext.SetLink(contact, nameof(contact.era_Country), canada);
            return contact;
        }

        private era_evacuationfile CreateEvacuationFile(EssContext essContext, contact primaryContact, string fileId, string? paperFileNumber = null)
        {
            var file = new era_evacuationfile()
            {
                era_evacuationfileid = Guid.NewGuid(),
                era_name = fileId,
                era_evacuationfiledate = DateTime.UtcNow,
                era_securityphrase = EvacuationFileSecurityPhrase,
                era_paperbasedessfile = paperFileNumber
            };

            essContext.AddToera_evacuationfiles(file);
            essContext.SetLink(file, nameof(era_evacuationfile.era_TaskId), this.activeTask);
            var needsAssessment = new era_needassessment
            {
                era_needassessmentid = Guid.NewGuid(),
                era_needsassessmenttype = (int)NeedsAssessmentTypeOptionSet.Preliminary,
                era_insurancecoverage = (int)InsuranceOptionOptionSet.Unknown
            };

            essContext.AddToera_needassessments(needsAssessment);

            essContext.SetLink(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid), needsAssessment);
            essContext.AddLink(file, nameof(era_evacuationfile.era_needsassessment_EvacuationFile), needsAssessment);
            essContext.SetLink(file, nameof(era_evacuationfile.era_Registrant), primaryContact);

            var primaryMember = new era_householdmember
            {
                era_householdmemberid = Guid.NewGuid(),
                era_dateofbirth = primaryContact.birthdate,
                era_firstname = primaryContact.firstname,
                era_lastname = primaryContact.lastname,
                era_gender = primaryContact.gendercode,
                era_initials = primaryContact.era_initial,
                era_isprimaryregistrant = true
            };

            var householdMembers = Enumerable.Range(1, Random.Shared.Next(1, 5)).Select(i => new era_householdmember
            {
                era_householdmemberid = Guid.NewGuid(),
                era_dateofbirth = new Date(2000 + i, i, i),
                era_firstname = $"{testPrefix}-member-first-{i}",
                era_lastname = $"{testPrefix}-member-last-{i}",
                era_gender = Random.Shared.Next(1, 3),
                era_isprimaryregistrant = false
            }).Prepend(primaryMember)
            .Append(new era_householdmember
            {
                era_householdmemberid = Guid.NewGuid(),
                era_dateofbirth = new Date(1998, 1, 2),
                era_firstname = $"{testPrefix}-member-no-registrant-first",
                era_lastname = $"{testPrefix}-member-no-registrant-last",
                era_gender = Random.Shared.Next(1, 3),
                era_isprimaryregistrant = false
            }).ToArray();

            foreach (var member in householdMembers)
            {
                essContext.AddToera_householdmembers(member);
                essContext.SetLink(member, nameof(era_householdmember.era_EvacuationFileid), file);
                essContext.AddLink(member, nameof(era_householdmember.era_era_householdmember_era_needassessment), needsAssessment);
                if (member.era_isprimaryregistrant == true)
                {
                    essContext.SetLink(member, nameof(era_householdmember.era_Registrant), primaryContact);
                    essContext.SetLink(file, nameof(era_evacuationfile.era_Registrant), primaryContact);
                }
            }

            file.era_era_evacuationfile_era_householdmember_EvacuationFileid = new Collection<era_householdmember>(householdMembers);
            return file;
        }

        private void CreateEvacueeSupports(EssContext essContext, era_evacuationfile file, contact contact, era_essteamuser creator, string prefix)
        {
            var referralSupportTypes = new[] { 174360001, 174360002, 174360003, 174360004, 174360007 };
            var etransferSupportTypes = new[] { 174360000, 174360005, 174360006, 174360008 };

            var referrals = referralSupportTypes.Select((t, i) => new era_evacueesupport
            {
                era_evacueesupportid = Guid.NewGuid(),
                era_suppliernote = $"{prefix}-ref-{i}",
                era_validfrom = DateTime.UtcNow.AddDays(-3),
                era_validto = DateTime.UtcNow.AddDays(3),
                era_supporttype = t,
                era_supportdeliverytype = 174360000, //referral
                statuscode = 1, //active
                statecode = 0
            }).ToArray();
            var etransfers = etransferSupportTypes.Select((t, i) => new era_evacueesupport
            {
                era_evacueesupportid = Guid.NewGuid(),
                era_suppliernote = $"{prefix}-etr-{i}",
                era_validfrom = DateTime.UtcNow.AddDays(-3),
                era_validto = DateTime.UtcNow.AddDays(3),
                era_supporttype = t,
                era_supportdeliverytype = 174360001, //etransfer
                era_totalamount = 100m,
                statuscode = 174360002, //approved
                statecode = 0
            }).ToArray();

            foreach (var support in referrals)
            {
                essContext.AddToera_evacueesupports(support);
                essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId), support);
                essContext.SetLink(support, nameof(era_evacueesupport.era_IssuedById), creator);
            }

            foreach (var support in etransfers)
            {
                essContext.AddToera_evacueesupports(support);
                essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId), support);
                essContext.SetLink(support, nameof(era_evacueesupport.era_IssuedById), creator);
                essContext.SetLink(support, nameof(era_evacueesupport.era_PayeeId), contact);
            }

            var supports = referrals.Concat(etransfers).ToArray();
            var householdMembers = file.era_era_evacuationfile_era_householdmember_EvacuationFileid.ToArray();
            foreach (var support in supports)
            {
                var supportHouseholdMembers = householdMembers.TakeRandom();
                foreach (var member in supportHouseholdMembers)
                {
                    essContext.AddLink(member, nameof(era_householdmember.era_era_householdmember_era_evacueesupport), support);
                }
            }
        }

        private era_supplier CreateSupplier(EssContext essContext, string identifier, era_essteam? assignedTeam)
        {
            var supplier = new era_supplier()
            {
                era_supplierid = Guid.NewGuid(),
                era_name = testPrefix + "-supplier-" + identifier,
                era_suppliername = testPrefix + "-supplier-name-" + identifier,
                era_gstnumber = "R-" + testPrefix + "-" + identifier,
                era_addressline1 = testPrefix + "-line1",
                era_addressline2 = testPrefix + "-line2",
                era_postalcode = "v2v 2v2",
            };

            essContext.AddToera_suppliers(supplier);
            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedCity), jurisdictions.Skip(Random.Shared.Next(jurisdictions.Length - 1)).First());
            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedCountry), canada);
            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedProvinceState), bc);

            if (assignedTeam != null) AssignSupplierToTeam(essContext, supplier, assignedTeam);

            return supplier;
        }

        private void AssignSupplierToTeam(EssContext essContext, era_supplier supplier, era_essteam team)
        {
            var ts = new era_essteamsupplier()
            {
                era_essteamsupplierid = Guid.NewGuid(),
                era_active = true,
                era_isprimarysupplier = true
            };

            essContext.AddToera_essteamsuppliers(ts);

            essContext.AddLink(supplier, nameof(era_supplier.era_era_supplier_era_essteamsupplier_SupplierId), ts);
            essContext.SetLink(ts, nameof(era_essteamsupplier.era_SupplierId), supplier);

            essContext.AddLink(team, nameof(era_essteam.era_essteam_essteamsupplier_ESSTeamID), ts);
            essContext.SetLink(ts, nameof(era_essteamsupplier.era_ESSTeamID), team);
        }
    }
}
