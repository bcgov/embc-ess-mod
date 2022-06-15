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
        private readonly SupplierManagement supplierManagement;
        public SupplierMgmtSteps(BrowserDriver driver)
        {
            supplierManagement = new SupplierManagement(driver.Current);
        }

        [StepDefinition(@"I create a new supplier")]
        public void CreateNewSupplier()
        {
            supplierManagement.EnterSupplierManagement();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            supplierManagement.AddNewSupplierTab();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/add-supplier");
            supplierManagement.AddNewSupplier("Automation Testers Org", "Automation Machine", "1289 Main St", "Office 345", "Vancouver", "V6Z2H7", "Test", "Auto", "4576867876", "autotest@test.ca");
        }

        [StepDefinition(@"I search for a supplier")]
        public void SearchSupplier()
        {
            supplierManagement.EnterSupplierManagement();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            supplierManagement.SearchSupplier("Automation Testers Org");
        }

        [StepDefinition(@"I change a supplier status")]
        public void ChangeMemberStatus()
        {
            supplierManagement.ChangeSupplierStatus();
        }

        [StepDefinition(@"The supplier status is deactive")]
        public void SupplierStatusDeactive()
        {
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            Assert.True(supplierManagement.GetSupplierStatus().Equals("Deactivated")); ;
        }

        [StepDefinition(@"I delete a supplier")]
        public void DeleteSupplier()
        {
            supplierManagement.SelectSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/supplier-detail");
            supplierManagement.DeleteSupplier();
        }

        [StepDefinition(@"The supplier does not exist")]
        public void MemberNotFound()
        {
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
            Assert.True(supplierManagement.GetTotalSearchNumber().Equals(0));
        }

        [StepDefinition(@"I select a supplier for mutual aid")]
        public void AddMutualAid()
        {
            supplierManagement.SelectSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/supplier-detail");
            supplierManagement.AddMutualAidEssTeam("QA Team");
        }

        [StepDefinition(@"I rescind a supplier")]
        public void RescindSupplier()
        {
            supplierManagement.SelectSupplier();
            supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/supplier-detail");
            supplierManagement.RescindMutualAid();
        }

        [StepDefinition(@"I create multiple suppliers (.*)")]
        public void CreateSeveralSuppliers(int suppliersAmount)
        {
            for (int i = 0; i < suppliersAmount; i++)
            {
                supplierManagement.EnterSupplierManagement();
                supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/suppliers-list");
                supplierManagement.AddNewSupplierTab();
                supplierManagement.CurrentLocation.Should().Be("/responder-access/supplier-management/add-supplier");
                supplierManagement.AddRandomSupplier(i);
            }
        }
    }
}
