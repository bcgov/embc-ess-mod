Feature: Responders Portal homepage

@responders
Scenario: Responder can login to the portal
	Given I log in with BCeID user ess.developerA1	
	Then I am on path /responder-access/responder-dashboard

Scenario: Evacuee online new Registration
	Given I log in with BCeID user ess.developerA1
	When I complete a new online evacuee registration
	Then A registration is completed with an active support

Scenario: Evacuee paper based new Registration
	Given I log in with BCeID user ess.developerA1
	When I complete a new paper based evacuee registration
	Then A registration is completed with an active support

Scenario: Add Interac Support to Online ESS File
	Given I log in with BCeID user ess.developerA1
	When I create a interact support