using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Suppliers
{
    public interface ISupplierRepository
    {
        Task<SupplierQueryResult> QuerySupplier(SupplierQuery query);

        Task<SupplierCommandResult> ManageSupplier(SupplierCommand cmd);
    }

    public abstract class SupplierCommand
    { }

    public class SupplierCommandResult
    {
        public string SupplierId { get; set; }
    }

    public class SaveSupplier : SupplierCommand
    {
        public Supplier Supplier { get; set; }
    }

    public class SupplierQueryResult
    {
        public IEnumerable<Supplier> Items { get; set; }
    }

    public abstract class SupplierQuery
    {
        public bool ActiveOnly { get; set; } = true;
    }

    public class SuppliersByTeamQuery : SupplierQuery
    {
        public string TeamId { get; set; }
    }

    public class SupplierSearchQuery : SupplierQuery
    {
        public string SupplierId { get; set; }
        public string LegalName { get; set; }
        public string GSTNumber { get; set; }
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
        public IEnumerable<Team> PrimaryTeams { get; set; } = Array.Empty<Team>();
        public IEnumerable<MutualAid> MutualAids { get; set; } = Array.Empty<MutualAid>();
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

    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class MutualAid
    {
        public string GivenByTeamId { get; set; }
        public DateTime GivenOn { get; set; }
        public Team GivenToTeam { get; set; }
    }
}
