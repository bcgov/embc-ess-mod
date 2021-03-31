using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using CASInterfaceService.Pages.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CASInterfaceService.Pages.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CASAPTransactionController : Controller
    {
        private string URL = "";
        private string TokenURL = "";
        private string clientID = "";
        private string secret = "";

        // POST: api/<controller>
        [HttpPost]
        public async Task<JObject> RegisterCASAPTransaction(CASAPTransaction casAPTransaction)
        {
            // Get the header
            var re = Request;
            var headers = re.Headers;

            // Get secret information
            Console.WriteLine(DateTime.Now + " Get Secret information.");
            var builder = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddUserSecrets<Program>(); // must also define a project guid for secrets in the .cspro – add tag <UserSecretsId> containing a guid
            var Configuration = builder.Build();
            URL = Configuration["CAS_API_URI"] + "cfs/apinvoice/"; // CAS AP URL
            TokenURL = Configuration["CAS_API_URI"] + "oauth/token"; // CAS AP Token URL

            // Get clientID and secret from header
            secret = headers["secret"].ToString();
            clientID = headers["clientID"].ToString();

            Console.WriteLine(DateTime.Now + " In RegisterCASAPTransaction");
            CASAPTransactionRegistrationReply casregreply = new CASAPTransactionRegistrationReply();
            CASAPTransactionRegistration.getInstance().Add(casAPTransaction);
            //casregreply.RegistrationStatus = "Success";

            //// Now we must call CAS with this data
            ////Task<string> outputResult = CASAPTransactionRegistration.getInstance().sendTransactionsToCAS(casAPTransaction);
            //Task<string> outputResult = newSendTransactionToCAS(casAPTransaction);
            //casregreply.RegistrationStatus = Convert.ToString(outputResult);

            // Now we must call CAS with this data
            string outputMessage;

            try
            {
                // Start by getting token
                Console.WriteLine(DateTime.Now + " Starting sendTransactionsToCAS (CASAPTransactionController).");

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
                Console.WriteLine(DateTime.Now + " Response Received: " + response.StatusCode);
                response.EnsureSuccessStatusCode();

                // Put token alone in responseToken
                string responseBody = await response.Content.ReadAsStringAsync();
                var jo = JObject.Parse(responseBody);
                string responseToken = jo["access_token"].ToString();

                Console.WriteLine(DateTime.Now + " Received token successfully, now to send package to CAS.");

                // Token received, now send package using token
                using (var packageClient = new HttpClient())
                {
                    packageClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", responseToken);
                    var jsonString = JsonConvert.SerializeObject(casAPTransaction);
                    //HttpContent postContent = new StringContent(jsonString, Encoding.UTF8, "application/json");
                    HttpContent postContent = new StringContent(jsonString);
                    Console.WriteLine(DateTime.Now + " JSON: " + jsonString);
                    HttpResponseMessage packageResult = await packageClient.PostAsync(URL, postContent);

                    Console.WriteLine(DateTime.Now + " This was the result: " + packageResult.StatusCode);
                    //outputMessage = Convert.ToString(packageResult.StatusCode);
                    outputMessage = Convert.ToString(packageResult.Content.ReadAsStringAsync().Result);
                    Console.WriteLine(DateTime.Now + " Output Message: " + outputMessage);

                    if (packageResult.StatusCode == HttpStatusCode.Unauthorized)
                    {
                        Console.WriteLine(DateTime.Now + " Ruh Roh, there was an error: " + packageResult.StatusCode);
                    }
                }
            }
            catch (Exception e)
            {
                var errorContent = new StringContent(casAPTransaction.ToString(), Encoding.UTF8, "application/json");
                Console.WriteLine(DateTime.Now + " Error in RegisterCASAPTransaction. Invoice: " + casAPTransaction.invoiceNumber);
                dynamic errorObject = new JObject();
                errorObject.invoice_number = null;
                errorObject.CAS_Returned_Messages = "Generic Error: " + e.Message;
                return errorObject;
            }

            var xjo = JObject.Parse(outputMessage);
            Console.WriteLine(DateTime.Now + " Successfully sent invoice: " + casAPTransaction.invoiceNumber);
            return xjo;
        }
    }
}
