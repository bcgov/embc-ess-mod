# ERA Automated UI Tests

## Features

- SpecFlow based automation tests
- uses Selenium to drive browser scenario testing of a target environment
- supports interactive and headless modes

## Installation

Registrants secrets.json

```json
{
  "baseUrl": "https://era-evacuees-dev.apps.silver.devops.gov.bc.ca",
  "CloseBrowserAfterEachTest": true,
  "RunHeadless": true,
  "users": [
    {
      "csn": "<BCSC test user code>",
      "passcode": "<BCSC test user passcode>"
    }
  ]
}
```
Responders secrets.json

```json
{
  "baseUrl": "https://era-responders-dev.apps.silver.devops.gov.bc.ca",
  "CloseBrowserAfterEachTest": true,
  "RunHeadless": true,
  "users": [
    {
      "username": "<bceid user name of an active team member>",
      "password": "<bceid user password>",
      "role": "<the role of the above user>"
    }
  ],
  "evacuees": [
    {
      "name": "<evacuee first name>",
      "lastname": "<evacuee last name>",
      "dob": "<evacuee date of birth>"
    }
  ],
  "remoteExtentionEssFile": "<file # for remote extension scenario>"
}
```

## Usage

To run from Visual Studio, install [VS SpecFlow extension](https://marketplace.visualstudio.com/items?itemName=TechTalkSpecFlowTeam.SpecFlowForVisualStudio2022)

1. configure the secret.json files for the projects
2. run the tests

To run from the command line
1. configure the secrets.json or matching environment variables
2. run `dotnet test` in each project