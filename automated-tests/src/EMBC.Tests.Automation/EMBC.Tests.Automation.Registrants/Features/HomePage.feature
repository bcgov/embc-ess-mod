Feature: Registrant Portal homepage

@mytag
Scenario: Start anonymous registration
	Given I see the Registrant Portal home page
	When I click on the Self Register button
	Then I see Collection Notice page