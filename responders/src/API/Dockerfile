FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["EMBC.Responders.API/EMBC.Responders.API.csproj", "EMBC.Responders.API/"]
COPY ["EMBC.Tests.Unit.Responders.API/EMBC.Tests.Unit.Responders.API.csproj", "EMBC.Tests.Unit.Responders.API/"]
COPY ["EMBC.Responders.sln", "stylecop.json", ".editorconfig", "./"]
RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Responders.API/EMBC.Responders.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Responders.API.dll"]