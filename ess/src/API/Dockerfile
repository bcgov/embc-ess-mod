FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=https://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["EMBC.ESS/EMBC.ESS.csproj", "EMBC.ESS/"]
COPY ["EMBC.ESS.Utilities.Dynamics/EMBC.ESS.Utilities.Dynamics.csproj", "EMBC.ESS.Utilities.Dynamics/"]
COPY ["EMBC.ESS.Shared.Contracts/EMBC.ESS.Shared.Contracts.csproj", "EMBC.ESS.Shared.Contracts/"]
COPY ["EMBC.Tests.Unit.ESS/EMBC.Tests.Unit.ESS.csproj", "EMBC.Tests.Unit.ESS/"]
COPY ["EMBC.Tests.Integration.ESS/EMBC.Tests.Integration.ESS.csproj", "EMBC.Tests.Integration.ESS/"]

COPY ["EMBC.ESS.sln", "stylecop.json", ".editorconfig", "./"]

RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.ESS/EMBC.ESS.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.ESS.dll"]