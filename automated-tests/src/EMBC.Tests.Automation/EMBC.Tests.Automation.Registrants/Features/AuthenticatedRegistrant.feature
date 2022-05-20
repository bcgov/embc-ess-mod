Feature: Authenticated Registrant

Scenario: BCSC user logs in to dashboard	
	Given I log in with BCSC credentials EVAC00006
	Then I am on path /verified-registration/dashboard/current

Scenario: Create new ESS File
	Given I log in with BCSC credentials EVAC00006
	When I create a new EssFile
	And I complete the maximum fields on the ESS file evacuee forms
	Then the ESS File submission complete dialog appears