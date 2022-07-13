Feature: TeamManagement

@responders
Scenario: Team Member Management
	Given I create a new team member
	When I delete a team member
	Then The team member does not exist


