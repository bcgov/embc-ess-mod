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
using EMBC.ESS.Managers.Events.Notifications;
using EMBC.ESS.Managers.Events.PrintReferrals;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Messaging;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Managers.Events
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;

            services.AddTransient<EventsManager>();
            services.Configure<MessageHandlerRegistryOptions>(opts => opts.Add(typeof(EventsManager)));
            services.AddTransient<EmailTemplateProvider>();
            services.AddTransient<IPrintReferralService, PrintReferralService>();
            services.AddTransient<ITemplateProviderResolver>(sp =>
            {
                Func<NotificationChannelType, ITemplateProvider> resolverFunc = (type) => type switch
                {
                    NotificationChannelType.Email => sp.GetRequiredService<EmailTemplateProvider>(),
                    _ => throw new NotImplementedException($"No template provider was registered for {type}")
                };
                return new TemplateProviderResolver(resolverFunc);
            });
        }
    }
}
