Feature: SupplierManagement

@responders
Scenario: Suppliers Management
	Given I create a new supplier
	When I delete a supplier
	Then The supplier does not exist

#Scenario: Create several suppliers
#	Given I create multiple suppliers 2
#	Then I am on path /responder-access/supplier-management/suppliers-list
