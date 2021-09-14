---
title: EMBC ESS Back-end Services
description: EMBC ESS Back-end Services
---
# EMBC ESS Back-end Services

Back-end service to provide data and business logic to ESS portals.

## Project status

[TBD]

## Development

## Prerequisites

- VS2019
- [OData Connected Services extension](https://github.com/odata/ODataConnectedService) for Dynamics code generation
- BCGov VPN access for Dynamics integration tests

## Local development environment setup

[TBD]

## Dynamics code generation

**Steps to update Dynamics Connected Service**
1. Open `API/EMBC.Ess/EMBC.ESS.sln` in Visual Studio
1. connect to VPN
1. run `EMBC.Tests.Integration.ESS.DynamicsBaseTests.GetSecurityToken` integration test
1. copy the Authorization header from the test output log (e.g. `Authorization: Bearer abcdefg...`)
1. right-click Connected Services/Dynamics folder and select `Update OData Connected Service`
1. paste the Authorization header into Custom Header and click next
1. if authentication is successful, the next screen will show the list of entities in Dynamics
1. Finish the update wizard to complete the generated code refresh
1. run the integration tests [TBD] suite to verify Dynamics integration functionality is not broken

## CI/CD

[TBD]