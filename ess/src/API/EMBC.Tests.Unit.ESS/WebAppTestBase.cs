﻿using System;
using EMBC.ESS;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS
{
    public abstract class WebAppTestBase : IClassFixture<WebApplicationFactory<Startup>>
    {
        protected readonly WebApplicationFactory<Startup> webApplicationFactory;
        protected readonly IServiceProvider services;

        public WebAppTestBase(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory)
        {
            this.webApplicationFactory = webApplicationFactory;
            services = webApplicationFactory.Services.CreateScope().ServiceProvider;
        }
    }
}
