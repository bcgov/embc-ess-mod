FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["EMBC.Supporters.API/EMBC.Supporters.API.csproj", "EMBC.Supporters.API/"]
COPY ["EMBC.Tests.Unit.Supporters.API/EMBC.Tests.Unit.Supporters.API.csproj", "EMBC.Tests.Unit.Supporters.API/"]
COPY ["EMBC.Supporters.sln", "stylecop.json", ".editorconfig", "./"]
RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.Supporters.API/EMBC.Supporters.API.csproj" -c Release -o /app/publish

FROM base AS final
#https://github.com/dotnet/runtime/issues/30667
RUN sed -i "s|DEFAULT@SECLEVEL=2|DEFAULT@SECLEVEL=1|g" /etc/ssl/openssl.cnf
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.Supporters.API.dll"]