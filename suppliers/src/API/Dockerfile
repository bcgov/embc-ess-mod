FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
ARG GITHUB_NUGET_USERNAME
ARG GITHUB_NUGET_PAT
WORKDIR /src
COPY ["EMBC.Suppliers.API/EMBC.Suppliers.API.csproj", "EMBC.Suppliers.API/"]
COPY ["EMBC.Tests.Unit.Suppliers.API/EMBC.Tests.Unit.Suppliers.API.csproj", "EMBC.Tests.Unit.Suppliers.API/"]
COPY ["EMBC.Tests.Integration.Suppliers.API/EMBC.Tests.Integration.Suppliers.API.csproj", "EMBC.Tests.Integration.Suppliers.API/"]
COPY ["EMBC.Suppliers.sln", "stylecop.json", ".editorconfig", "./"]

RUN dotnet nuget add source "https://nuget.pkg.github.com/bcgov/index.json" --name "github" --username "${GITHUB_NUGET_USERNAME}" --password "${GITHUB_NUGET_PAT}" --store-password-in-clear-text

RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Suppliers.API/EMBC.Suppliers.API.csproj" -c Release -o /app/publish

FROM base AS final
#https://github.com/dotnet/runtime/issues/30667
RUN sed -i "s|DEFAULT@SECLEVEL=2|DEFAULT@SECLEVEL=1|g" /etc/ssl/openssl.cnf
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Suppliers.API.dll"]