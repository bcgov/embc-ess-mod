Feature: Registrants portal homepage

@mytag
Scenario: Start anonymous registration
	Given I see Registrants' Portal home page
	When I click Self Register button
	Then I see Collection Notice page