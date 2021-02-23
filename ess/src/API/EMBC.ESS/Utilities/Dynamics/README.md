# Dynamics Resource Access

This is the resource access gateway to ESS Dynamics instance. It used OData connection services code generation to enable Dynamics query and update capabilities over OData protocol.

## Code generation

**Prerequisites:**
- Visual Studio 2019
- [OData Connected Services extension](https://github.com/odata/ODataConnectedService)
- BCGov VPN access

**Steps to update Dynamics Connected Service**
1. connect to VPN
2. run `[TBD]` integration test
3. copy the Authorization header from the test output log
4. right-click Connected Services/Dynamics folder and select `Update OData Connected Service`
5. paste the Authorization header into Custom Header and click next
6. if authentication is successful, the next screen will show the list of entities in Dynamics
7. Finish the update wizard to complete the generated code refresh
8. run the integration tests [TBD] suite to verify Dynamics integration functionality is not broken

