Feature: Registrant Portal

The purpose of these tests is to confirm access to the Registrant Portal and successful form completion.

Scenario: Registrant Portal - Anonymous - Happy path/maximum fields
	Given I see the Registrant Portal home page
	When I click on the Self Register button
	And I complete the maximum fields on the evacuee forms
	And the submitted information is correct for the maximum fields completed
	Then I confirm the ESS File Number is displayed

Scenario: Registrant Portal - Anonymous - Happy path/minimum fields
	Given I see the Registrant Portal home page
	When I click on the Self Register button
	And I complete the minimum fields on the evacuee forms
	And the submitted information is correct for minimum fields completed
	Then I confirm the ESS File Number is displayed

Scenario: Registrant Portal - Anonymous - Confirm CAPTCHA field is working
	Given I see the Registrant Portal home page
	When I click on the Self Register button
	And I complete the minimum fields on the evacuee forms
	Then the CAPTCHA field is confirmed to be working

Scenario: Registrant Portal - Verified path - Happy path/maximum fields
	Given I see the Registrant Portal home page
	When I click on the Self Register button
	And I complete the maximum fields on the verified evacuee forms
	And the submitted information is correct for maximum fields completed
	Then I am logged in and the ERA portal is displayed

Scenario: Registrant Portal - Verified path - Happy path/minimum fields
	Given I see the Registrant Portal home page
	When I click on the Self Register button
	And I complete the minimum fields on the verified evacuee forms
	And the submitted information is correct for minimum fields completed
	Then I am logged in and the ERA portal is displayed