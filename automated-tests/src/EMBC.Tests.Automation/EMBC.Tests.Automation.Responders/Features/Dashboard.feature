Feature: Responders Portal homepage

@responders
Scenario: Responder can login to the portal
	Given I log in with BCeID user ess.developerA1	
	Then I am on path /responder-access/responder-dashboard

Scenario: Evacuee online new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task
	And  I search for an online evacuee
	And I complete an online profile wizard step
	And I complete an online ESS File wizard step
	And I complete an online referral support wizard step
	Then A registration is completed with an active support

Scenario: Evacuee paper based new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task
	And I search for a paper based evacuee
	And I complete a paper based profile wizard step
	And I complete a paper based ESS File wizard step
	And I complete a paper based referral support wizard step
	Then A paper based registration is completed with an expired support

#Scenario: Add Interac Support to Online ESS File
#	Given I log in with BCeID user ess.developerA1
#	When I create an Interac support