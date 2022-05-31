Feature: Responders Portal homepage

@responders
Scenario: 01 Responder can login to the portal
	Given I log in with BCeID user ess.developerA1	
	Then I am on path /responder-access/responder-dashboard

Scenario: 02 Evacuee online new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task
	And  I search for an online evacuee
	And I complete an online registration
	Then An online registration is completed with an active support

Scenario: 03 Evacuee paper based new Registration
	Given I log in with BCeID user ess.developerA1
	When I sign into a task
	And I search for a paper based evacuee
	And I complete a paper based registration
	Then A paper based registration is completed with an expired support

Scenario: 04 Add Interac Support to Online ESS File
	Given I log in with BCeID user ess.developerA1
	And I sign into a task
	And I search for an online evacuee
	And I choose an ESS file from the search results
	And I bypass ESS file wizard step
	And I create an Interac support
	Then A registration is completed with a pending approval interac support

Scenario: 05 Create new Team Member
	Given I log in with BCeID user ess.developerA1
	And I create a new team member
	And I search for a team member
	And I change a team member status
	And I search for a team member
	Then The team member status is deactive

Scenario: 06 Delete a team member
	Given I log in with BCeID user ess.developerA1
	And I search for a team member
	And I delete a team member
	And I search for a team member
	Then The team member does not exist

Scenario: 07 Create a new supplier
	Given I log in with BCeID user ess.developerA1
	And I create a new supplier
	And I search for a supplier
	And I change a supplier status
	And I search for a supplier
	Then The supplier status is deactive

Scenario: 08 Add Mutual Aid to supplier
	Given I log in with BCeID user ess.developerA1
	And I search for a supplier
	And I select a supplier for mutual aid
	Then I am on path /responder-access/supplier-management/suppliers-list

Scenario: 09 Rescind Mutual Aid of supplier
	Given I log in with BCeID user ess.developerA1
	And I search for a supplier
	And I rescind a supplier
	Then I am on path /responder-access/supplier-management/suppliers-list


Scenario: 10 Delete a supplier
	Given I log in with BCeID user ess.developerA1
	And I search for a supplier
	And I delete a supplier
	And I search for a supplier
	Then The supplier does not exist