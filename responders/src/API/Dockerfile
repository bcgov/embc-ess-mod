FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
ARG GITHUB_NUGET_USERNAME
ARG GITHUB_NUGET_PAT
WORKDIR /src
COPY ["EMBC.Responders.API/EMBC.Responders.API.csproj", "EMBC.Responders.API/"]
COPY ["EMBC.Tests.Unit.Responders.API/EMBC.Tests.Unit.Responders.API.csproj", "EMBC.Tests.Unit.Responders.API/"]
COPY ["EMBC.Responders.sln", "stylecop.json", ".editorconfig", "./"]

RUN dotnet nuget add source "https://nuget.pkg.github.com/bcgov/index.json" --name "github" --username "${GITHUB_NUGET_USERNAME}" --password "${GITHUB_NUGET_PAT}" --store-password-in-clear-text

RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Responders.API/EMBC.Responders.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Responders.API.dll"]