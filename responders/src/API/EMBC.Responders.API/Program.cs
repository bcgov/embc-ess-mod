using System;
using EMBC.Utilities.Hosting;

var appName = Environment.GetEnvironmentVariable("APP_NAME") ?? "EMBC.Responders.API";

var host = new Host(appName);
return await host.Run(assembliesPrefix: "EMBC");
