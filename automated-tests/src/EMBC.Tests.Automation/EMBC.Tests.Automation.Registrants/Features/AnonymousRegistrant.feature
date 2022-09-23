Feature: Anonymous Registrant

The purpose of these tests is to confirm access to the Registrant Portal and successful form completion.

#Scenario: Registrant Portal - Anonymous - Happy path/maximum fields
#	Given I register anonymously
#	#When I click on the Self Register button
#	When I complete the maximum fields on the evacuee forms
#	And the submitted information is correct for the maximum fields completed
#	Then I confirm the ESS File Number is displayed
#
#Scenario: Registrant Portal - Anonymous - Happy path/minimum fields
#	Given I register anonymously
#	#When I click on the Self Register button
#	When I complete the minimum fields on the evacuee forms
#	And the submitted information is correct for minimum fields completed
#	Then I confirm the ESS File Number is displayed

Scenario: Registrant Portal - submit minimal form
	Given I start self registration
	When I complete the minimum fields on the evacuee forms
	And I submit the anonymous registration form
	Then I am on path /non-verified-registration/file-submission

#Scenario: Registrant Portal - Verified path - Happy path/maximum fields
#	Given I register anonymously
#	#When I click on the Self Register button
#	When I complete the maximum fields on the verified evacuee forms
#	And the submitted information is correct for maximum fields completed
#	Then I am logged in and the ERA portal is displayed
#
#Scenario: Registrant Portal - Verified path - Happy path/minimum fields
#	Given I register anonymously
#	#When I click on the Self Register button
#	When I complete the minimum fields on the verified evacuee forms
#	And the submitted information is correct for minimum fields completed
#	Then I am logged in and the ERA portal is displayed