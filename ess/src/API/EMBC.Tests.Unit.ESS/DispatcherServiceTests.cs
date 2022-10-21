using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.Utilities.Messaging;
using EMBC.Utilities.Messaging.Grpc;
using Google.Protobuf;
using Grpc.Core;
using Grpc.Core.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS
{
    public class DispatcherServiceTests
    {
        private readonly Func<HttpContext> httpContextFactory;
        private readonly DispatcherService dispatcher;
        private readonly TestHandler testHandler;

        public ServerCallContext serverCallContext { get; }

        public DispatcherServiceTests(ITestOutputHelper output)
        {
            var services = TestHelper.CreateDIContainer().AddLogging(output);
            services.Configure<HandlerRegistry>(handlerRegistry =>
            {
                handlerRegistry.AddAllHandlersFrom(typeof(TestHandler));
            });
            testHandler = new TestHandler();
            services.AddSingleton(testHandler);
            services.AddTransient<DispatcherService>();
            httpContextFactory = () => new DefaultHttpContext
            {
                RequestServices = services.BuildServiceProvider().CreateScope().ServiceProvider
            };

            serverCallContext = TestServerCallContextFactory.Create();
            serverCallContext.UserState["__HttpContext"] = httpContextFactory();
            dispatcher = serverCallContext.GetHttpContext().RequestServices.GetRequiredService<DispatcherService>();
        }

        [Fact]
        public async Task Dispatch_Command_ReplyReturned()
        {
            var cmd = new TestCommand
            {
                Value = Guid.NewGuid().ToString()
            };

            var request = CreateRequest(cmd);

            var response = await dispatcher.Dispatch(request, serverCallContext);

            response.ShouldNotBeNull().Data.ShouldNotBeNull().ShouldNotBeEmpty();
            var responseType = Type.GetType(response.Type, an => Assembly.Load(an.Name ?? null!), null, true, true).ShouldNotBeNull();
            using var ms = new MemoryStream(response.Data.ToByteArray());
            JsonSerializer.Deserialize(ms, responseType).ShouldBeOfType<string>().ShouldBe(cmd.Value);
        }

        [Fact]
        public async Task Dispatch_CommandWithNoReply_EmptyResponseType()
        {
            var cmd = new TestCommandNoReturnValue();

            var request = CreateRequest(cmd);

            var response = await dispatcher.Dispatch(request, serverCallContext);

            response.Error.ShouldBeFalse();
            response.Type.ShouldBeNullOrEmpty();
            response.Data.IsEmpty.ShouldBeTrue();
        }

        [Fact]
        public async Task Dispatch_Query_ReplyReturned()
        {
            var query = new TestQuery
            {
                Value = Guid.NewGuid().ToString()
            };

            var request = CreateRequest(query);

            var response = await dispatcher.Dispatch(request, serverCallContext);

            response.ShouldNotBeNull().Data.ShouldNotBeNull().IsEmpty.ShouldBeFalse();
            var responseType = Type.GetType(response.Type, an => Assembly.Load(an.Name ?? null!), null, true, true).ShouldNotBeNull();
            using var ms = new MemoryStream(response.Data.ToByteArray());
            JsonSerializer.Deserialize(ms, responseType).ShouldBeOfType<TestQueryReply>().Value.ShouldBe(query.Value);
        }

        [Fact]
        public async Task CanSerializeErrors()
        {
            var request = CreateRequest(new TestThrowErrorCommand());

            var response = await dispatcher.Dispatch(request, serverCallContext);

            response.ShouldNotBeNull().Error.ShouldBeTrue();
        }

        [Fact]
        public async Task Dispatch_Event_AllHandlersAreCalled()
        {
            var request = CreateRequest(new TestEvent());

            var response = await dispatcher.Dispatch(request, serverCallContext);

            response.ShouldNotBeNull().Error.ShouldBeFalse();
            await Task.Delay(2000);
            testHandler.Calls.Count().ShouldBe(2);
            testHandler.Calls.ShouldContain(nameof(testHandler.Handle1));
            testHandler.Calls.ShouldContain(nameof(testHandler.Handle2));
        }

        private static RequestEnvelope CreateRequest<T>(T message) =>
            new RequestEnvelope
            {
                Data = UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(message)),
                Type = message?.GetType().AssemblyQualifiedName,
                CorrelationId = Guid.NewGuid().ToString(),
            };
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
        private readonly Dictionary<string, bool> calls = new Dictionary<string, bool>();

        public IEnumerable<string> Calls => calls.Keys;

        public async Task<string> HandleTestCommand(TestCommand cmd)
        {
            calls.Add(nameof(HandleTestCommand), true);
            return await Task.FromResult(cmd.Value);
        }

        public async Task HandleTestCommandNoReturnValue(TestCommandNoReturnValue cmd)
        {
            calls.Add(nameof(HandleTestThrowErrorCommand), true);
            await Task.CompletedTask;
        }

        public async Task<TestQueryReply> HandleTestQuery(TestQuery query)
        {
            calls.Add(nameof(HandleTestQuery), true);
            return await Task.FromResult(new TestQueryReply
            {
                Value = query.Value
            });
        }

        public async Task<string> HandleTestThrowErrorCommand(TestThrowErrorCommand cmd)
        {
            await Task.CompletedTask;
            calls.Add(nameof(HandleTestThrowErrorCommand), true);
            throw new NotFoundException("not found", "id");
        }

        public async Task Handle1(TestEvent evt)
        {
            await Task.CompletedTask;
            calls.Add(nameof(Handle1), true);
        }

        public async Task Handle2(TestEvent evt)
        {
            await Task.CompletedTask;
            calls.Add(nameof(Handle2), true);
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

    public class TestThrowErrorCommand : Command
    { }

    public class TestEvent : Event
    { }
}
