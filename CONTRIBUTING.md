# Contributing to this project

## Forks

The repository doesn't accept direct changes and does not support in-repo branches. To contribute, fork the repository, make your changes in the forked repository, and submit a PR for the team's review.

## Developer setup

This repository is using symlinks to share code libraries between projects. In order to enable GIT to expand and follow symlinks, clone using using the following command:

```cmd
git clone -c core.symlinks=true https://github.com/<user>/embc-ess-mod.git
```

Git will expand symlinks and follow them to the actual shared libraries.

For an existing local copy, follow this to expand the symlinks (stash changes before):

```cmd
git config core.symlinks true
git reset --hard
```

The simplest way to run the portals is to use [Windows Terminal](https://www.microsoft.com/en-ca/p/windows-terminal/9n0dx20hk701) shortcuts that are in the root folder:

- `wt-registrants.ps1` will open a multi-pane tab for registrants portal
- `wt-responders.ps1` will open a multi-pane tab for responders portal

to run the c# services, run `dotnet watch` in the ess and api panes, to run the angular app, run `npm start` in the UI pane.

If you run into error: HttpRequestException: The SSL connection could not be established, run

```cmd
dotnet dev-certs https --trust
```

You must be on the BC government network to be able to access the Dynamics backend.

## Build and test

Every deployable component of the system has its own dockerfile which includes the entire CI pipeline - build, verify quality and run all tests. The philosophy behind this is to ensure that if a container can be built, it is tested and verified. It also means the repeatability of the build process as it would be the same in CI/CD pipelines and in local developer environment.

As the shared libraries are symlinked to the API projects, the image build process relies on build-context to pass in the shared libraries' code. To build an image manually, pass in a build context referring to the relative path of the shared libraries:

```cmd
docker build -t <tag> --build-context shared=../../../shared/src .
```

## Code Quality

### C# services

All csproj files must have the following settings:

```xml
        <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
        <AnalysisMode>Default</AnalysisMode>
        <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
        <Nullable>enable</Nullable>
```

.editorconfig is used to enforce code style. and are linked to each project separately from the solution folder.


### Angular applications

The build process lints the portals' code and will fail if lint fails. It is therefor recommended to run `npm run lint -- --fix` before commiting TypeScript changes.

## CI/CD

- The CI pipeline is described in each service's dockerfile. It will build and run unit tests and linting as part of the process. The CI is triggered automatically for every PR.

- The CD pipeline is based on the CI pipeline successful completion and pushing the generated image to OpenShift registry. The following branches will result in CD pipeline and image creation:

- master - will create and push images with `master` tag
- release/* - will create and push images with `release-[branch name]` tag

- Dev environments in OpenShift will automatically pick up the correct tag they're configured to watch. See [Tools Chart](./tools/helm/charts/tools/) for more details how to map a dev environment to a source tag.
