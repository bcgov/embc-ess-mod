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

to run the c# services, run `dotnet watch` in the ess and api panes, to run the angular app, run `npm run startlocal` in the UI pane.

If you run into error: HttpRequestException: The SSL connection could not be established, run
```cmd
dotnet dev-certs https --trust
```

You must be on the BC government network to be able to access the Dynamics backend.

## Build and test

Every deployable component of the system has its own dockerfile which includes the entire CI pipeline - build, verify quality and run all tests. The philosophy behind this is to ensure that if a container can be built, it is tested and verified. It also means the repeatability of the build process as it would be the same in CI/CD pipelines and in local developer environment.

Due to the usage of symlinks to share code, docker builds must pass the context as tar files and not as a directory. To build the docker image locally, run the following command in a component's root folder:

```cmd
tar -czh . | docker build -t <tag> -
```

Note: tar to pipe is not supported currently in Windows, this command would only work in GIT Bash and Docker-Desktop/Rancher-Desktop, or in wsl2 with podman.

## Code Quality

### C# services

All csproj files must have the following settings:

        <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
        <AnalysisMode>Default</AnalysisMode>
        <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
        <Nullable>enable</Nullable>

.editorconfig and stylecop are used to enforce code style. and are linked to each project separately from the solution folder.

### Angular applications

## Versioning

Each component has its own semantic versioning scheme. The version is maintained  by git  tags in the format `<image name>=v<version>`.
The individual CD workflow automatically promote the version of each component using [Angular commit message conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

The version will be set as an environment variable in the generated container image, and the image will also be tagged with the version when pushed to the image registry.