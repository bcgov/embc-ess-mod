// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts
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

    public class AddSupplierSharedWithTeamCommand : Command
    {
        public string TeamId { get; set; }
        public string SupplierId { get; set; }
    }

    public class RemoveSupplierSharedWithTeamCommand : Command
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
        public Team Team { get; set; }
        public IEnumerable<Team> SharedWithTeams { get; set; }
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
        public DateTime SharedWithDate { get; set; }
    }
}
