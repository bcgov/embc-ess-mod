Project to perform load tests on embc system.

To run locally:
intall k6 cli (https://k6.io/docs/getting-started/installation/)
npm install

Webpack is used to dynamically set the parameters import. By default there is a empty template file.
It is configured that if you run one of the load test scripts, it expects to find a dev parameters file. This can be shared by the team.
This can also be customized to whatever you want by updating the NormalModuleReplacementPlugin in webpack.config.js


There are multiple test entry points configured in package.json (testRegistrant, testResponder, loadTest, benchmark)
e.g.

npm run <scriptName>

Responder and Registrant tests can be run independantly. They will by default do 1 vu and 1 iteration, but you can dynamically set those with arguments. e.g.
npm run testRegistrant -- -e VUS=# -e ITERS=#
npm run testResponder -- -e VUS=# -e ITERS=#


There is a benchmark test configured to run the distribution matrix defined in the Load Testing plan.
You can pass this a parameter for the number of vus to run for this benchmark. (Will default to one vu each)
By defaul this will run for a duration of 5 minutes.
You can optionally pass in an interation count for each vu to do instead of a set 5m duration.

npm run benchmark -- -e VUS=#
npm run benchmark -- -e VUS=# -e ITERS=#