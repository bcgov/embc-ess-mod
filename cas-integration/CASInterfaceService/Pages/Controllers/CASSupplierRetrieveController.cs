using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using CASInterfaceService.Pages.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860


namespace CASInterfaceService.Pages.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CASSupplierRetreiveController : Controller
    {
        private string URL = "";
        private string TokenURL = "";
        private string clientID = "";
        private string secret = "";

        // GET: api/<controller>
        [HttpPost("GetTransactionRecords")]
        public async Task<JObject> GetTransactionRecords(CASSupplierQuery casSupplierQuery)
        {
            // Get the header
            var re = Request;
            var headers = re.Headers;

            // Get secret information
            Console.WriteLine("Get Secret information.");
            var builder = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddUserSecrets<Program>(); // must also define a project guid for secrets in the .cspro – add tag <UserSecretsId> containing a guid
            var Configuration = builder.Build();
            URL = Configuration["CAS_API_URI"] + "cfs/apinvoice/"; // CAS AP URL
            TokenURL = Configuration["CAS_API_URI"] + "oauth/token"; // CAS AP Token URL

            // Get clientID and secret from header
            secret = headers["secret"].ToString();
            clientID = headers["clientID"].ToString();

            Console.WriteLine("In RegisterCASAPTransaction");
            CASAPTransactionRegistrationReply casregreply = new CASAPTransactionRegistrationReply();
            CASSupplierQueryRegistration.getInstance().Add(casSupplierQuery);

            try
            {
                // Start by getting token
                Console.WriteLine("Starting sendTransactionsToCAS.");

                HttpClientHandler handler = new HttpClientHandler();
                Console.WriteLine("GET: + " + TokenURL);

                HttpClient client = new HttpClient(handler);

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(string.Format("{0}:{1}", clientID, secret))));

                var request = new HttpRequestMessage(HttpMethod.Post, TokenURL);

                var formData = new List<KeyValuePair<string, string>>();
                formData.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));

                Console.WriteLine("Add credentials");
                request.Content = new FormUrlEncodedContent(formData);
                var response = await client.SendAsync(request);

                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                Console.WriteLine("Response Received: " + response.StatusCode);
                response.EnsureSuccessStatusCode();

                // Put token alone in responseToken
                string responseBody = await response.Content.ReadAsStringAsync();
                var jo = JObject.Parse(responseBody);
                string responseToken = jo["access_token"].ToString();

                Console.WriteLine("Received token successfully, now to send request to CAS.");

                // Token received, now send package using token
                using (var packageClient = new HttpClient())
                {
                    packageClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", responseToken);
                    var jsonString = JsonConvert.SerializeObject(casSupplierQuery);
                    HttpContent postContent = new StringContent(jsonString);

                    HttpResponseMessage packageResult = await packageClient.GetAsync(URL);// + casSupplierQuery.invoiceNumber + "/" + casSupplierQuery.supplierNumber + "/" + casSupplierQuery.supplierSiteNumber);

                    // Put token alone in responseToken
                    string xresponseBody = await packageResult.Content.ReadAsStringAsync();
                    var xjo = JObject.Parse(xresponseBody);

                    return xjo;
                }
            }
            catch (Exception e)
            {
                var errorContent = new StringContent(casSupplierQuery.ToString(), Encoding.UTF8, "application/json");
                Console.WriteLine("Error in sendTransactionsToCASShort. ");// + client.BaseAddress.ToString() + errorContent + client + e.ToString());
                dynamic errorObject = new JObject();
                errorObject.message_UUID = "00000000-0000-0000-0000-000000000000";
                errorObject.supplier_number = casSupplierQuery.supplierNumber;
                errorObject.supplier_name = casSupplierQuery.supplierName;
                errorObject.sin = "000000000";
                errorObject.business_number = null;
                errorObject.supplier_status = null;
                errorObject.supplier_last_updated = null;
                errorObject.supplier_site_code = casSupplierQuery.supplierSiteNumber;
                errorObject.address_line_1 = null;
                errorObject.address_line_2 = null;
                errorObject.address_line_3 = null;
                errorObject.city = null;
                errorObject.province = null;
                errorObject.country = null;
                errorObject.postal_code = null;
                errorObject.email_address = null;
                errorObject.account_number = null;
                errorObject.branch_number = null;
                errorObject.bank_number = null;
                errorObject.eft_advice_pref = null;
                errorObject.provider_id = null;
                errorObject.site_status = "Error: " + e.Message;
                errorObject.site_last_updated = null;
                return errorObject;
            }
        }

        [Route("/api/protected")]
        [Authorize]
        [HttpGet("Protected")]
        public string Protected()
        {
            return "Only if you have a valid token!";
        }
    }
}
