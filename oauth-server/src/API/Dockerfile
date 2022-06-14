FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ARG VERSION
ENV VERSION=$VERSION

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
# install diagnostics tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src
COPY ["OAuthServer/OAuthServer.csproj", "OAuthServer/"]
COPY ["oauth-server.sln", ".editorconfig", "./"]
RUN dotnet restore .
COPY . .

# run unit tests
RUN dotnet test -c Release

# build
FROM build AS publish
RUN dotnet publish "OAuthServer/OAuthServer.csproj" -c Release -o /app/publish --runtime linux-x64 --no-self-contained

FROM base AS final
# copy diagnostics tools
WORKDIR /tools
COPY --from=build /tools .
# copy app
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OAuthServer.dll"]