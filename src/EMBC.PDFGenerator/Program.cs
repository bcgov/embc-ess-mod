﻿// -------------------------------------------------------------------------
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
using System.IO;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EMBC.PDFGenerator
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        // Additional configuration is required to successfully run gRPC on macOS.
        // For instructions on how to configure Kestrel and gRPC clients on macOS, visit https://go.microsoft.com/fwlink/?linkid=2099682
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
            .ConfigureServices((context, services) =>
                {
                    //These config paths are compatible with Kestrel config in .net 5 so this entire code section can be removed when migrating to .net 5+
                    services.Configure<KestrelServerOptions>(opts =>
                    {
                        var configuration = context.Configuration.GetSection("Kestrel");
                        configuration.Bind(opts);
                        opts.ConfigureHttpsDefaults(httpOpts =>
                        {
                            var certKeyPath = configuration.GetValue("Certificates:Default:KeyPath", string.Empty);
                            var certCaPath = configuration.GetValue("Certificates:Default:Path", string.Empty);
                            if (!string.IsNullOrEmpty(certKeyPath))
                            {
                                //set default server cert
                                var cert = LoadPemCertificate(certCaPath, certKeyPath);
                                httpOpts.ServerCertificate = cert;
                            }
                        });
                    });
                });

        private static X509Certificate2 LoadPemCertificate(string certificatePath, string privateKeyPath)
        {
            using var publicKey = new X509Certificate2(certificatePath);

            var privateKeyText = File.ReadAllText(privateKeyPath);
            var privateKeyBlocks = privateKeyText.Split("-", StringSplitOptions.RemoveEmptyEntries);
            var privateKeyBytes = Convert.FromBase64String(privateKeyBlocks[1]);
            using var rsa = RSA.Create();

            if (privateKeyBlocks[0] == "BEGIN PRIVATE KEY")
            {
                rsa.ImportPkcs8PrivateKey(privateKeyBytes, out _);
            }
            else if (privateKeyBlocks[0] == "BEGIN RSA PRIVATE KEY")
            {
                rsa.ImportRSAPrivateKey(privateKeyBytes, out _);
            }

            var keyPair = publicKey.CopyWithPrivateKey(rsa);
            return new X509Certificate2(keyPair.Export(X509ContentType.Pfx));
        }
    }
}
