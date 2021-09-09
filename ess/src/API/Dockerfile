FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=https://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build

#install wkhtmltopdf for tests
WORKDIR /usr/local/bin/
RUN apt-get update && apt-get install -y \
    curl libxrender1 libfontconfig libxtst6 xz-utils
RUN curl "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb" -L -o "wkhtmltopdf.deb"
RUN apt-get install -y ./wkhtmltopdf.deb

WORKDIR /src

COPY ["EMBC.ESS/EMBC.ESS.csproj", "EMBC.ESS/"]
COPY ["EMBC.ESS.Utilities.Dynamics/EMBC.ESS.Utilities.Dynamics.csproj", "EMBC.ESS.Utilities.Dynamics/"]
COPY ["EMBC.ESS.Shared.Contracts/EMBC.ESS.Shared.Contracts.csproj", "EMBC.ESS.Shared.Contracts/"]
COPY ["EMBC.Tests.Unit.ESS/EMBC.Tests.Unit.ESS.csproj", "EMBC.Tests.Unit.ESS/"]
COPY ["EMBC.Tests.Integration.ESS/EMBC.Tests.Integration.ESS.csproj", "EMBC.Tests.Integration.ESS/"]

COPY ["EMBC.ESS.sln", "stylecop.json", ".editorconfig", "./"]

RUN dotnet restore .
COPY . .

RUN mkdir -p ./wkhtmltopdf/Linux
RUN cp /usr/local/bin/wkhtmltopdf ./wkhtmltopdf/Linux/
ENV PdfGenerator__wkHtmlToPdfLibPath=/src/wkhtmltopdf

RUN dotnet test -c Release

FROM build AS publish
RUN dotnet publish "EMBC.ESS/EMBC.ESS.csproj" -c Release -o /app/publish

FROM base AS final

#install wkhtmltopdf for runtime
WORKDIR /usr/local/bin/
RUN apt-get update && apt-get install -y \
    curl libxrender1 libfontconfig libxtst6 xz-utils
RUN curl "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb" -L -o "wkhtmltopdf.deb"
RUN apt-get install -y ./wkhtmltopdf.deb

WORKDIR /app
COPY --from=publish /app/publish .

RUN mkdir -p ./wkhtmltopdf/Linux
RUN cp /usr/local/bin/wkhtmltopdf ./wkhtmltopdf/Linux/
ENV PdfGenerator__wkHtmlToPdfLibPath=/app/wkhtmltopdf

ENTRYPOINT ["dotnet", "EMBC.ESS.dll"]