# EMBC Dynamics Resource Access

This assembly is the gateway to EMBC Dynamics instanc and how to connect to it.

## Code generation

**Prerequisites:**
- Visual Studio 2019
- [OData Connected Services extension](https://github.com/odata/ODataConnectedService)
- BCGov VPN access

**Steps to update Dynamics Connected Service**
1. connect to VPN
2. run `EMBC.Tests.Integration.Registrants.DynamicsRegistrationPersistenceTests.GetSecurityToken` integration test
3. copy the Authorization header from the test outout log
4. right-click EMBC.ResourceAccess.Dynamics/Connected Services/Dynamics folder and select `Update OData Connected Service`
5. past the Authorization header into Custom Header and click next
6. if authentication is successful, the next screen will show the list of entities in Dynamics
7. Finish the update wizard to complete the generated code refresh
8. run the integration tests suite to verify Dynamics integration functionality is not broken

