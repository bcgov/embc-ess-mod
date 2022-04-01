using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Teams
{
    public class SuppliersQuery : Query<SuppliersQueryResult>
    {
        public string TeamId { get; set; }
        public string SupplierId { get; set; }
        public string LegalName { get; set; }
        public string GSTNumber { get; set; }
    }

    public class SuppliersQueryResult
    {
        public IEnumerable<Supplier> Items { get; set; }
    }

    public class SaveSupplierCommand : Command
    {
        public Supplier Supplier { get; set; }
    }

    public class RemoveSupplierCommand : Command
    {
        public string SupplierId { get; set; }
    }

    public class ActivateSupplierCommand : Command
    {
        public string TeamId { get; set; }
        public string SupplierId { get; set; }
    }

    public class DeactivateSupplierCommand : Command
    {
        public string TeamId { get; set; }
        public string SupplierId { get; set; }
    }

    public class ClaimSupplierCommand : Command
    {
        public string TeamId { get; set; }
        public string SupplierId { get; set; }
    }

    public class ShareSupplierWithTeamCommand : Command
    {
        public string TeamId { get; set; }
        public string SupplierId { get; set; }
    }

    public class UnshareSupplierWithTeamCommand : Command
    {
        public string TeamId { get; set; }
        public string SupplierId { get; set; }
    }

    public class Supplier
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string LegalName { get; set; }
        public string GSTNumber { get; set; }
        public bool Verified { get; set; }
        public Address Address { get; set; }
        public SupplierContact Contact { get; set; }
        public SupplierTeam Team { get; set; }
        public IEnumerable<SupplierTeam> SharedWithTeams { get; set; }
        public SupplierStatus Status { get; set; }
    }

    public enum SupplierStatus
    {
        NotSet,
        Active,
        Inactive
    }

    public class Address
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Community { get; set; }
        public string City { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class SupplierContact
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }

    public class SupplierTeam
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime SharedWithDate { get; set; }
    }
}
