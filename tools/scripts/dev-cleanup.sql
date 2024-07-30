-- Dynamics integration tests cleanup script
-- To be used with XRMToolBox's SQL4CDS plugin
-- Run in the dev environment context to clean up all integration tests related content
delete from contact where firstname like 'autotest-%'
delete from contact where firstname like '%PriRegTestFirst'
delete from era_evacuationfile where era_name like 'autotest-%'
delete from era_bcscaddress where era_registrant is null
delete from era_essteam where era_name like 'autotest-%'
delete from era_supplier where era_name like 'autotest-%'
delete from era_evacuationfile where era_registrant is null
delete from era_eligibilitycheck where era_essfile is null
delete from era_needassessment where era_evacuationfile is null
delete from era_evacueesupport where era_evacuationfileid is null
delete from era_evacueesupport where era_needsassessmentid is null
delete from era_etransfertransaction where era_payee is null
delete from era_etransfertransaction where statuscode=174360000
delete from era_evacueesupport where era_supportdeliverytype=174360001 and era_payeeid is null
delete from era_householdmember where era_evacuationfileid is null
delete from era_animal where era_essfileid is null
delete from era_essfilenote where era_essfileid is null
delete from era_evacueeemailinvite where era_registrant is null
delete from era_essteamarea where era_essteamid is null
delete from era_essteamuser where era_essteamid is null
delete from era_essteamsupplier where era_essteamid is null or era_supplierid is null
delete from era_task where era_name like 'autotest-%'
delete from era_selfservesupportlimits where era_task is null
delete from era_eligiblesupport where era_eligibilitycheck is null