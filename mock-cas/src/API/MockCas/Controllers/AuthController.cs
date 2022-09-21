using Microsoft.AspNetCore.Mvc;

namespace MockCas.Controllers
{
    [ApiController]
    [Route("api/mockcas/oauth/token")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<AuthResponse>> GetToken()
        {
            await Task.CompletedTask;
            return Ok(new AuthResponse
            {
                access_token = "123",
                token_type = "bearer",
                expires_in = 3000
            });
        }
    }

    public class AuthResponse
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
    }
}
