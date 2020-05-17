FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["EMBC.Suppliers.API/EMBC.Suppliers.API.csproj", "EMBC.Suppliers.API/"]
COPY ["EMBC.Tests.Unit.Suppliers.API/EMBC.Tests.Unit.Suppliers.API.csproj", "EMBC.Tests.Unit.Suppliers.API/"]
COPY ["EMBC.Tests.Integration.Suppliers.API/EMBC.Tests.Integration.Suppliers.API.csproj", "EMBC.Tests.Integration.Suppliers.API/"]
COPY ["EMBC.Suppliers.sln", "."]
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