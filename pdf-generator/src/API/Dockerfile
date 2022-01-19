FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=https://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENV DOTNET_gcServer=1

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build

RUN apt-get update \
    && apt-get install -y wget gnupg --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

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

RUN apt-get update \
    && apt-get install -y wget gnupg --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EMBC.PDFGenerator.dll"]