FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["EMBC.Suppliers.API/EMBC.Suppliers.API.csproj", "EMBC.Suppliers.API/"]
COPY ["EMBC.Tests.Suppliers.API/EMBC.Tests.Suppliers.API.csproj", "EMBC.Tests.Suppliers.API/"]
COPY ["EMBC.Suppliers.sln", "."]
RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Suppliers.API/EMBC.Suppliers.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Suppliers.API.dll"]