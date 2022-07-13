using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class SupplierMgmtSteps
    {
        private readonly LoginSteps loginSteps;
        private readonly SupplierManagement supplierManagement;

        private readonly string userName = "ess.developerA1";
        private readonly string supplierLegalName = "autotest-Automation Testers";
        private readonly string supplierName = "autotest-Automation Machine";
        private readonly string supplierAddressLine1 = "autotest-1289 Main St";
        private readonly string supplierAddressLine2 = "autotest-Office 345";
        private readonly string supplierCity = "Vancouver";
        private readonly string supplierPostalcode = "V6Z2H7";
        private readonly string supplierLastName = "autotest-Test";
        private readonly string supplierFirstName = "autotest-Auto";
        private readonly string supplierPhone = "4576867876";
        private readonly string supplierEmail = "autotest@test.ca";

        private readonly string mutualAidTeam = "QA Team";


        public SupplierMgmtSteps(BrowserDriver driver)
        {
            loginSteps = new LoginSteps(driver);
            supplierManagement = new SupplierManagement(driver.Current);
        }

        [StepDefinition(@"I create a new supplier")]
        public void CreateNewSupplier()
        {
            //Login
            loginSteps.Bcsc(userName);

            //Create a new supplier
            supplierManagement.EnterSupplierManagement();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            supplierManagement.AddNewSupplierTab();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/add-supplier");
            supplierManagement.AddNewSupplier(supplierLegalName, supplierName, supplierAddressLine1, supplierAddressLine2, supplierCity, supplierPostalcode, supplierLastName, supplierFirstName, supplierPhone, supplierEmail);

            //Change the supplier's status
            SearchSupplier();
            supplierManagement.ChangeSupplierStatus();

            //Assert that the supplier's status is deactivated
            SearchSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            Assert.True(supplierManagement.GetSupplierStatus().Equals("Deactivated"));

            //Select the Supplier for mutual aid
            SearchSupplier();
            supplierManagement.SelectSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/supplier-detail");
            supplierManagement.AddMutualAidEssTeam(mutualAidTeam);

            //Rescind the mutual aid recently added
            SearchSupplier();
            supplierManagement.SelectSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/supplier-detail");
            supplierManagement.RescindMutualAid();

        }

        [StepDefinition(@"I delete a supplier")]
        public void DeleteSupplier()
        {
            SearchSupplier();
            supplierManagement.SelectSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/supplier-detail");
            supplierManagement.DeleteSupplier();
        }

        [StepDefinition(@"The supplier does not exist")]
        public void MemberNotFound()
        {
            SearchSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            Assert.True(supplierManagement.GetTotalSearchNumber().Equals(0));
        }

        [StepDefinition(@"I create multiple suppliers (.*)")]
        public void CreateSeveralSuppliers(int suppliersAmount)
        {
            //Login
            loginSteps.Bcsc(userName);

            //Create multiple suppliers
            for (int i = 0; i < suppliersAmount; i++)
            {
                supplierManagement.EnterSupplierManagement();
                supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
                supplierManagement.AddNewSupplierTab();
                supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/add-supplier");
                supplierManagement.AddRandomSupplier(i);
            }
        }

        private void SearchSupplier()
        {
            supplierManagement.EnterSupplierManagement();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            supplierManagement.SearchSupplier(supplierName);
        }

    }
}
