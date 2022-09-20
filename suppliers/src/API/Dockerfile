FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
ARG VERSION
ENV VERSION=$VERSION

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["EMBC.Suppliers.API/EMBC.Suppliers.API.csproj", "EMBC.Suppliers.API/"]
COPY ["EMBC.Tests.Unit.Suppliers.API/EMBC.Tests.Unit.Suppliers.API.csproj", "EMBC.Tests.Unit.Suppliers.API/"]
COPY ["EMBC.Tests.Integration.Suppliers.API/EMBC.Tests.Integration.Suppliers.API.csproj", "EMBC.Tests.Integration.Suppliers.API/"]
COPY ["EMBC.Suppliers.sln", ".editorconfig", "./"]

RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Suppliers.API/EMBC.Suppliers.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Suppliers.API.dll"]
