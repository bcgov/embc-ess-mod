using System;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.Utilities.Messaging;
using Google.Protobuf;
using Grpc.Core;
using Grpc.Core.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests
{
    public class DispatcherServiceTests
    {
        private Func<HttpContext> httpContextFactory;

        public DispatcherServiceTests(ITestOutputHelper output)
        {
            MessageHandlerRegistryOptions messageHandlerRegistryOptions = new MessageHandlerRegistryOptions();
            messageHandlerRegistryOptions.Add(typeof(TestHandler));
            MessageHandlerRegistry registry = new MessageHandlerRegistry(output.BuildLoggerFor<MessageHandlerRegistry>(), Options.Create(messageHandlerRegistryOptions));
            ServiceCollection services = new ServiceCollection();
            services.AddSingleton(registry);
            services.AddTransient<TestHandler>();
            services.AddLogging(builder =>
            {
                builder.AddXunit(output);
            });
            httpContextFactory = () => new DefaultHttpContext
            {
                RequestServices = services.BuildServiceProvider().CreateScope().ServiceProvider
            };
        }

        [Fact]
        public async Task Dispatch_Command_ReplyReturned()
        {
            var serverCallContext = TestServerCallContextFactory.Create();
            serverCallContext.UserState["__HttpContext"] = httpContextFactory();
            var dispatcher = new DispatcherService();

            var cmd = new TestCommand
            {
                Value = Guid.NewGuid().ToString()
            };

            var request = new RequestEnvelope()
            {
                Type = cmd.GetType().AssemblyQualifiedName,
                Data = UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(cmd))
            };

            var response = await dispatcher.Dispatch(request, serverCallContext);

            response.ShouldNotBeNull().Data.ShouldNotBeNull().ShouldNotBeEmpty();
            var responseType = System.Type.GetType(response.Type, an => Assembly.Load(an.Name ?? null!), null, true, true).ShouldNotBeNull();
            using var ms = new MemoryStream(response.Data.ToByteArray());
            JsonSerializer.Deserialize(ms, responseType).ShouldBeOfType<string>().ShouldBe(cmd.Value);
        }

        [Fact]
        public async Task Dispatch_CommandWithNoReply_EmptyResponseType()
        {
            var serverCallContext = TestServerCallContextFactory.Create();
            serverCallContext.UserState["__HttpContext"] = httpContextFactory();
            var dispatcher = new DispatcherService();
            var cmd = new TestCommandNoReturnValue();

            RequestEnvelope request = new RequestEnvelope()
            {
                Type = cmd.GetType().AssemblyQualifiedName,
                Data = UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(cmd))
            };
            var response = await dispatcher.Dispatch(request, serverCallContext);
            response.Error.ShouldBeFalse();
            response.Type.ShouldBeNullOrEmpty();
            response.Data.IsEmpty.ShouldBeTrue();
        }

        [Fact]
        public async Task Dispatch_Query_ReplyReturned()
        {
            var serverCallContext = TestServerCallContextFactory.Create();
            serverCallContext.UserState["__HttpContext"] = httpContextFactory();
            var dispatcher = new DispatcherService();
            var query = new TestQuery
            {
                Value = Guid.NewGuid().ToString()
            };

            var request = new RequestEnvelope()
            {
                Type = query.GetType().AssemblyQualifiedName,
                Data = UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(query))
            };
            var response = await dispatcher.Dispatch(request, serverCallContext);
            response.ShouldNotBeNull().Data.ShouldNotBeNull().IsEmpty.ShouldBeFalse();
            var responseType = System.Type.GetType(response.Type, an => Assembly.Load(an.Name ?? null!), null, true, true).ShouldNotBeNull();
            using var ms = new MemoryStream(response.Data.ToByteArray());
            JsonSerializer.Deserialize(ms, responseType).ShouldBeOfType<TestQueryReply>().Value.ShouldBe(query.Value);
        }

        [Fact]
        public async Task CanSerializeErrors()
        {
            var serverCallContext = TestServerCallContextFactory.Create();
            serverCallContext.UserState["__HttpContext"] = httpContextFactory();
            var dispatcher = new DispatcherService();
            var request = new RequestEnvelope()
            {
                Type = typeof(TestThrowErrorCommand).AssemblyQualifiedName,
                Data = UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(new TestThrowErrorCommand()))
            };
            var response = await dispatcher.Dispatch(request, serverCallContext);

            response.ShouldNotBeNull();
        }
    }

    public static class TestServerCallContextFactory
    {
        public static ServerCallContext Create()
        {
            return TestServerCallContext.Create("method", "host", DateTime.Now, new Metadata(), default, "peer", null, null, m => Task.CompletedTask, () => default, wo => { });
        }
    }

    public class TestHandler
    {
        public async Task<string> Handle(TestCommand cmd)
        {
            return await Task.FromResult(cmd.Value);
        }

        public async Task Handle(TestCommandNoReturnValue cmd)
        {
            await Task.CompletedTask;
        }

        public async Task<TestQueryReply> Handle(TestQuery query)
        {
            return await Task.FromResult(new TestQueryReply
            {
                Value = query.Value
            });
        }

        public async Task<string> Handle(TestThrowErrorCommand cmd)
        {
            await Task.CompletedTask;
            throw new NotFoundException("not found", "id");
        }
    }

    public class TestCommand : Command
    {
        public string Value { get; set; } = null!;
    }

    public class TestCommandNoReturnValue : Command
    {
    }

    public class TestQuery : Query<TestQueryReply>
    {
        public string Value { get; set; } = null!;
    }

    public class TestQueryReply
    {
        public string Value { get; set; } = null!;
    }

    public class TestThrowErrorCommand : Command { }
}
