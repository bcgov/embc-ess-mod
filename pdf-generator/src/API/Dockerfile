FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=https://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["EMBC.PDFGenerator/EMBC.PDFGenerator.csproj", "EMBC.PDFGenerator/"]
COPY ["EMBC.Tests.Unit.PDFGenerator/EMBC.Tests.Unit.PDFGenerator.csproj", "EMBC.Tests.Unit.PDFGenerator/"]
COPY ["EMBC.PDFGenerator.sln", "stylecop.json", ".editorconfig", "./"]

RUN dotnet restore .
COPY . .
RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.PDFGenerator/EMBC.PDFGenerator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.PDFGenerator.dll"]