FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=https://*:8080;
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
ENV DOTNET_gcServer=1
ARG VERSION
ENV VERSION=$VERSION

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# install diagnostics tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src

# copy sln and csproj files to their directories
COPY ["EMBC.ESS.sln", ".editorconfig", "./"]
COPY */*.csproj ./
COPY --from=shared */*.csproj ./
RUN cat EMBC.ESS.sln \
| grep "\.csproj" \
| awk '{print $4}' \
| sed -e 's/[",]//g' \
| sed 's#\\#/#g' \
| xargs -I % sh -c 'mkdir -p $(dirname %) && mv $(basename %) $(dirname %)/'

# restore dependencies
RUN dotnet restore EMBC.ESS.sln

# copy the rest of the files
COPY --from=shared . .
COPY . .

# run unit tests
RUN dotnet test -c Release --filter "Category!=IntegrationTest" "EMBC.Tests.Unit.ESS/EMBC.Tests.Unit.ESS.csproj"

FROM build AS publish
# build
RUN dotnet publish "EMBC.ESS.Host/EMBC.ESS.Host.csproj" -c Release -o /app/publish --runtime linux-musl-x64 --no-self-contained

FROM base AS final
# copy diagnostics tools
WORKDIR /tools
COPY --from=build /tools .
# copy app
WORKDIR /app
COPY --from=publish /app/publish .


ENTRYPOINT ["dotnet", "EMBC.ESS.Host.dll"]
