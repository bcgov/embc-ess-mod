FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=https://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENV DOTNET_gcServer=1
ARG VERSION
ENV VERSION=$VERSION

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# install diagnostics tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src
COPY ["EMBC.ESS/EMBC.ESS.csproj", "EMBC.ESS/"]
COPY ["EMBC.ESS.Host/EMBC.ESS.Host.csproj", "EMBC.ESS.Host/"]
COPY ["EMBC.ESS.Shared.Contracts/EMBC.ESS.Shared.Contracts.csproj", "EMBC.ESS.Shared.Contracts/"]
COPY ["EMBC.ESS.Utilities.Dynamics/EMBC.ESS.Utilities.Dynamics.csproj", "EMBC.ESS.Utilities.Dynamics/"]
COPY ["EMBC.ESS.Utilities.BceidWS/EMBC.ESS.Utilities.BceidWS.csproj", "EMBC.ESS.Utilities.BceidWS/"]
COPY ["EMBC.ESS.Utilities.Cas/EMBC.ESS.Utilities.Cas.csproj", "EMBC.ESS.Utilities.Cas/"]
COPY ["EMBC.Utilities.Hosting/EMBC.Utilities.Hosting.csproj", "EMBC.Utilities.Hosting/"]
COPY ["EMBC.Utilities.Caching/EMBC.Utilities.Caching.csproj", "EMBC.Utilities.Caching/"]
COPY ["EMBC.Utilities.Telemetry/EMBC.Utilities.Telemetry.csproj", "EMBC.Utilities.Telemetry/"]
COPY ["EMBC.Utilities.Messaging/EMBC.Utilities.Messaging.csproj", "EMBC.Utilities.Messaging/"]
COPY ["EMBC.Utilities/EMBC.Utilities.csproj", "EMBC.Utilities/"]
COPY ["EMBC.Tests.Unit.ESS/EMBC.Tests.Unit.ESS.csproj", "EMBC.Tests.Unit.ESS/"]
COPY ["EMBC.Tests.Integration.ESS/EMBC.Tests.Integration.ESS.csproj", "EMBC.Tests.Integration.ESS/"]
COPY ["EMBC.ESS.sln", ".editorconfig", "./"]
RUN dotnet restore .
COPY . .

# run unit tests
RUN dotnet test -c Release --filter "Category!=IntegrationTest"

FROM build AS publish
# build
RUN dotnet publish "EMBC.ESS.Host/EMBC.ESS.Host.csproj" -c Release -o /app/publish --runtime linux-musl-x64 --no-self-contained

FROM base AS final
# copy diagnostics tools
WORKDIR /tools
COPY --from=build /tools .
# copy app
WORKDIR /app
COPY --from=publish /app/publish .


ENTRYPOINT ["dotnet", "EMBC.ESS.Host.dll"]