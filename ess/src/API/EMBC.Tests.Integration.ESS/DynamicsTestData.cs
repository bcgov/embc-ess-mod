using System;
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
        private readonly era_essteamuser tier4TeamMember;
        private readonly string activeTaskId;
        private readonly string inactiveTaskId;
        private readonly era_jurisdiction[] jurisdictions;
        private readonly contact contact;
        private readonly era_evacuationfile evacuationfile;

        public string[] Commmunities => jurisdictions.Select(j => j.era_jurisdictionid.Value.ToString()).ToArray();

        public string TestPrefix => testPrefix;
        public string TeamId => team.era_essteamid.Value.ToString();
        public string Tier4TeamMemberId => tier4TeamMember.era_essteamuserid.Value.ToString();
        public string ActiveTaskId => activeTaskId;
        public string InactiveTaskId => inactiveTaskId;
        public string ContactId => contact.contactid.Value.ToString();
        public string ContactUserId => contact.era_bcservicescardid;
        public string EvacuationFileId => evacuationfile.era_name;
        public string CurrentNeedsAssessmentId => evacuationfile._era_currentneedsassessmentid_value.Value.ToString();
        public string EvacuationFileSecurityPhrase => testPrefix + "-securityphrase";

        public DynamicsTestData(EssContext essContext)
        {
            this.essContext = essContext;
            this.testPrefix = $"autotest-{Guid.NewGuid().ToString().Substring(0, 4)}";

            this.activeTaskId = testPrefix + "-active-task";
            this.inactiveTaskId = testPrefix + "-inactive-task";

            jurisdictions = essContext.era_jurisdictions.OrderBy(j => j.era_jurisdictionid.Value).ToArray();

            this.team = CreateTeam(Guid.NewGuid());
            this.tier4TeamMember = CreateTeamMember(team, Guid.NewGuid());
            CreateTask(activeTaskId, DateTime.Now);
            CreateTask(inactiveTaskId, DateTime.Now.AddDays(-7));
            this.contact = CreateContact();

            var file = CreateEvacuationFile(this.contact);

            essContext.SaveChanges();
            essContext.DetachAll();

            this.evacuationfile = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Expand(f => f.era_Registrant)
                .Where(f => f.era_evacuationfileid == file.era_evacuationfileid).Single();

            essContext.DetachAll();
        }



        public string RandomCommunity => Commmunities.Skip(random.Next(jurisdictions.Length - 1)).First().ToString();

        private era_essteam CreateTeam(Guid id)
        {
            var team = new era_essteam
            {
                era_essteamid = id,
                era_name = testPrefix + "-team",
            };
            essContext.AddToera_essteams(team);

            var assignedCommunities = essContext.era_essteamareas.ToArray().Select(a => a._era_jurisdictionid_value).OrderBy(id => id).ToArray();

            var jurisdictionsToAssign = jurisdictions.Where(j => !assignedCommunities.Contains(j.era_jurisdictionid.Value)).Take(1).ToArray();
            foreach (var jurisdiction in jurisdictionsToAssign)
            {
                var teamArea = new era_essteamarea { era_essteamareaid = Guid.NewGuid() };
                essContext.AddToera_essteamareas(teamArea);
                essContext.SetLink(teamArea, nameof(era_essteamarea.era_JurisdictionID), jurisdiction);
                essContext.SetLink(teamArea, nameof(era_essteamarea.era_ESSTeamID), team);
            }

            return team;

        }

        private era_essteamuser CreateTeamMember(era_essteam team, Guid id)
        {
            var member = new era_essteamuser
            {
                era_essteamuserid = id,
                era_firstname = this.testPrefix + "-first",
                era_lastname = this.testPrefix + "-last",
                era_role = (int)EMBC.ESS.Resources.Team.TeamUserRoleOptionSet.Tier4
            };
            essContext.AddToera_essteamusers(member);
            essContext.SetLink(member, nameof(era_essteamuser.era_ESSTeamId), team);

            return member;
        }
        private void CreateTask(string taskId, DateTime startDate)
        {
            essContext.AddToera_tasks(new era_task
            {
                era_taskid = Guid.NewGuid(),
                era_name = taskId,
                era_taskstartdate = startDate,
                era_currentdateandtime = startDate.AddDays(3),

            });
        }
        private contact CreateContact()
        {
            var contact = new contact
            {
                contactid = Guid.NewGuid(),
                firstname = this.testPrefix + "-first",
                lastname = this.testPrefix + "-last",
                era_bcservicescardid = this.testPrefix + "-userId",
                gendercode = random.Next(1, 3)
            };
            essContext.AddTocontacts(contact);
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

            var householdMembers = Enumerable.Range(1, random.Next(10)).Select(i => new era_householdmember
            {
                era_householdmemberid = Guid.NewGuid(),
                era_dateofbirth = new Date(2000 + i, i, i),
                era_firstname = $"{testPrefix}-member-first-{i}",
                era_lastname = $"{testPrefix}-member-last-{i}",
                era_gender = random.Next(1, 3),
                era_isprimaryregistrant = false
            }).Prepend(primaryMember);

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
    }
}
