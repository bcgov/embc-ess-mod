FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENV DOTNET_gcServer=1

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["EMBC.Registrants.API/EMBC.Registrants.API.csproj", "EMBC.Registrants.API/"]
COPY ["EMBC.ESS.Shared.Contracts/EMBC.ESS.Shared.Contracts.csproj", "EMBC.ESS.Shared.Contracts/"]
COPY ["EMBC.Utilities/EMBC.Utilities.csproj", "EMBC.Utilities/"]
COPY ["EMBC.Utilities.Hosting/EMBC.Utilities.Hosting.csproj", "EMBC.Utilities.Hosting/"]
COPY ["EMBC.Utilities.Messaging/EMBC.Utilities.Messaging.csproj", "EMBC.Utilities.Messaging/"]
COPY ["EMBC.Tests.Unit.Registrants.API/EMBC.Tests.Unit.Registrants.API.csproj", "EMBC.Tests.Unit.Registrants.API/"]
COPY ["EMBC.Registrants.sln", "stylecop.json", ".editorconfig", "./"]

RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Registrants.API/EMBC.Registrants.API.csproj" -c Release -o /app/publish --runtime linux-musl-x64 --no-self-contained

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Registrants.API.dll"]
