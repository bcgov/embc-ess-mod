import { fail } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { getHTTPParams, getIterationName, logError } from '../utilities';
import { MyHttp } from './../http';
const http = new MyHttp();

export class HttpHelper {
    name: string = "";
    constructor(name: string) {
        this.name = name;
    }

    get(url: { url: string, name: string }, rate: Rate, trend: Trend, token: any = {}) {
        const params = getHTTPParams(token?.access_token);
        const response = http.get(url.url, params);
        rate.add(response.status !== 200);
        trend.add(response.timings.waiting);
        if (response.status !== 200) {
            console.error(`${this.name} - ${getIterationName()}: failed to get ${url.name}`);
            console.error(url);
        }

        try {
            return response.json();
        }
        catch (err) {
            return;
        }
    }

    post(url: { url: string, name: string }, data: any, rate: Rate, trend: Trend, token: any = {}) {
        const payload = JSON.stringify(data);
        const params = getHTTPParams(token?.access_token);

        const response = http.post(url.url, payload, params);
        rate.add(response.status !== 200);
        trend.add(response.timings.waiting);
        if (response.status !== 200) {
            console.error(`${this.name} - ${getIterationName()}: failed to post ${url}`);
            logError(response, payload);
            fail(`${this.name} - ${getIterationName()}: failed to post ${url.name}`);
        } else {
            // console.log(`${this.name} - ${getIterationName()}: successful post: ${url.name}`);
        }

        try {
            return response.json();
        }
        catch (err) {
            return;
        }
    }
}