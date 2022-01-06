FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG GITHUB_NUGET_USERNAME
ARG GITHUB_NUGET_PAT
WORKDIR /src
COPY ["EMBC.Registrants.API/EMBC.Registrants.API.csproj", "EMBC.Registrants.API/"]
COPY ["EMBC.ESS.Shared.Contracts/EMBC.ESS.Shared.Contracts.csproj", "EMBC.ESS.Shared.Contracts/"]
COPY ["EMBC.Utilities.Messaging/EMBC.Utilities.Messaging.csproj", "EMBC.Utilities.Messaging/"]
COPY ["EMBC.Utilities.Hosting/EMBC.Utilities.Hosting.csproj", "EMBC.Utilities.Hosting/"]
COPY ["EMBC.Utilities/EMBC.Utilities.csproj", "EMBC.Utilities/"]
COPY ["EMBC.Tests.Unit.Registrants.API/EMBC.Tests.Unit.Registrants.API.csproj", "EMBC.Tests.Unit.Registrants.API/"]
COPY ["EMBC.Registrants.sln", "stylecop.json", ".editorconfig", "./"]

# RUN dotnet nuget add source "https://nuget.pkg.github.com/bcgov/index.json" --name "github" --username "${GITHUB_NUGET_USERNAME}" --password "${GITHUB_NUGET_PAT}" --store-password-in-clear-text

RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Registrants.API/EMBC.Registrants.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Registrants.API.dll"]
