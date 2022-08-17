Feature: Responders Portal Registration

@responders
Scenario: Responder can login to the portal
	Given I log in with BCeID user ess.developerA1	
	Then I am on path /responder-access/responder-dashboard

Scenario: Evacuee Online new Registration with Referrals
	Given I complete an online registration
	Then An online registration is completed with an active support

Scenario: Evacuee Paper Based new Registration with Referrals
	Given I complete a paper based registration
	Then A paper based registration is completed with an expired support

Scenario: Evacuee Online new Registration with Interac Support
	Given I create an Interac support from an existing user
	Then A registration is completed with a pending approval interac support

Scenario: Remote Extension Search
    Given I search for a remote extensions ess file
    Then Remote Extensions displays results