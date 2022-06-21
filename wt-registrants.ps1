$currentDir = Convert-Path .

wt -M -d .\ --title registrants `; sp -d $currentDir\registrants\src\UI\embc-registrant `; sp -d $currentDir\registrants\src\API\EMBC.Registrants.API `; mf left `; sp -d $currentDir\ess\src\API\EMBC.ESS.Host