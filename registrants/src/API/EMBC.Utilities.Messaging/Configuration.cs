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
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Utilities.Messaging
{
    public class Configuration : IConfigureComponentServices, IHaveGrpcServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddGrpc(opts =>
            {
                opts.EnableDetailedErrors = true;
            });
            configurationServices.Services.Configure<MessageHandlerRegistryOptions>(opts => { });
            configurationServices.Services.AddSingleton<MessageHandlerRegistry>();
        }

        public Type[] GetGrpcServiceTypes()
        {
            return new[] { typeof(DispatcherService) };
        }
    }
}
