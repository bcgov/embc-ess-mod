Feature: Responders Portal homepage

@responders
Scenario: Responder can login to the portal
	Given I log in with BCeID user ess.developerA1	
	Then I am on path /responder-access/responder-dashboard

Scenario: Evacuee online new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task
	And  I search for an online evacuee
	And I complete an online registration
	Then An online registration is completed with an active support

Scenario: Evacuee paper based new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task
	And I search for a paper based evacuee
	And I complete a paper based registration
	Then A paper based registration is completed with an expired support

Scenario: Add Interac Support to Online ESS File
	Given I log in with BCeID user ess.developerA1
	And I sign into a task
	And I search for an online evacuee
	And I choose an ESS file from the search results
	And I bypass ESS file wizard step
	And I create an Interac support
	Then A registration is completed with a pending approval interac support