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
    public class CASAPRetreiveController : Controller
    {
        private string URL = "";
        private string TokenURL = "";
        private string clientID = "";
        private string secret = "";

        // GET: api/<controller>
        [HttpGet]
        public List<CASAPTransaction> GetAllTransactions()
        {
            return CASAPTransactionRegistration.getInstance().getAllCASAPTransaction();
        }

        [HttpGet("GetAllTransactionRecords")]
        public JsonResult GetAllTransactionRecords()
        {
            return Json(CASAPTransactionRegistration.getInstance().getAllCASAPTransaction());
        }

        [HttpPost("GetTransactionRecords")]
        public async Task<JObject> GetTransactionRecords(CASAPQuery casAPQuery)
        {
            // Get the header
            var re = Request;
            var headers = re.Headers;

            // Get clientID and secret from header
            secret = headers["secret"].ToString();
            clientID = headers["clientID"].ToString();

            Console.WriteLine(DateTime.Now + " In RegisterCASAPTransaction");
            CASAPTransactionRegistrationReply casregreply = new CASAPTransactionRegistrationReply();
            CASAPQueryRegistration.getInstance().Add(casAPQuery);

            try
            {
                // Start by getting token
                Console.WriteLine(DateTime.Now + " Starting sendTransactionsToCAS (CASAPRetreiveController).");

                // Get secret information
                Console.WriteLine("Get Secret information.");
                var builder = new ConfigurationBuilder()
                    .AddEnvironmentVariables()
                    .AddUserSecrets<Program>(); // must also define a project guid for secrets in the .cspro – add tag <UserSecretsId> containing a guid
                var Configuration = builder.Build();
                URL = Configuration["CAS_API_URI"] + "cfs/apinvoice/"; // CAS AP URL
                TokenURL = Configuration["CAS_API_URI"] + "oauth/token"; // CAS AP Token URL

                HttpClientHandler handler = new HttpClientHandler();
                Console.WriteLine(DateTime.Now + " GET: + " + TokenURL);

                HttpClient client = new HttpClient(handler);

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(string.Format("{0}:{1}", clientID, secret))));

                var request = new HttpRequestMessage(HttpMethod.Post, TokenURL);

                var formData = new List<KeyValuePair<string, string>>();
                formData.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));

                Console.WriteLine(DateTime.Now + " Add credentials");
                request.Content = new FormUrlEncodedContent(formData);
                var response = await client.SendAsync(request);

                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                Console.WriteLine("Response Received: " + response.StatusCode);
                response.EnsureSuccessStatusCode();

                // Put token alone in responseToken
                string responseBody = await response.Content.ReadAsStringAsync();
                var jo = JObject.Parse(responseBody);
                string responseToken = jo["access_token"].ToString();

                Console.WriteLine(DateTime.Now + " Received token successfully, now to send request to CAS.");

                // Token received, now send package using token
                using (var packageClient = new HttpClient())
                {
                    packageClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", responseToken);
                    var jsonString = JsonConvert.SerializeObject(casAPQuery);
                    HttpContent postContent = new StringContent(jsonString);

                    // Submit GET response to CAS
                    HttpResponseMessage packageResult = await packageClient.GetAsync(URL + casAPQuery.invoiceNumber + "/" + casAPQuery.supplierNumber + "/" + casAPQuery.supplierSiteNumber);

                    // Segregate JSON response from CAS
                    string xresponseBody = await packageResult.Content.ReadAsStringAsync();
                    var xjo = JObject.Parse(xresponseBody);

                    // Return JSON response from CAS
                    Console.WriteLine(DateTime.Now + " Successfully found invoice: " + casAPQuery.invoiceNumber);
                    return xjo;
                }
            }
            catch (Exception e)
            {
                if (e.HResult == -2146233088)
                { // Handle error where invoice number / Supplier / Site does not exist
                    Console.WriteLine(DateTime.Now + " Error in GetTransactionRecords. Invoice: " + casAPQuery.invoiceNumber + ". Supplier: " + casAPQuery.supplierNumber + ". Site: " + casAPQuery.supplierSiteNumber + ". Invoice/Supplier/Site does not exist.");
                    dynamic errorObject = new JObject();
                    errorObject.invoice_number = casAPQuery.invoiceNumber;
                    errorObject.invoice_status = "Not Found";
                    if (e.Message.Contains("Unexpected character encountered while parsing value"))
                    {
                        // This is the message when the item is not found
                        errorObject.payment_status = "Not found";
                    }
                    else
                    {
                        // We use this for credential problems or other things like that.
                        errorObject.payment_status = e.Message;
                    }
                    errorObject.payment_number = " ";
                    errorObject.payment_date = " ";
                    return errorObject;
                }
                else
                { // Handle all other errors
                    var errorContent = new StringContent(casAPQuery.ToString(), Encoding.UTF8, "application/json");
                    Console.WriteLine(DateTime.Now + " Error in GetTransactionRecords. Invoice: " + casAPQuery.invoiceNumber + ". " + e.Message);
                    dynamic errorObject = new JObject();
                    errorObject.invoice_number = casAPQuery.invoiceNumber;
                    errorObject.invoice_status = e.Message;
                    errorObject.payment_status = "Generic Error";
                    errorObject.payment_number = " ";
                    errorObject.payment_date = " ";
                    return errorObject;
                }
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
