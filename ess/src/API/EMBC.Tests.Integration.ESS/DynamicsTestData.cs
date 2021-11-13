using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Resources.Cases.Evacuations;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsTestData
    {
        private Random random = new Random();
        private readonly EssContext essContext;
        private readonly string testPrefix;

        private readonly era_essteam team;
        private readonly era_essteam otherTeam;
        private readonly era_essteamuser tier4TeamMember;
        private readonly era_essteamuser otherTeamMember;
        private readonly string activeTaskId;
        private readonly string inactiveTaskId;
        private readonly era_jurisdiction[] jurisdictions;
        private readonly contact contact;
        private readonly era_task activeTask;
        private readonly era_evacuationfile evacuationfile;
        private readonly era_supplier supplierA;
        private readonly era_supplier supplierB;
        private readonly era_supplier supplierC;
        private readonly era_supplier inactiveSupplier;

        public string[] Commmunities => jurisdictions.Select(j => j.era_jurisdictionid.Value.ToString()).ToArray();

        public string TestPrefix => testPrefix;
        public string TeamId => team.era_essteamid.Value.ToString();
        public string OtherTeamId => otherTeam.era_essteamid.Value.ToString();
        public string TeamCommunityId => team.era_ESSTeam_ESSTeamArea_ESSTeamID.FirstOrDefault()?._era_jurisdictionid_value?.ToString();
        public string OtherCommunityId => jurisdictions.LastOrDefault()?.era_jurisdictionid?.ToString();
        public string Tier4TeamMemberId => tier4TeamMember.era_essteamuserid.Value.ToString();
        public string OtherTeamMemberId => otherTeamMember.era_essteamuserid.Value.ToString();
        public string ActiveTaskId => activeTaskId;
        public string ActiveTaskCommunity => activeTask._era_jurisdictionid_value?.ToString();
        public string InactiveTaskId => inactiveTaskId;
        public string ContactId => contact.contactid.Value.ToString();
        public string ContactUserId => contact.era_bcservicescardid;
        public string ContactFirstName => contact.firstname;
        public string ContactLastName => contact.lastname;
        public string ContactDateOfBirth => $"{contact.birthdate.Value.Month:D2}/{contact.birthdate.Value.Day:D2}/{contact.birthdate.Value.Year:D4}";
        public string EvacuationFileId => evacuationfile.era_name;
        public string CurrentNeedsAssessmentId => evacuationfile._era_currentneedsassessmentid_value.Value.ToString();
        public string EvacuationFileSecurityPhrase => testPrefix + "-securityphrase";
        public string SupplierAId => supplierA.era_supplierid.Value.ToString();
        public string SupplierAName => supplierA.era_suppliername;
        public string SupplierALegalName => supplierA.era_name;
        public string SupplierAGST => supplierA.era_gstnumber;
        public string SupplierBId => supplierB.era_supplierid.Value.ToString();
        public string SupplierCId => supplierC.era_supplierid.Value.ToString();
        public string InactiveSupplierId => inactiveSupplier.era_supplierid.Value.ToString();
        public string InactiveSupplierName => inactiveSupplier.era_suppliername;
        public string InactiveSupplierLegalName => inactiveSupplier.era_name;
        public string InactiveSupplierGST => inactiveSupplier.era_gstnumber;
        public string[] SupportIds => evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId.Select(s => s.era_name.ToString()).ToArray();

        public DynamicsTestData(EssContext essContext)
        {
            this.essContext = essContext;
            jurisdictions = essContext.era_jurisdictions.OrderBy(j => j.era_jurisdictionid.Value).ToArray();
            this.testPrefix = $"autotest-{Guid.NewGuid().ToString().Substring(0, 4)}";
            this.activeTaskId = testPrefix + "-active-task";
            this.inactiveTaskId = testPrefix + "-inactive-task";

#if DEBUG
            this.testPrefix = $"autotest-dev";
            this.activeTaskId = testPrefix + "-active-task";
            this.inactiveTaskId = testPrefix + "-inactive-task";

            var existingTeam = essContext.era_essteams.Where(t => t.era_name == testPrefix + "-team").FirstOrDefault();
            if (existingTeam != null)
            {
                essContext.LoadProperty(existingTeam, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID));
                this.team = existingTeam;
                var otherTeam = essContext.era_essteams.Where(t => t.era_name == testPrefix + "-team-other").FirstOrDefault();
                essContext.LoadProperty(otherTeam, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID));
                this.otherTeam = otherTeam;
                this.activeTask = essContext.era_tasks.Where(t => t.era_name == activeTaskId).FirstOrDefault();
                this.tier4TeamMember = essContext.era_essteamusers.Where(tu => tu.era_firstname == this.testPrefix + "-first" && tu.era_lastname == this.testPrefix + "-last").FirstOrDefault();
                this.otherTeamMember = essContext.era_essteamusers.Where(tu => tu.era_firstname == this.testPrefix + "-first-other" && tu.era_lastname == this.testPrefix + "-last-other").FirstOrDefault();
                this.contact = essContext.contacts.Where(c => c.firstname == this.testPrefix + "-first" && c.lastname == this.testPrefix + "-last").FirstOrDefault();
                this.supplierA = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-A").FirstOrDefault();
                this.supplierB = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-B").FirstOrDefault();
                this.supplierC = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-C").FirstOrDefault();
                this.inactiveSupplier = essContext.era_suppliers.Where(c => c.era_name == testPrefix + "-supplier-inactive").FirstOrDefault();

                this.evacuationfile = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Expand(f => f.era_Registrant)
                .Where(f => f.era_name == testPrefix + "-file").FirstOrDefault();

                essContext.LoadProperty(this.evacuationfile, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));

                return;
            }
#endif

            this.team = CreateTeam(Guid.NewGuid());
            this.otherTeam = CreateTeam(Guid.NewGuid(), "-other");
            this.tier4TeamMember = CreateTeamMember(team, Guid.NewGuid());
            this.CreateTeamMember(team, Guid.NewGuid(), "-second");
            CreateTeamMember(team, Guid.NewGuid(), "-third");
            CreateTeamMember(team, Guid.NewGuid(), "-fourth");
            this.otherTeamMember = CreateTeamMember(otherTeam, Guid.NewGuid(), "-other", EMBC.ESS.Resources.Team.TeamUserRoleOptionSet.Tier1);
            this.activeTask = CreateTask(activeTaskId, DateTime.Now);
            CreateTask(inactiveTaskId, DateTime.Now.AddDays(-7));
            this.contact = CreateContact();

            var file = CreateEvacuationFile(this.contact);

            var supports = CreateEvacueeSupports(file);

            CreateReferralPrint(file, this.tier4TeamMember, supports);

            this.supplierA = CreateSupplier("A");
            this.supplierB = CreateSupplier("B");
            this.supplierC = CreateSupplier("C");
            this.inactiveSupplier = CreateSupplier("inactive");
            CreateTeamSuppliers();

            essContext.SaveChanges();

            essContext.DeactivateObject(this.inactiveSupplier, 2);
            essContext.SaveChanges();

            essContext.DetachAll();

            this.evacuationfile = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Expand(f => f.era_Registrant)
                .Where(f => f.era_evacuationfileid == file.era_evacuationfileid).Single();

            essContext.LoadProperty(this.evacuationfile, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));

            essContext.DetachAll();
        }

        public string RandomCommunity => Commmunities.Skip(random.Next(jurisdictions.Length - 1)).First().ToString();

        private era_essteam CreateTeam(Guid id, string suffix = "")
        {
            var team = new era_essteam
            {
                era_essteamid = id,
                era_name = testPrefix + "-team" + suffix,
            };
            essContext.AddToera_essteams(team);

            var assignedCommunities = essContext.era_essteamareas.ToArray().Select(a => a._era_jurisdictionid_value).OrderBy(id => id).ToList();
            if (this.team != null)
            {
                assignedCommunities.Add(this.team.era_ESSTeam_ESSTeamArea_ESSTeamID.FirstOrDefault()?._era_jurisdictionid_value);
            }

            var jurisdictionsToAssign = jurisdictions.Where(j => !assignedCommunities.Contains(j.era_jurisdictionid.Value)).Take(1).ToArray();
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

        private era_essteamuser CreateTeamMember(era_essteam team, Guid id, string suffix = "", EMBC.ESS.Resources.Team.TeamUserRoleOptionSet role = EMBC.ESS.Resources.Team.TeamUserRoleOptionSet.Tier4)
        {
            var member = new era_essteamuser
            {
                era_essteamuserid = id,
                era_firstname = this.testPrefix + "-first" + suffix,
                era_lastname = this.testPrefix + "-last" + suffix,
                era_role = (int)role,
                era_externalsystemusername = this.testPrefix + "-" + Guid.NewGuid().ToString("N").Substring(0, 4)
            };
            essContext.AddToera_essteamusers(member);
            essContext.SetLink(member, nameof(era_essteamuser.era_ESSTeamId), team);

            return member;
        }

        private era_task CreateTask(string taskId, DateTime startDate)
        {
            var task = new era_task
            {
                era_taskid = Guid.NewGuid(),
                era_name = taskId,
                era_taskstartdate = startDate,
                era_currentdateandtime = startDate.AddDays(3),
            };
            essContext.AddToera_tasks(task);

            var jurisdiction = jurisdictions.Where(j => j.era_jurisdictionid == team.era_ESSTeam_ESSTeamArea_ESSTeamID.FirstOrDefault()?._era_jurisdictionid_value).SingleOrDefault();
            if (jurisdiction != null)
            {
                essContext.SetLink(task, nameof(era_task.era_JurisdictionID), jurisdiction);
                task._era_jurisdictionid_value = jurisdiction.era_jurisdictionid;
            }

            return task;
        }

        private contact CreateContact()
        {
            var contact = new contact
            {
                contactid = Guid.NewGuid(),
                firstname = this.testPrefix + "-first",
                lastname = this.testPrefix + "-last",
                era_bcservicescardid = this.testPrefix + "-userId",
                gendercode = random.Next(1, 3),
                address1_line1 = this.testPrefix + "-line1",
                address1_line2 = this.testPrefix + "-line2",
                address1_postalcode = "v2v 2v2",
                address1_country = "CAN",
                address1_stateorprovince = "BC",
                birthdate = new Date(1999, 5, 10)
            };

            essContext.AddTocontacts(contact);
            essContext.SetLink(contact, nameof(contact.era_City), jurisdictions.First());
            return contact;
        }

        private era_evacuationfile CreateEvacuationFile(contact primaryContact)
        {
            var file = new era_evacuationfile()
            {
                era_evacuationfileid = Guid.NewGuid(),
                era_name = testPrefix + "-file",
                era_evacuationfiledate = DateTime.Now,
                era_securityphrase = EvacuationFileSecurityPhrase
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

            var householdMembers = Enumerable.Range(1, random.Next(1, 10)).Select(i => new era_householdmember
            {
                era_householdmemberid = Guid.NewGuid(),
                era_dateofbirth = new Date(2000 + i, i, i),
                era_firstname = $"{testPrefix}-member-first-{i}",
                era_lastname = $"{testPrefix}-member-last-{i}",
                era_gender = random.Next(1, 3),
                era_isprimaryregistrant = false
            }).Prepend(primaryMember)
            .Append(new era_householdmember
            {
                era_householdmemberid = Guid.NewGuid(),
                era_dateofbirth = new Date(1998, 1, 2),
                era_firstname = $"{testPrefix}-member-no-registrant-first",
                era_lastname = $"{testPrefix}-member-no-registrant-last",
                era_gender = random.Next(1, 3),
                era_isprimaryregistrant = false
            });

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

            return file;
        }

        private IEnumerable<era_evacueesupport> CreateEvacueeSupports(era_evacuationfile file)
        {
            var supports = Enumerable.Range(1, random.Next(1, 5)).Select(i => new era_evacueesupport
            {
                era_evacueesupportid = Guid.NewGuid(),
                era_name = $"{testPrefix}-support-{i}",
                era_validfrom = DateTime.Now.AddDays(-3),
                era_validto = DateTime.Now.AddDays(3),
                era_supporttype = 174360006
            }).ToArray();

            foreach (var support in supports)
            {
                essContext.AddToera_evacueesupports(support);
                essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId), support);
            }

            return supports;
        }

        private era_referralprint CreateReferralPrint(era_evacuationfile file, era_essteamuser member, IEnumerable<era_evacueesupport> supports)
        {
            var referralPrint = new era_referralprint()
            {
                era_referralprintid = Guid.NewGuid(),
                era_name = testPrefix + "-referral",
            };

            essContext.AddToera_referralprints(referralPrint);
            essContext.SetLink(referralPrint, nameof(era_referralprint.era_ESSFileId), file);
            essContext.SetLink(referralPrint, nameof(era_referralprint.era_RequestingUserId), member);

            foreach (var support in supports)
            {
                essContext.AddLink(referralPrint, nameof(era_referralprint.era_era_referralprint_era_evacueesupport), support);
            }

            return referralPrint;
        }

        private era_supplier CreateSupplier(string identifier)
        {
            var supplier = new era_supplier()
            {
                era_supplierid = Guid.NewGuid(),
                era_name = testPrefix + "-supplier-" + identifier,
                era_suppliername = testPrefix + "-supplier-name-" + identifier,
                era_gstnumber = "R-" + testPrefix + "-" + identifier,
                era_addressline1 = testPrefix + "-line1",
            };

            essContext.AddToera_suppliers(supplier);
            return supplier;
        }

        private void CreateTeamSuppliers()
        {
            var teamSupplier1 = new era_essteamsupplier()
            {
                era_essteamsupplierid = Guid.NewGuid(),
                era_active = true,
                era_isprimarysupplier = true
            };

            essContext.AddToera_essteamsuppliers(teamSupplier1);
            essContext.AddLink(supplierA, nameof(era_supplier.era_era_supplier_era_essteamsupplier_SupplierId), teamSupplier1);
            essContext.SetLink(teamSupplier1, nameof(era_essteamsupplier.era_SupplierId), supplierA);

            essContext.AddLink(team, nameof(era_essteam.era_essteam_essteamsupplier_ESSTeamID), teamSupplier1);
            essContext.SetLink(teamSupplier1, nameof(era_essteamsupplier.era_ESSTeamID), team);

            var teamSupplier2 = new era_essteamsupplier()
            {
                era_essteamsupplierid = Guid.NewGuid(),
                era_active = true,
                era_isprimarysupplier = true
            };

            essContext.AddToera_essteamsuppliers(teamSupplier2);
            essContext.AddLink(supplierC, nameof(era_supplier.era_era_supplier_era_essteamsupplier_SupplierId), teamSupplier2);
            essContext.SetLink(teamSupplier2, nameof(era_essteamsupplier.era_SupplierId), supplierC);

            essContext.AddLink(otherTeam, nameof(era_essteam.era_essteam_essteamsupplier_ESSTeamID), teamSupplier2);
            essContext.SetLink(teamSupplier2, nameof(era_essteamsupplier.era_ESSTeamID), otherTeam);
        }
    }
}
