$currentDir = Convert-Path .

wt -M  -d .\ --title responders `; sp -d  $currentDir\responders\src\UI\embc-responder `; sp -d $currentDir\responders\src\API\EMBC.Responders.API `; mf left `; sp -d $currentDir\ess\src\API\EMBC.ESS.Host