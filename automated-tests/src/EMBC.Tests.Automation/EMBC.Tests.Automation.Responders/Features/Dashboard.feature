Feature: Responders Portal homepage

@responders
Scenario: Responder can login to the portal
	Given I log in with BCeID user ess.developerA1	
	Then I am on path /responder-access/responder-dashboard

Scenario: Evacuee Online new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task 1234
	And  I search for an online evacuee Automation
	And I complete an online registration
	Then An online registration is completed with an active support

Scenario: Evacuee Paper Based new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task 1234
	And I search for a paper based evacuee Automation
	And I complete a paper based registration
	Then A paper based registration is completed with an expired support

Scenario: Evacuee Online Registration add Interac Support
	Given I log in with BCeID user ess.developerA1
	And I sign into a task 1234
	And I search for an online evacuee Thirtyfour
	And I choose an ESS file from the search results
	And I bypass ESS file wizard step
	And I create an Interac support
	Then A registration is completed with a pending approval interac support

Scenario: Team Member Management
	Given I log in with BCeID user ess.developerA1
	And I create a new team member
	And I search for a team member
	And I change a team member status
	And I search for a team member
	And I delete a team member
	And I search for a team member
	Then The team member does not exist

Scenario: Suppliers Management
	Given I log in with BCeID user ess.developerA1
	And I create a new supplier
	And I search for a supplier
	And I change a supplier status
	And I search for a supplier
	And I select a supplier for mutual aid
	And I search for a supplier
	And I rescind a supplier
	And I search for a supplier
	And I delete a supplier
	And I search for a supplier
	Then The supplier does not exist
#
#Scenario: Create several suppliers
#	Given I log in with BCeID user ess.developerA1
#	And I create multiple suppliers 46
#	Then I am on path /responder-access/supplier-management/suppliers-list
