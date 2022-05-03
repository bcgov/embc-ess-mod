Feature: Authenticated Registrant

Scenario: BCSC user logs in to dashboard	
	Given I log in with BCSC credentials EVAC00006
	Then I am on path /verified-registration/dashboard/current